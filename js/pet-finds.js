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

// 100 short playful stories. {pet} = the pet's name, {item} = what it found (amount and name).
const PET_FIND_STORIES = [
    ["{pet} tried to catch its own shadow all morning. It failed, but tripped over {item}, so it counts as a win.", "{pet} พยายามจับเงาตัวเองทั้งเช้า จับไม่ได้หรอก แต่สะดุด {item} เข้า ถือว่าชนะ!"],
    ["{pet} sat on {item} for three hours and refused to move. You may have it now. Probably.", "{pet} นั่งทับ {item} อยู่สามชั่วโมงไม่ยอมลุก ตอนนี้ยอมให้คุณแล้ว... มั้งนะ"],
    ["{pet} knocked {item} off the table, looked you dead in the eye, and knocked it off again. It's yours now.", "{pet} ปัด {item} ตกโต๊ะ จ้องตาคุณ แล้วปัดตกอีกรอบ ตอนนี้เป็นของคุณแล้ว"],
    ["{pet} challenged a chicken to a staring contest. The chicken blinked first and surrendered {item}.", "{pet} ท้าไก่แข่งจ้องตา ไก่กะพริบก่อน เลยต้องยอมยก {item} ให้"],
    ["{pet} fell asleep in the blacksmith's bucket and woke up next to {item}. The smith pretends not to know.", "{pet} หลับในถังน้ำของช่างตีเหล็ก ตื่นมาก็เจอ {item} ข้างตัว ช่างทำเป็นไม่รู้ไม่เห็น"],
    ["{pet} sneezed so hard it rolled into a bush. Inside the bush: {item}. Bless you!", "{pet} จามแรงจนกลิ้งเข้าพุ่มไม้ ในพุ่มไม้มี {item} อยู่ด้วย ขอให้หายไวๆ นะ!"],
    ["{pet} declared war on a butterfly. The butterfly won, but {pet} got {item} as a consolation prize.", "{pet} ประกาศสงครามกับผีเสื้อ ผีเสื้อชนะ แต่ {pet} ได้ {item} เป็นรางวัลปลอบใจ"],
    ["{pet} squeezed into a box way too small for it. The box contained {item}. Science!", "{pet} ยัดตัวเองเข้ากล่องที่เล็กเกินไปมาก ในกล่องมี {item} นี่แหละวิทยาศาสตร์!"],
    ["{pet} \"helped\" the shopkeeper by sleeping on the counter. She paid it {item} to please move.", "{pet} \"ช่วย\" แม่ค้าด้วยการนอนบนเคาน์เตอร์ แม่ค้าเลยจ่าย {item} ขอร้องให้ย้ายไปที"],
    ["{pet} chased its tail for twenty laps, got dizzy, and fell right onto {item}.", "{pet} ไล่งับหางตัวเองยี่สิบรอบ เวียนหัว แล้วล้มทับ {item} พอดี"],
    ["{pet} stole a sausage from the inn, felt guilty, and traded it for {item}. Character growth!", "{pet} ขโมยไส้กรอกจากโรงเตี๊ยม แล้วรู้สึกผิด เลยเอาไปแลก {item} มา โตขึ้นเยอะเลย!"],
    ["{pet} yelled at the moon until it got bored. On the way home it found {item}.", "{pet} ตะโกนใส่พระจันทร์จนเบื่อ ระหว่างทางกลับบ้านเลยเจอ {item}"],
    ["{pet} tried to sneak up on a sleeping dog. The dog woke up. {pet} ran so fast it found {item} on the way.", "{pet} ย่องเข้าหาหมาที่หลับอยู่ หมาตื่น {pet} วิ่งหนีเร็วมากจนเจอ {item} ระหว่างทาง"],
    ["{pet} brought you {item} and a very crunchy leaf. The leaf is a gift too. Please act surprised.", "{pet} เอา {item} มาให้ พร้อมใบไม้แห้งกรอบอีกหนึ่งใบ ใบไม้ก็เป็นของขวัญนะ ช่วยทำหน้าดีใจด้วย"],
    ["{pet} spent the day pretending to be a loaf of bread. A passing baker left {item}.", "{pet} ใช้เวลาทั้งวันทำตัวเป็นขนมปังก้อน คนทำขนมปังเดินผ่านเลยทิ้ง {item} ไว้ให้"],
    ["{pet} attacked the training dummy and lost. The dummy dropped {item} out of pity.", "{pet} บุกโจมตีหุ่นฟางแล้วแพ้ หุ่นฟางสงสาร เลยทำ {item} หล่นไว้ให้"],
    ["{pet} found {item} and is now walking around like it owns the whole town.", "{pet} เจอ {item} แล้วตอนนี้เดินวางท่าเหมือนเป็นเจ้าของทั้งเมือง"],
    ["{pet} got stuck in a barrel. The moment you looked away, it escaped with {item}.", "{pet} ติดอยู่ในถังไม้ พอคุณเผลอ มันก็หลุดออกมาพร้อม {item}"],
    ["{pet} hid in your bag to surprise you. Surprise! It brought {item}.", "{pet} แอบซ่อนในกระเป๋าเพื่อเซอร์ไพรส์คุณ เซอร์ไพรส์! มันเอา {item} มาด้วย"],
    ["{pet} tried to climb the tallest tree in camp, panicked halfway up, and came down hugging {item}.", "{pet} พยายามปีนต้นไม้ที่สูงที่สุดในค่าย ขึ้นไปได้ครึ่งทางก็ตกใจ ลงมาพร้อมกอด {item} ไว้แน่น"],
    ["{pet} licked a frozen fence post. After a long, awkward afternoon, it got free and found {item}.", "{pet} เลียเสารั้วที่แข็งเป็นน้ำแข็ง ผ่านบ่ายที่แสนอึดอัดไปได้ ก็หลุดออกมาและเจอ {item}"],
    ["{pet} judged everyone at the market from a high shelf. Someone bribed it with {item}.", "{pet} นั่งบนชั้นสูงจ้องตัดสินทุกคนในตลาด มีคนติดสินบนด้วย {item}"],
    ["{pet} had a very important meeting with three pigeons. They voted to give it {item}.", "{pet} มีประชุมสำคัญกับนกพิราบสามตัว ที่ประชุมมีมติให้ {item} แก่มัน"],
    ["{pet} rolled in the mud, then in the flour, and came out holding {item}. It is now a cookie.", "{pet} กลิ้งในโคลน กลิ้งในแป้ง แล้วกลิ้งออกมาพร้อม {item} ตอนนี้กลายเป็นคุกกี้ไปแล้ว"],
    ["{pet} saw a cucumber, screamed, jumped three feet in the air, and landed on {item}.", "{pet} เห็นแตงกวา ร้องลั่น กระโดดสูงสามฟุต แล้วลงมาบน {item}"],
    ["{pet} tried to sell your tent to a traveler. The deal fell through, but it kept the deposit: {item}.", "{pet} พยายามขายเต็นท์ของคุณให้นักเดินทาง ดีลล่ม แต่เก็บมัดจำไว้ได้ คือ {item}"],
    ["{pet} fell into the water by accident. Out of pure rage, it went out and found {item}.", "{pet} ตกน้ำโดยไม่ตั้งใจ ด้วยความโมโหสุดขีด มันเลยออกไปหา {item} มาได้"],
    ["{pet} chased a mouse, then the mouse chased {pet}, then they both found {item} and called it even.", "{pet} ไล่หนู แล้วหนูก็ไล่ {pet} กลับ สุดท้ายทั้งคู่เจอ {item} เลยถือว่าเสมอกัน"],
    ["{pet} spent all morning grooming one single paw, then brought you {item}, still a little damp.", "{pet} เลียอุ้งเท้าข้างเดียวทั้งเช้า แล้วเอา {item} มาให้คุณทั้งที่ยังชื้นๆ"],
    ["{pet} sat in the rain looking dramatic, like the hero of a sad song. For the plot, it found {item}.", "{pet} นั่งตากฝนทำหน้าเศร้าเหมือนพระเอกเพลงอกหัก แล้วเจอ {item} ตามบท"],
    ["{pet} stole the woodcutter's hat. He had to trade {item} to get it back.", "{pet} ขโมยหมวกคนตัดไม้ไป เขาต้องเอา {item} มาแลกคืน"],
    ["{pet} yawned so wide a fly flew in. Gross. Anyway, here's {item}.", "{pet} หาวกว้างจนแมลงวันบินเข้าปาก แหวะ เอาเถอะ นี่ {item}"],
    ["{pet} followed a beetle for six hours. The beetle led it to {item}. They are best friends now.", "{pet} เดินตามด้วงหกชั่วโมง ด้วงพาไปเจอ {item} ตอนนี้เป็นเพื่อนซี้กันแล้ว"],
    ["{pet} pushed {item} off the roof just to see what would happen. Gravity still works. Here you go.", "{pet} ผลัก {item} ตกจากหลังคาเพื่อดูว่าจะเกิดอะไรขึ้น แรงโน้มถ่วงยังใช้ได้อยู่ นี่ของคุณ"],
    ["{pet} tried to hatch an egg by sitting on it. It hatched {item} instead. Huh.", "{pet} นั่งกกไข่ แต่ไข่ฟักออกมาเป็น {item} อ้าว"],
    ["{pet} wore a flower crown and the whole town said it was adorable. Someone tipped it {item}.", "{pet} ใส่มงกุฎดอกไม้ ทั้งเมืองบอกว่าน่ารักมาก มีคนให้ทิป {item}"],
    ["{pet} made a bed out of your socks. Under the socks: {item}. Please don't ask about the socks.", "{pet} ทำที่นอนจากถุงเท้าของคุณ ใต้กองถุงเท้ามี {item} อย่าถามเรื่องถุงเท้านะ"],
    ["{pet} tried to catch a fish with its paw and fell in the pond. It came out with {item} and zero fish.", "{pet} เอาอุ้งเท้าตะปบปลาแล้วตกบ่อ ขึ้นมาพร้อม {item} และปลาศูนย์ตัว"],
    ["{pet} challenged the black cat to a nap-off. Both fell asleep. {pet} woke first and claimed {item}.", "{pet} ท้าแมวดำแข่งนอน หลับทั้งคู่ {pet} ตื่นก่อนเลยได้ {item} ไป"],
    ["{pet} watched you sleep last night and decided you deserve {item}. Slightly creepy, very sweet.", "เมื่อคืน {pet} นั่งดูคุณหลับ แล้วตัดสินว่าคุณสมควรได้ {item} น่าขนลุกนิดๆ แต่น่ารักมาก"],
    ["{pet} accidentally joined the guard patrol. It got promoted, then fired, and was paid {item}.", "{pet} หลงเข้าไปในหน่วยลาดตระเวน ได้เลื่อนขั้น แล้วโดนไล่ออก ได้ค่าจ้างเป็น {item}"],
    ["{pet} made the cart man's horse laugh. The horse gave it {item}. Apparently horses can do that.", "{pet} ทำให้ม้าของคนเข็นเกวียนหัวเราะ ม้าเลยให้ {item} ม้าทำแบบนี้ได้ด้วยแฮะ"],
    ["{pet} ran in circles yelling at nothing for ten minutes, then calmly handed you {item}.", "{pet} วิ่งวนร้องใส่อากาศสิบนาที แล้วยื่น {item} ให้คุณอย่างใจเย็น"],
    ["{pet} tried to dig to the other side of the world. It got as far as {item}.", "{pet} พยายามขุดทะลุไปอีกฝั่งของโลก ขุดได้ถึงแค่ {item}"],
    ["{pet} hid behind a very thin pole, sure nobody could see it. It found {item} back there.", "{pet} แอบหลังเสาที่ผอมมาก มั่นใจว่าไม่มีใครเห็น แล้วเจอ {item} ตรงนั้น"],
    ["{pet} borrowed {item} from the blacksmith. \"Borrowed.\"", "{pet} ยืม {item} มาจากช่างตีเหล็ก \"ยืม\" นะ"],
    ["{pet} has a new hobby: collecting things. Today's collection: {item}.", "{pet} มีงานอดิเรกใหม่ คือสะสมของ ของสะสมวันนี้คือ {item}"],
    ["{pet} fought a leaf. The leaf put up a good fight. Spoils of war: {item}.", "{pet} สู้กับใบไม้ ใบไม้สู้ไม่ถอย ของที่ยึดมาได้คือ {item}"],
    ["{pet} sang a song at dawn. The neighbors threw {item} to make it stop.", "{pet} ร้องเพลงตอนรุ่งสาง เพื่อนบ้านปา {item} มาให้หยุดร้อง"],
    ["{pet} found {item}, then acted like it had always been there. Classic {pet}.", "{pet} เจอ {item} แล้วทำเหมือนว่ามันอยู่ตรงนั้นมาตลอด {pet} ก็งี้แหละ"],
    ["{pet} sat in a sunbeam until the sunbeam moved, then followed it right to {item}.", "{pet} นั่งอาบแดดจนแสงแดดเลื่อนไป มันเลยเดินตามแสงไปจนเจอ {item}"],
    ["{pet} told the Tower guards it was a dragon. They believed it and handed over {item}.", "{pet} บอกยามหน้าหอคอยว่าตัวเองเป็นมังกร ยามเชื่อ แล้วยื่น {item} ให้"],
    ["{pet} ate something it shouldn't have. It's fine now. It also found {item}.", "{pet} กินของที่ไม่ควรกินเข้าไป ตอนนี้หายแล้ว แถมเจอ {item} ด้วย"],
    ["{pet} got its head stuck in a jar. After the rescue, the jar turned out to have {item} inside.", "{pet} เอาหัวมุดเข้าโถจนติด พอช่วยออกมาได้ ปรากฏว่าในโถมี {item}"],
    ["{pet} \"guarded\" the potion stand by napping on it. The owner paid it {item} anyway.", "{pet} \"เฝ้า\" ร้านยาด้วยการนอนทับร้าน เจ้าของร้านก็ยังจ่าย {item} ให้อยู่ดี"],
    ["{pet} learned to open the cupboard. You will regret this. For now, enjoy {item}.", "{pet} เปิดตู้เป็นแล้ว คุณจะต้องเสียใจทีหลัง ตอนนี้รับ {item} ไปก่อน"],
    ["{pet} raced a snail and almost lost. Embarrassed, it brought you {item} to change the subject.", "{pet} วิ่งแข่งกับหอยทากแล้วเกือบแพ้ อายมาก เลยเอา {item} มาให้เพื่อเปลี่ยนเรื่อง"],
    ["{pet} played hide and seek alone and found {item}. It still hasn't found itself.", "{pet} เล่นซ่อนหาคนเดียว เจอ {item} แต่ยังหาตัวเองไม่เจอ"],
    ["{pet} made friends with a frog. The frog gave it {item}, and {pet} gave the frog a lick. Fair trade.", "{pet} ผูกมิตรกับกบ กบให้ {item} ส่วน {pet} เลียกบตอบแทน ยุติธรรมดี"],
    ["{pet} slept for 18 hours and dreamed about {item}. When it woke up, it was real!", "{pet} นอน 18 ชั่วโมงแล้วฝันถึง {item} พอตื่นมาก็มีจริงๆ!"],
    ["{pet} stole the show at the village festival and was paid {item} for the performance.", "{pet} แย่งซีนในงานเทศกาลหมู่บ้าน เลยได้ค่าตัวเป็น {item}"],
    ["{pet} tried to carry {item} and a stick at the same time. It dropped the stick. Smart choice.", "{pet} พยายามคาบ {item} กับกิ่งไม้พร้อมกัน แล้วยอมทิ้งกิ่งไม้ เลือกถูกแล้ว"],
    ["{pet} glared at the rain until it stopped, then went out and found {item}. Power move.", "{pet} จ้องฝนจนฝนหยุด แล้วออกไปเจอ {item} เท่สุดๆ"],
    ["{pet} snuck into the Tower lobby and came back with {item} and a very smug face.", "{pet} แอบเข้าโถงหอคอย แล้วกลับมาพร้อม {item} และหน้าตาที่ภูมิใจสุดๆ"],
    ["{pet} bonked its head on the door frame, sat down to think about life, and found {item}.", "{pet} หัวโขกวงกบประตู นั่งลงคิดถึงชีวิต แล้วก็เจอ {item}"],
    ["{pet} wanted your attention, so it brought {item}. Please pet it. Immediately.", "{pet} อยากให้คุณสนใจ เลยเอา {item} มาให้ ลูบหัวมันเดี๋ยวนี้เลย"],
    ["{pet} \"accidentally\" tipped over a crate at the market and \"accidentally\" kept {item}.", "{pet} \"เผลอ\" ทำลังในตลาดล้ม แล้ว \"เผลอ\" เก็บ {item} มา"],
    ["{pet} chased a sparrow (lost), chased a pigeon (lost), then chased {item} (won!).", "{pet} ไล่นกกระจอก (แพ้) ไล่นกพิราบ (แพ้) แล้วไล่ {item} (ชนะ!)"],
    ["{pet} tried to squeeze through the fence. Its head made it. The rest did not. It still grabbed {item}.", "{pet} พยายามมุดรั้ว หัวเข้าไปได้ ตัวไม่ผ่าน แต่ก็ยังคว้า {item} มาได้"],
    ["{pet} bravely fought off a terrifying moth and saved {item}. A true hero.", "{pet} สู้กับผีเสื้อกลางคืนสุดน่ากลัวอย่างกล้าหาญ และปกป้อง {item} ไว้ได้ ฮีโร่ตัวจริง"],
    ["{pet} found {item} and proudly left it on your pillow. You're welcome.", "{pet} เจอ {item} แล้ววางไว้บนหมอนคุณอย่างภูมิใจ ไม่ต้องขอบคุณ"],
    ["{pet} tried to steal the moon from the pond. It got very wet, and also {item}.", "{pet} พยายามขโมยพระจันทร์ในบ่อน้ำ ได้ตัวเปียกโชก กับ {item}"],
    ["{pet} stared at a wall for an hour. Behind the wall: {item}. It knew all along.", "{pet} จ้องกำแพงหนึ่งชั่วโมง หลังกำแพงมี {item} มันรู้มาตั้งแต่แรกแล้ว"],
    ["{pet} chased a sunbeam into the forge and came out slightly toasty, holding {item}.", "{pet} ไล่แสงแดดเข้าเตาหลอม ออกมาขนไหม้นิดๆ พร้อม {item}"],
    ["{pet} learned a new trick today: sitting. It took all day. The reward was {item}.", "วันนี้ {pet} ฝึกท่าใหม่ คือนั่ง ใช้เวลาทั้งวัน รางวัลคือ {item}"],
    ["{pet} jumped into a pile of leaves and vanished. Ten minutes later it popped out with {item}.", "{pet} กระโดดลงกองใบไม้แล้วหายไป สิบนาทีต่อมาโผล่ออกมาพร้อม {item}"],
    ["{pet} demanded breakfast at 4 a.m. While waiting, it found {item}.", "{pet} ทวงอาหารเช้าตอนตีสี่ ระหว่างรอ มันเจอ {item}"],
    ["{pet} rode a sheep across the field. The sheep dropped it off right next to {item}.", "{pet} ขี่หลังแกะข้ามทุ่ง แกะไปส่งข้างๆ {item} พอดี"],
    ["{pet} was very, very busy today. Busy finding {item}. And napping. Mostly napping.", "วันนี้ {pet} ยุ่งมากๆ ยุ่งกับการหา {item} แล้วก็นอน ส่วนใหญ่คือนอน"],
    ["{pet} attempted a dramatic leap onto the shelf. It missed, but landed on {item}. Nailed it.", "{pet} กระโดดขึ้นชั้นอย่างอลังการ พลาด แต่ไปลงบน {item} พอดี เป๊ะ"],
    ["{pet} fought the sock monster under your bed and won {item}.", "{pet} สู้กับปีศาจถุงเท้าใต้เตียงคุณ แล้วชนะได้ {item}"],
    ["{pet} begged at every table in the inn. One table gave it food, another gave it {item}.", "{pet} ขอของกินทุกโต๊ะในโรงเตี๊ยม โต๊ะหนึ่งให้อาหาร อีกโต๊ะให้ {item}"],
    ["{pet} took a selfie at the lake. Okay, it just stared at its reflection. It also found {item}.", "{pet} เซลฟี่ที่ทะเลสาบ ก็แค่ส่องเงาตัวเองนั่นแหละ แต่เจอ {item} ด้วย"],
    ["{pet} tried to herd the chickens. The chickens herded {pet} instead, straight into {item}.", "{pet} พยายามต้อนไก่ แต่ไก่ต้อน {pet} แทน ต้อนไปเจอ {item} พอดี"],
    ["{pet} found {item}, forgot where it put it, then found it again. Twice the fun!", "{pet} เจอ {item} แล้วลืมว่าวางไว้ไหน แล้วหาเจออีกรอบ สนุกสองเท่า!"],
    ["{pet} sat in your chair and refused to give it back. Rent paid: {item}.", "{pet} นั่งเก้าอี้คุณแล้วไม่ยอมคืน จ่ายค่าเช่าเป็น {item}"],
    ["{pet} tried to pounce on a bug and pounced on {item} instead. Close enough.", "{pet} จะตะครุบแมลง แต่ตะครุบโดน {item} แทน ก็ใกล้เคียงนะ"],
    ["{pet} got scared of its own hiccup, hid under the cart, and found {item}.", "{pet} ตกใจเสียงสะอึกตัวเอง วิ่งไปหลบใต้เกวียน แล้วเจอ {item}"],
    ["{pet} spent the day being the cutest thing in town. It is very tired. Here is {item}.", "วันนี้ {pet} ทำหน้าที่เป็นสิ่งที่น่ารักที่สุดในเมือง เหนื่อยมาก นี่ {item}"],
    ["{pet} tried to bury {item} like treasure, but you saw it. Fine. You can have it.", "{pet} จะฝัง {item} เหมือนสมบัติ แต่คุณเห็นซะก่อน ก็ได้ เอาไปเลย"],
    ["{pet} got the midnight zoomies. Somewhere in the chaos, it found {item}.", "{pet} วิ่งพล่านตอนเที่ยงคืน ระหว่างความวุ่นวายนั้นเจอ {item}"],
    ["{pet} snuck into the VIP Shop. It couldn't afford anything, but it found {item} on the floor.", "{pet} แอบเข้าร้าน VIP ไม่มีเงินซื้ออะไรเลย แต่เจอ {item} ตกอยู่บนพื้น"],
    ["{pet} slept upside down all afternoon. When it flipped over, {item} fell out of its fur.", "{pet} นอนหงายท้องทั้งบ่าย พอพลิกตัวกลับ {item} ก็หล่นออกมาจากขน"],
    ["{pet} sniffed the cart man's lunch, got caught, and was given {item} to stay away.", "{pet} ไปดมข้าวกลางวันของคนเข็นเกวียน โดนจับได้ เลยได้ {item} เป็นค่าอยู่ห่างๆ"],
    ["{pet} pretended to be a statue in the town square. Passersby left {item} at its feet.", "{pet} ทำตัวเป็นรูปปั้นกลางลานเมือง คนเดินผ่านวาง {item} ไว้ที่เท้า"],
    ["{pet} tried to bite the wind. It missed, but caught {item} on the way down.", "{pet} พยายามงับลม งับไม่โดน แต่คว้า {item} ได้ตอนตกลงมา"],
    ["{pet} tumbled down the hill like a fluffy ball and rolled to a stop right on {item}.", "{pet} กลิ้งลงเนินเหมือนลูกบอลขนฟู แล้วหยุดพอดีบน {item}"],
    ["{pet} found {item}, licked it, and decided it was too boring to eat. It's yours now.", "{pet} เจอ {item} เลียดู แล้วตัดสินว่าน่าเบื่อเกินจะกิน ยกให้คุณ"],
    ["{pet} wrote you a letter. It's just paw prints. Attached: {item}.", "{pet} เขียนจดหมายถึงคุณ มีแต่รอยอุ้งเท้า แนบมาด้วย: {item}"],
    ["{pet} missed you all day, so it brought {item} and curled up in your lap. Purr.", "{pet} คิดถึงคุณทั้งวัน เลยเอา {item} มาให้ แล้วขดตัวบนตักคุณ ครืดๆ"],
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
