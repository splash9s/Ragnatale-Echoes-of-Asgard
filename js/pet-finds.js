// ==========================================
// PET DAILY FIND
// The first time each day you pet a pet (main page or tent), it tells you what it did today
// and gives you what it found. Once per pet per day. Not while visiting a friend's tent.
// Uses: petName, petDayKey, friendTentVisiting, placeItemInInventory, showModal, itemIconHTML (ui.js)
// ==========================================

// What a pet can find. Weight = chance out of 100: the more an item is worth, the rarer it is.
// (Gold prices: Ingot 10, Plank 20, Minor Potion 100, Bar 100, Medium Potion 300, Alloy 1,000,
//  Large Potion 2,000. Elemental Stones cost 50 Diamonds, so they are the rarest.)
const PET_FIND_TABLE = [
    { kind: 'ore',    tier: 1,                 min: 3, max: 8, weight: 28 }, // Ingot
    { kind: 'plank',                           min: 2, max: 5, weight: 24 },
    { kind: 'potion', id: 'potion_minor',      min: 1, max: 3, weight: 18 },
    { kind: 'ore',    tier: 2,                 min: 1, max: 2, weight: 12 }, // Bar
    { kind: 'potion', id: 'potion_med',        min: 1, max: 2, weight: 9 },
    { kind: 'ore',    tier: 3,                 min: 1, max: 1, weight: 4 },  // Alloy
    { kind: 'potion', id: 'potion_large',      min: 1, max: 1, weight: 3 },
    { kind: 'stone',                           min: 1, max: 1, weight: 2 },  // random element
];

// 100 short stories. {pet} = the pet's name, {item} = what it found (amount and name).
const PET_FIND_STORIES = [
    ["Today {pet} walked around the tent and found {item}.", "วันนี้ {pet} เดินเล่นรอบเต็นท์ แล้วเจอ {item}"],
    ["{pet} dug under the old oak tree and came back with {item}.", "{pet} ขุดใต้ต้นโอ๊กเก่า แล้วคาบ {item} กลับมา"],
    ["{pet} chased a butterfly into the bushes and tumbled out holding {item}.", "{pet} วิ่งไล่ผีเสื้อเข้าพุ่มไม้ แล้วกลิ้งออกมาพร้อม {item}"],
    ["A merchant's cart rattled past. {pet} followed it and returned with {item}.", "เกวียนพ่อค้าแล่นผ่านไป {pet} ตามไปแล้วกลับมาพร้อม {item}"],
    ["{pet} napped on a sunny rock and woke up next to {item}.", "{pet} นอนอาบแดดบนก้อนหิน ตื่นมาก็เจอ {item} อยู่ข้างๆ"],
    ["{pet} sneaked into the blacksmith's shed and borrowed {item}. Nobody noticed.", "{pet} แอบเข้าโรงตีเหล็ก แล้วยืม {item} มา ไม่มีใครรู้ตัว"],
    ["{pet} sniffed along the riverbank all morning and found {item} in the reeds.", "{pet} ดมกลิ่นริมแม่น้ำทั้งเช้า แล้วเจอ {item} ในพงอ้อ"],
    ["While you were away, {pet} guarded the tent and caught a thief dropping {item}.", "ตอนคุณไม่อยู่ {pet} เฝ้าเต็นท์ และจับขโมยที่ทำ {item} หล่นไว้ได้"],
    ["{pet} climbed the watchtower and knocked {item} down from the top shelf.", "{pet} ปีนหอสังเกตการณ์ แล้วปัด {item} ตกลงมาจากชั้นบนสุด"],
    ["{pet} played with the village children, who gave it {item} as thanks.", "{pet} เล่นกับเด็กๆ ในหมู่บ้าน เด็กๆ เลยให้ {item} เป็นของขอบคุณ"],
    ["{pet} found a hole in the fence, wandered off, and came home with {item}.", "{pet} เจอรูที่รั้ว เดินหายไป แล้วกลับบ้านพร้อม {item}"],
    ["{pet} pawed at a loose floorboard and uncovered {item}.", "{pet} ตะกุยแผ่นไม้ที่หลวม แล้วเจอ {item} ซ่อนอยู่ข้างใต้"],
    ["{pet} followed a strange glow into the forest and brought back {item}.", "{pet} ตามแสงประหลาดเข้าป่า แล้วนำ {item} กลับมา"],
    ["{pet} sat with the old fisherman all day. He left {item} behind for it.", "{pet} นั่งกับลุงชาวประมงทั้งวัน ลุงเลยทิ้ง {item} ไว้ให้"],
    ["A gust of wind blew {item} right into {pet}'s paws.", "ลมพัดแรงจน {item} ปลิวมาตกที่อุ้งเท้าของ {pet}"],
    ["{pet} rolled in the hay and came out covered in straw, holding {item}.", "{pet} กลิ้งเล่นในกองฟาง ออกมาตัวเต็มไปด้วยฟาง พร้อม {item}"],
    ["{pet} stared at a crow until it dropped {item} and flew away.", "{pet} จ้องอีกาจนมันทำ {item} หล่นแล้วบินหนีไป"],
    ["{pet} explored the inn's cellar and found {item} behind a barrel.", "{pet} สำรวจห้องใต้ดินของโรงเตี๊ยม แล้วเจอ {item} หลังถังไม้"],
    ["{pet} trotted proudly back to the tent with {item} in its mouth.", "{pet} เดินกลับเต็นท์อย่างภูมิใจ พร้อม {item} คาบไว้ในปาก"],
    ["{pet} helped the shopkeeper chase away a mouse and was paid with {item}.", "{pet} ช่วยแม่ค้าไล่หนู เลยได้ค่าจ้างเป็น {item}"],
    ["{pet} wandered the market stalls and somehow came back with {item}.", "{pet} เดินเล่นแถวแผงตลาด แล้วกลับมาพร้อม {item} ได้ยังไงก็ไม่รู้"],
    ["{pet} found {item} tangled in an old fishing net.", "{pet} เจอ {item} ติดอยู่ในอวนจับปลาเก่า"],
    ["After the rain, {pet} splashed through the puddles and found {item}.", "หลังฝนตก {pet} วิ่งลุยแอ่งน้ำ แล้วเจอ {item}"],
    ["{pet} kept watch at the gate all night. By morning it had {item}.", "{pet} เฝ้าประตูทั้งคืน พอรุ่งเช้าก็มี {item} อยู่ด้วย"],
    ["{pet} followed the cart's wheel tracks and found {item} that fell off.", "{pet} เดินตามรอยล้อเกวียน แล้วเจอ {item} ที่ตกลงมา"],
    ["{pet} curled up in your boots and was hiding {item} in there.", "{pet} นอนขดอยู่ในรองเท้าบูทของคุณ และซ่อน {item} ไว้ในนั้น"],
    ["{pet} visited the training dummy and found {item} stuck in the straw.", "{pet} ไปหาหุ่นฟาง แล้วเจอ {item} ติดอยู่ในฟาง"],
    ["{pet} watched the forge fire for hours and was rewarded with {item}.", "{pet} นั่งดูไฟในเตาหลอมอยู่หลายชั่วโมง เลยได้ {item} เป็นรางวัล"],
    ["{pet} dug in the garden and proudly presented {item}.", "{pet} ขุดดินในสวน แล้วนำ {item} มาอวดอย่างภูมิใจ"],
    ["A traveling bard sang to {pet} and left {item} as a gift.", "นักกวีพเนจรร้องเพลงให้ {pet} ฟัง แล้วทิ้ง {item} ไว้เป็นของขวัญ"],
    ["{pet} sneezed at a dusty crate, and {item} fell out.", "{pet} จามใส่ลังที่ฝุ่นจับ แล้ว {item} ก็หล่นออกมา"],
    ["{pet} met the black cat by the shop. They traded, and {pet} got {item}.", "{pet} เจอแมวดำหน้าร้าน ทั้งคู่แลกของกัน {pet} ได้ {item} มา"],
    ["{pet} hunted in the tall grass and came back with {item} instead of a mouse.", "{pet} ล่าในหญ้าสูง แต่กลับมาพร้อม {item} แทนที่จะเป็นหนู"],
    ["{pet} slipped into the storehouse and came out with {item}. Good find!", "{pet} แอบเข้าโกดัง แล้วออกมาพร้อม {item} เจอของดีเลย!"],
    ["{pet} followed the smell of baking bread and found {item} along the way.", "{pet} ตามกลิ่นขนมปังอบ แล้วเจอ {item} ระหว่างทาง"],
    ["{pet} sat on the roof watching the stars and knocked {item} off the chimney.", "{pet} นั่งดูดาวบนหลังคา แล้วปัด {item} ตกจากปล่องไฟ"],
    ["{pet} spent the day by the well and fished out {item}.", "{pet} ใช้เวลาทั้งวันข้างบ่อน้ำ แล้วเขี่ย {item} ขึ้นมาได้"],
    ["{pet} stalked a lizard behind the anvil and found {item} there.", "{pet} ย่องตามจิ้งจกหลังทั่งตีเหล็ก แล้วเจอ {item} ตรงนั้น"],
    ["{pet} chewed through an old sack and {item} spilled out.", "{pet} กัดกระสอบเก่าจนขาด แล้ว {item} ก็ไหลออกมา"],
    ["{pet} came back muddy from the swamp, carrying {item}.", "{pet} กลับมาตัวเปื้อนโคลนจากหนองน้ำ พร้อมคาบ {item}"],
    ["{pet} followed you halfway to the gate, then turned back with {item}.", "{pet} เดินตามคุณไปครึ่งทางถึงประตู แล้วหันกลับมาพร้อม {item}"],
    ["{pet} batted at a hanging lantern until {item} dropped from it.", "{pet} ตบโคมไฟที่แขวนอยู่จน {item} หล่นลงมา"],
    ["{pet} found a secret burrow and borrowed {item} from its owner.", "{pet} เจอโพรงลับ แล้วยืม {item} มาจากเจ้าของโพรง"],
    ["{pet} went up the hill to watch the sunrise and came back with {item}.", "{pet} ขึ้นเนินไปดูพระอาทิตย์ขึ้น แล้วกลับมาพร้อม {item}"],
    ["The healer petted {pet} and slipped it {item}.", "หมอยาลูบหัว {pet} แล้วแอบให้ {item} มา"],
    ["{pet} pushed open the toolbox and picked out {item} for you.", "{pet} ดันกล่องเครื่องมือเปิด แล้วเลือก {item} มาให้คุณ"],
    ["{pet} found {item} under a market bench, right where someone dropped it.", "{pet} เจอ {item} ใต้ม้านั่งในตลาด ตรงที่มีคนทำหล่นไว้"],
    ["{pet} spent all morning grooming, then dragged in {item}.", "{pet} เลียขนทั้งเช้า แล้วลาก {item} เข้ามา"],
    ["{pet} wandered into the pet house next door and came back with {item}.", "{pet} เดินเข้าบ้านสัตว์เลี้ยงข้างๆ แล้วกลับมาพร้อม {item}"],
    ["{pet} heard something rattle in the woodpile and found {item}.", "{pet} ได้ยินเสียงกุกกักในกองฟืน แล้วเจอ {item}"],
    ["{pet} tracked a fox to its den. The fox ran off, and {pet} took {item}.", "{pet} ตามรอยจิ้งจอกไปถึงโพรง จิ้งจอกหนีไป {pet} เลยเอา {item} มา"],
    ["{pet} curled up in the expedition bag and was sitting on {item}.", "{pet} ขดตัวในกระเป๋าเดินทาง และนั่งทับ {item} อยู่"],
    ["{pet} sat by the road waving its tail at travelers. One left {item}.", "{pet} นั่งข้างทางโบกหางให้นักเดินทาง มีคนหนึ่งทิ้ง {item} ไว้ให้"],
    ["{pet} climbed the old windmill and found {item} in the gears.", "{pet} ปีนกังหันลมเก่า แล้วเจอ {item} ติดอยู่ในฟันเฟือง"],
    ["{pet} chased its own tail for a while, then remembered to bring you {item}.", "{pet} ไล่งับหางตัวเองอยู่พักใหญ่ แล้วนึกขึ้นได้ว่าต้องเอา {item} มาให้คุณ"],
    ["{pet} slept in the sun all day, and {item} just appeared next to it. Lucky!", "{pet} นอนอาบแดดทั้งวัน แล้ว {item} ก็โผล่มาข้างตัว โชคดีจัง!"],
    ["{pet} explored the ruins outside town and returned with {item}.", "{pet} สำรวจซากปรักหักพังนอกเมือง แล้วกลับมาพร้อม {item}"],
    ["{pet} helped the woodcutter count logs and earned {item}.", "{pet} ช่วยคนตัดไม้นับท่อนไม้ เลยได้ {item} เป็นค่าแรง"],
    ["{pet} played hide and seek behind the tent and found {item} in its hiding spot.", "{pet} เล่นซ่อนหาหลังเต็นท์ แล้วเจอ {item} ในที่ซ่อน"],
    ["{pet} heard thunder, hid under a cart, and found {item} there.", "{pet} ได้ยินเสียงฟ้าร้อง เลยมุดใต้เกวียน แล้วเจอ {item} ตรงนั้น"],
    ["{pet} brought you {item}. It looks very pleased with itself.", "{pet} นำ {item} มาให้คุณ ดูภูมิใจในตัวเองมาก"],
    ["{pet} watched the guards practice and picked up {item} they left behind.", "{pet} ดูทหารยามซ้อมรบ แล้วเก็บ {item} ที่พวกเขาลืมไว้"],
    ["{pet} dug through the snow near the gate and found {item}.", "{pet} ขุดหิมะใกล้ประตูเมือง แล้วเจอ {item}"],
    ["{pet} followed a trail of glowing pebbles and ended up with {item}.", "{pet} เดินตามทางกรวดเรืองแสง แล้วได้ {item} มา"],
    ["{pet} spent the afternoon at the mine entrance and came out with {item}.", "{pet} ใช้เวลาช่วงบ่ายที่ปากเหมือง แล้วออกมาพร้อม {item}"],
    ["{pet} nudged a sleeping traveler, who gave it {item} to be left alone.", "{pet} เอาหัวดุนนักเดินทางที่หลับอยู่ เขาเลยให้ {item} เพื่อไล่ไป"],
    ["{pet} found {item} wrapped in an old cloth by the shrine.", "{pet} เจอ {item} ห่อผ้าเก่าวางอยู่ข้างศาลเจ้า"],
    ["{pet} raced the cart man's boy and won {item}.", "{pet} วิ่งแข่งกับลูกชายคนเข็นเกวียน แล้วชนะได้ {item}"],
    ["{pet} kept knocking things off the shelf until {item} fell into its paws.", "{pet} ปัดของตกจากชั้นไปเรื่อยๆ จน {item} ตกลงมาที่อุ้งเท้า"],
    ["{pet} crept into the herb garden and came out smelling of mint, with {item}.", "{pet} ย่องเข้าสวนสมุนไพร ออกมาตัวหอมกลิ่นมินต์ พร้อม {item}"],
    ["{pet} saw a shooting star last night and found {item} where it seemed to land.", "เมื่อคืน {pet} เห็นดาวตก แล้วไปเจอ {item} ตรงที่มันน่าจะตก"],
    ["{pet} unraveled a ball of yarn and found {item} inside.", "{pet} เล่นกับไหมพรมจนคลายออก แล้วเจอ {item} อยู่ข้างใน"],
    ["{pet} sniffed every barrel in the market and found {item} in the last one.", "{pet} ดมทุกถังในตลาด แล้วเจอ {item} ในถังสุดท้าย"],
    ["{pet} slept in the shadow of the expedition gate and woke up hugging {item}.", "{pet} นอนในเงาประตูออกเดินทาง ตื่นมาก็กอด {item} อยู่"],
    ["{pet} made friends with a stray dog. Together they found {item}.", "{pet} ผูกมิตรกับหมาจรจัด แล้วช่วยกันหา {item} จนเจอ"],
    ["{pet} waited by the forge, and the smith tossed it {item}.", "{pet} รอข้างเตาหลอม ช่างตีเหล็กเลยโยน {item} ให้"],
    ["{pet} found {item} buried in the sand by the lake.", "{pet} เจอ {item} ฝังอยู่ในทรายริมทะเลสาบ"],
    ["{pet} returned from a long walk with {item} and a few burrs in its fur.", "{pet} กลับมาจากการเดินไกล พร้อม {item} และเศษหญ้าติดขน"],
    ["{pet} sat in front of the shop window until the owner gave it {item}.", "{pet} นั่งหน้าหน้าต่างร้านค้า จนเจ้าของร้านยอมให้ {item}"],
    ["{pet} explored the inn's attic and found {item} in a dusty chest.", "{pet} สำรวจห้องใต้หลังคาโรงเตี๊ยม แล้วเจอ {item} ในหีบฝุ่นเขรอะ"],
    ["{pet} followed the moonlight down the path and found {item}.", "{pet} เดินตามแสงจันทร์ไปตามทาง แล้วเจอ {item}"],
    ["{pet} spent the day bothering the chickens and came back with {item}.", "{pet} ใช้เวลาทั้งวันแกล้งไก่ แล้วกลับมาพร้อม {item}"],
    ["{pet} pulled {item} out of a hollow log.", "{pet} ดึง {item} ออกมาจากขอนไม้กลวง"],
    ["{pet} tagged along on a short patrol and came back with {item}.", "{pet} แอบตามหน่วยลาดตระเวนไปสั้นๆ แล้วกลับมาพร้อม {item}"],
    ["{pet} found {item} next to a mysterious footprint. Spooky!", "{pet} เจอ {item} ข้างรอยเท้าปริศนา น่าขนลุกจัง!"],
    ["{pet} danced around the campfire and kicked {item} out of the ashes.", "{pet} เต้นรอบกองไฟ แล้วเขี่ย {item} ขึ้นมาจากขี้เถ้า"],
    ["{pet} was gone all morning. At noon it came back with {item}.", "{pet} หายไปทั้งเช้า ตอนเที่ยงก็กลับมาพร้อม {item}"],
    ["{pet} checked every corner of the tent twice and found {item}.", "{pet} ตรวจทุกมุมของเต็นท์สองรอบ แล้วเจอ {item}"],
    ["{pet} rescued a baby bird, and its mother dropped {item} as thanks.", "{pet} ช่วยลูกนกไว้ แม่นกเลยทิ้ง {item} ไว้เป็นการขอบคุณ"],
    ["{pet} found the guild notice board and pulled {item} off it.", "{pet} เจอกระดานประกาศกิลด์ แล้วดึง {item} ลงมา"],
    ["{pet} stretched, yawned, and pushed {item} toward you.", "{pet} บิดขี้เกียจ หาว แล้วดัน {item} มาทางคุณ"],
    ["{pet} followed a trail of crumbs and ended up with {item}.", "{pet} เดินตามเศษขนมปัง แล้วได้ {item} มา"],
    ["{pet} sat on an old treasure map and found {item} where X marks the spot.", "{pet} นั่งทับแผนที่สมบัติเก่า แล้วไปเจอ {item} ตรงจุดกากบาท"],
    ["{pet} watched the rain from the doorway, then dashed out for {item}.", "{pet} ดูฝนจากหน้าประตู แล้ววิ่งออกไปคาบ {item} มา"],
    ["{pet} found {item} stuck in the wheel of the old cart.", "{pet} เจอ {item} ติดอยู่ในล้อเกวียนเก่า"],
    ["{pet} visited every tent in camp and came back with {item}.", "{pet} เดินเยี่ยมทุกเต็นท์ในค่าย แล้วกลับมาพร้อม {item}"],
    ["{pet} dug a hole, gave up, dug another, and found {item}.", "{pet} ขุดหลุม แล้วเลิก ขุดใหม่อีกหลุม แล้วก็เจอ {item}"],
    ["{pet} saw how hard you have been working and brought you {item}.", "{pet} เห็นว่าคุณเหนื่อย เลยนำ {item} มาให้"],
    ["{pet} chased the morning mist across the field and caught {item}.", "{pet} ไล่จับหมอกยามเช้าข้ามทุ่ง แล้วจับได้ {item}"],
    ["{pet} sat quietly beside you, then dropped {item} at your feet.", "{pet} นั่งเงียบๆ ข้างคุณ แล้ววาง {item} ไว้ที่เท้าคุณ"],
];

function petFindEsc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function petFindName(en) {
    if (currentLanguage === 'th' && typeof NAMES_TH !== 'undefined' && NAMES_TH[en]) return NAMES_TH[en];
    return en;
}

// Rolls one find from the table: { item, qty, isStone, element }
function rollPetFind() {
    const total = PET_FIND_TABLE.reduce((a, r) => a + r.weight, 0);
    let x = Math.random() * total;
    let row = PET_FIND_TABLE[PET_FIND_TABLE.length - 1];
    for (const r of PET_FIND_TABLE) { if ((x -= r.weight) < 0) { row = r; break; } }
    const qty = row.min + Math.floor(Math.random() * (row.max - row.min + 1));
    if (row.kind === 'ore') return { item: { ...REFINE_MATERIAL_ITEMS[row.tier], qty }, qty };
    if (row.kind === 'plank') return { item: { ...PLANK_ITEM, qty }, qty };
    if (row.kind === 'potion') return { item: { ...GOLD_SHOP_CONSUMABLES.find(i => i.id === row.id), qty }, qty };
    const els = ['fire', 'wind', 'earth', 'water'];
    const el = els[Math.floor(Math.random() * els.length)];
    const tpl = (typeof DIAMOND_SHOP_ITEMS !== 'undefined' && DIAMOND_SHOP_ITEMS.find(i => i.id === 'estone_' + el)) || {};
    return { item: { ...tpl, type: 'estone', element: el, qty }, qty, isStone: true, element: el };
}

// Gives the find. Returns false when the bag has no room (the pet keeps it for the next pet).
function grantPetFind(f) {
    if (f.isStone) {
        if (!player.elementStones) player.elementStones = { fire: 0, wind: 0, earth: 0, water: 0 };
        player.elementStones[f.element] = (player.elementStones[f.element] || 0) + f.qty;
        return true;
    }
    return placeItemInInventory({ ...f.item });
}

// Called after a pet is petted. Once per pet per day; shows the story with the item.
function petDailyFind(petItem) {
    if (!petItem || (typeof friendTentVisiting === 'function' && friendTentVisiting())) return;
    const day = petDayKey();
    if (petItem.lastFindDay === day) return;
    const f = rollPetFind();
    if (!f.item || !f.item.name) return;
    if (!grantPetFind(f)) {
        floatFailAt(currentLanguage === 'th' ? 'กระเป๋าเต็ม สัตว์เลี้ยงเก็บของไว้ให้ ลองลูบอีกครั้งเมื่อมีที่ว่าง' : 'Bag full. Your pet is keeping its find. Make room and pet it again.');
        return;
    }
    petItem.lastFindDay = day; // the day's find is used only once it is in your hands
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGame === 'function') saveGame();

    const th = currentLanguage === 'th';
    const pet = petName(petItem);
    const itemName = petFindName(f.item.name);
    const itemText = `${f.qty} ${itemName}`;
    const story = PET_FIND_STORIES[Math.floor(Math.random() * PET_FIND_STORIES.length)][th ? 1 : 0];
    const storyHTML = petFindEsc(story)
        .split('{pet}').join(`<b class="pf-pet">${petFindEsc(pet)}</b>`)
        .split('{item}').join(`<b class="pf-item">${petFindEsc(itemText)}</b>`);
    const lore = petFindName(f.item.lore || f.item.desc || ''); // Thai lore comes from NAMES_TH when there is one
    const title = th ? `วันนี้ ${pet} ทำอะไร` : `What ${pet} did today`;

    // In battle a window would interrupt the fight: show a short float instead
    const inCombat = !document.getElementById('view-combat')?.classList.contains('hidden');
    if (inCombat) { floatSuccessAt(`${pet}: +${itemText}`); return; }

    const html = `<div class="pet-find">
        <p class="pf-story">${storyHTML}</p>
        <div class="pf-card">
            <div class="pf-icon">${itemIconHTML(f.item, 76)}<span class="pf-qty">x${f.qty}</span></div>
            <div class="pf-text"><div class="pf-name">${petFindEsc(itemName)}</div>${lore ? `<div class="pf-lore">${petFindEsc(lore)}</div>` : ''}</div>
        </div>
        <button class="pf-ok" onclick="closeModal()">${th ? 'ขอบใจนะ!' : 'Thank you!'}</button>
    </div>`;
    showModal(title, '', html);
}
