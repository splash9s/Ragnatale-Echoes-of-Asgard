// Rune Thread: Stripe webhook. Records paid diamond top-ups. Deploy with --no-verify-jwt (Stripe does not send a Supabase JWT).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// Diamonds per paid amount. Key: "<currency>:<amount in minor units>".
const PACKS: Record<string, number> = {
  "thb:30000": 4200, // 300 THB = 4,200 diamonds
  // USD packs (price in cents)
  "usd:100": 500,    // $1 = 500 diamonds
  "usd:590": 4000,   // $5.90 = 4,000 diamonds
  "usd:990": 8000,   // $9.90 = 8,000 diamonds
  "usd:1900": 18000, // $19 = 18,000 diamonds
  "usd:2900": 30000, // $29 = 30,000 diamonds
};

// Gold packs use the same prices as diamond packs, so the game marks them: client_reference_id = "<user id>|gold".
const GOLD_PACKS: Record<string, number> = {
  "gold:usd:100": 30000,   // $1 = 30,000 gold
  "gold:usd:290": 100000,  // $2.90 = 100,000 gold
};

const enc = new TextEncoder();
const TOLERANCE_SECONDS = 300;

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Checks the Stripe-Signature header: t=<unix time>,v1=<hmac>[,v1=...]
async function verifySignature(body: string, header: string, secret: string): Promise<boolean> {
  let t = "";
  const sigs: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=");
    if (k === "t") t = v ?? "";
    if (k === "v1" && v) sigs.push(v);
  }
  const ts = Number(t);
  if (!ts || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - ts) > TOLERANCE_SECONDS) return false;
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = hex(await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${body}`)));
  return sigs.some((s) => safeEqual(s, expected));
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) return new Response("webhook secret not set", { status: 500 });

  const body = await req.text();
  if (!(await verifySignature(body, req.headers.get("stripe-signature") ?? "", secret))) {
    return new Response("bad signature", { status: 400 });
  }

  const event = JSON.parse(body);

  // A full refund takes back what that payment added. The game applies it on the next sign-in, never below zero.
  if (event.type === "charge.refunded") {
    const c = event.data.object;
    if (!c.refunded) return new Response("partial refund ignored", { status: 200 });
    const pi = String(c.payment_intent ?? "");
    if (!pi) return new Response("no payment intent", { status: 200 });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const { data: orig, error: findErr } = await admin
      .from("diamond_topups").select("user_id, diamonds, gold").eq("payment_intent", pi).maybeSingle();
    if (findErr) return new Response("database error", { status: 500 });
    if (!orig) return new Response("no top-up for this payment", { status: 200 });

    const { error: refundErr } = await admin.from("diamond_topups").insert({
      payment_id: `refund_${c.id}`,
      user_id: orig.user_id,
      diamonds: -orig.diamonds,
      gold: -orig.gold,
      amount_total: -(c.amount_refunded ?? 0),
      currency: c.currency,
      payment_intent: pi,
      claimed: false,
    });
    // 23505 = already recorded (Stripe retried). Acknowledge without reversing again.
    if (refundErr && refundErr.code !== "23505") return new Response("database error", { status: 500 });
    return new Response("refund recorded", { status: 200 });
  }

  if (event.type !== "checkout.session.completed") return new Response("ignored", { status: 200 });

  const s = event.data.object;
  if (s.payment_status !== "paid") return new Response("not paid", { status: 200 });

  const [uid, tag] = String(s.client_reference_id ?? "").split("|");
  if (!/^[0-9a-f-]{36}$/i.test(uid ?? "")) return new Response("no player id", { status: 200 });

  const key = `${s.currency}:${s.amount_total}`;
  let diamonds = 0;
  let gold = 0;
  if (tag === "gold") {
    gold = GOLD_PACKS[`gold:${key}`] ?? 0;
    if (!gold) return new Response("unknown pack", { status: 200 });
  } else {
    diamonds = PACKS[key] ?? 0;
    if (!diamonds) return new Response("unknown pack", { status: 200 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { error } = await supabase.from("diamond_topups").insert({
    payment_id: s.id,
    user_id: uid,
    diamonds,
    gold,
    amount_total: s.amount_total,
    currency: s.currency,
    payment_intent: s.payment_intent ?? null,
  });
  // 23505 = already recorded (Stripe retried). Acknowledge without crediting again.
  if (error && error.code !== "23505") return new Response("database error", { status: 500 });

  return new Response("ok", { status: 200 });
});
