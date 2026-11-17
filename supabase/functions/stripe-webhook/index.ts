// Rune Thread: Stripe webhook. Records paid diamond top-ups. Deploy with --no-verify-jwt (Stripe does not send a Supabase JWT).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

// Diamonds per paid amount. Key: "<currency>:<amount in minor units>".
const PACKS: Record<string, number> = {
  "thb:30000": 4200, // 300 THB = 4,200 diamonds
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
  if (event.type !== "checkout.session.completed") return new Response("ignored", { status: 200 });

  const s = event.data.object;
  if (s.payment_status !== "paid") return new Response("not paid", { status: 200 });

  const uid: string = s.client_reference_id ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(uid)) return new Response("no player id", { status: 200 });

  const diamonds = PACKS[`${s.currency}:${s.amount_total}`];
  if (!diamonds) return new Response("unknown pack", { status: 200 });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { error } = await supabase.from("diamond_topups").insert({
    payment_id: s.id,
    user_id: uid,
    diamonds,
    amount_total: s.amount_total,
    currency: s.currency,
  });
  // 23505 = already recorded (Stripe retried). Acknowledge without crediting again.
  if (error && error.code !== "23505") return new Response("database error", { status: 500 });

  return new Response("ok", { status: 200 });
});
