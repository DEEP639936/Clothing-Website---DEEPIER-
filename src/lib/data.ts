import type { Product, Category, Review, JournalArticle, Coupon } from "@/types";
import { IMG } from "./images";

/* ------------------------------ Colors ------------------------------ */
const C = {
  jet: { name: "Jet Black", hex: "#1c1b1a" },
  charcoal: { name: "Charcoal", hex: "#3a3835" },
  bone: { name: "Bone", hex: "#e9e4da" },
  offWhite: { name: "Off White", hex: "#f2efe9" },
  sand: { name: "Desert Sand", hex: "#cbbfa8" },
  olive: { name: "Burnt Olive", hex: "#4a4f3d" },
  clay: { name: "Terracotta", hex: "#b0664a" },
  indigo: { name: "Deep Indigo", hex: "#2e3a51" },
  forest: { name: "Forest", hex: "#2f4a3e" },
  rust: { name: "Rust", hex: "#9c4b2f" },
  camel: { name: "Camel", hex: "#b3834f" },
  sage: { name: "Sage", hex: "#97a588" },
  cream: { name: "Cream", hex: "#efe8da" },
  storm: { name: "Storm Grey", hex: "#8b8a86" },
};

const SIZES_ALL = ["XS", "S", "M", "L", "XL", "XXL"];
const sizes = (oos: string[] = []) =>
  SIZES_ALL.map((label) => ({ label, inStock: !oos.includes(label) }));

const stdCare = [
  "Machine wash cold, inside out",
  "Do not iron directly on embroidery",
  "Tumble dry low or line dry",
  "Wash with similar colours",
];

/* ----------------------------- Products ----------------------------- */

export const products: Product[] = [
  /* =============================== MEN =============================== */
  {
    id: "m01", slug: "solstice-embroidered-tee", name: "Solstice Embroidered Tee",
    shortDescription: "Heavyweight tee with tonal Kantha-stitch crest",
    description:
      "The Solstice is where DEEPIER began — a 240 GSM combed-cotton tee elevated by a hand-guided Kantha-stitch crest at the chest. Cut with a dropped shoulder and a boxy, modern body, it layers as easily as it stands alone. Every crest is embroidered, never printed, so the surface catches light the way fine denim does.",
    gender: "men", category: "t-shirts", collection: "Core Stitch",
    price: 1499, mrp: 2199, rating: 4.8, reviewCount: 612,
    badges: ["BESTSELLER", "SALE"],
    colors: [C.jet, C.charcoal, C.bone],
    sizes: sizes(["XS"]),
    images: [
      { src: IMG("men_tee", 1), alt: "Solstice Embroidered Tee in Jet Black — front", kind: "front" },
      { src: IMG("men_tee", 5), alt: "Solstice Embroidered Tee — back", kind: "back" },
      { src: IMG("embroidery", 2), alt: "Kantha stitch embroidery in progress", kind: "detail" },
      { src: IMG("fabric", 5), alt: "Combed cotton fabric texture", kind: "lifestyle" },
    ],
    fabric: "240 GSM, 100% combed cotton, bio-washed for zero shrinkage",
    fit: "Regular", embroidery: "Kantha-stitch crest, 12,000 stitches, matte thread",
    care: stdCare, bestSellerRank: 1,
  },
  {
    id: "m02", slug: "nightbloom-oversized-tee", name: "Nightbloom Oversized Tee",
    shortDescription: "Washed black oversized tee, chikankari-inspired bloom",
    description:
      "A garment-dyed, washed-black oversized tee carrying a Nightbloom motif stitched in ivory thread — our quiet take on Lucknowi chikankari. The wash gives every piece a broken-in feel from day one, while the dropped shoulders and extended length create the silhouette the brand is known for.",
    gender: "men", category: "oversized-t-shirts", collection: "Nightbloom",
    price: 1599, mrp: 2499, rating: 4.7, reviewCount: 438,
    badges: ["NEW", "SALE"],
    colors: [C.jet, C.storm],
    sizes: sizes(["XXL"]),
    images: [
      { src: IMG("men_tee", 2), alt: "Nightbloom Oversized Tee — embroidery detail", kind: "front" },
      { src: IMG("men_tee", 8), alt: "Nightbloom Oversized Tee — model", kind: "model" },
      { src: IMG("embroidery", 1), alt: "Ivory thread needlework detail", kind: "detail" },
      { src: IMG("fabric", 3), alt: "Washed cotton texture", kind: "lifestyle" },
    ],
    fabric: "260 GSM, 100% cotton, garment-dyed and enzyme washed",
    fit: "Oversized", embroidery: "Nightbloom motif, ivory viscose thread",
    care: stdCare, newArrived: true,
  },
  {
    id: "m03", slug: "atlas-everyday-tee", name: "Atlas Everyday Tee",
    shortDescription: "The everyday tee with a tonal embroidered mark",
    description:
      "Built for rotation. The Atlas pairs a mid-weight 200 GSM jersey with a small tonal embroidered mark at the chest — subtle, confident, and unmistakably DEEPIER. Pre-shrunk and side-seamed so the silhouette stays sharp wash after wash. This is the tee you reach for without thinking.",
    gender: "men", category: "t-shirts", collection: "Core Stitch",
    price: 1299, mrp: 1999, rating: 4.6, reviewCount: 874,
    badges: ["BESTSELLER", "SALE"],
    colors: [C.jet, C.offWhite, C.olive],
    sizes: sizes([]),
    images: [
      { src: IMG("men_tee", 8), alt: "Atlas Everyday Tee in black — front", kind: "front" },
      { src: IMG("men_tee", 1), alt: "Atlas Everyday Tee — styled", kind: "model" },
      { src: IMG("embroidery", 10), alt: "Tonal thread work detail", kind: "detail" },
      { src: IMG("fabric", 4), alt: "Jersey knit texture", kind: "lifestyle" },
    ],
    fabric: "200 GSM, 100% combed cotton, pre-shrunk",
    fit: "Regular", embroidery: "Tonal chest mark, 3,200 stitches",
    care: stdCare, bestSellerRank: 3,
  },
  {
    id: "m04", slug: "drift-oversized-tee", name: "Drift Oversized Tee",
    shortDescription: "Street-cut tee with a mantra across the back",
    description:
      "Drift carries a single line of chain-stitched text across the upper back — a quiet mantra for people who move with intent. The body is cut long and wide with heavyweight ribbing at the neck that will not lose its shape. Styled for the street, finished in the studio.",
    gender: "men", category: "oversized-t-shirts", collection: "Street Lines",
    price: 1499, mrp: 2299, rating: 4.5, reviewCount: 267,
    badges: ["SALE"],
    colors: [C.jet, C.storm, C.olive],
    sizes: sizes(["XS", "S"]),
    images: [
      { src: IMG("men_tee", 4), alt: "Drift Oversized Tee — street style", kind: "front" },
      { src: IMG("men_tee", 5), alt: "Drift Oversized Tee — back", kind: "back" },
      { src: IMG("embroidery", 7), alt: "Chain stitch detail", kind: "detail" },
      { src: IMG("fabric", 7), alt: "Fabric texture", kind: "lifestyle" },
    ],
    fabric: "240 GSM, 100% cotton heavyweight jersey",
    fit: "Oversized", embroidery: "Back mantra, chain stitch",
    care: stdCare,
  },
  {
    id: "m05", slug: "meridian-camp-shirt", name: "Meridian Camp Shirt",
    shortDescription: "Relaxed camp-collar shirt, collar chain-stitch",
    description:
      "An easy-wearing camp collar shirt in breathable cotton poplin with a contrast chain-stitch running the collar edge. Cut relaxed through the body with a straight hem, it moves from resort evenings to city days without changing character. The embroidery sits flat against the placket — detail you feel before you see.",
    gender: "men", category: "shirts", collection: "Meridian",
    price: 2199, mrp: 3299, rating: 4.7, reviewCount: 189,
    badges: ["NEW", "SALE"],
    colors: [C.bone, C.sage, C.indigo],
    sizes: sizes(["S"]),
    images: [
      { src: IMG("men_shirt", 2), alt: "Meridian Camp Shirt — studio", kind: "front" },
      { src: IMG("men_shirt", 6), alt: "Meridian Camp Shirt — duo editorial", kind: "model" },
      { src: IMG("embroidery", 3), alt: "Contrast chain stitch threads", kind: "detail" },
      { src: IMG("fabric", 1), alt: "Cotton poplin texture", kind: "lifestyle" },
    ],
    fabric: "120 GSM cotton poplin, mercerized finish",
    fit: "Relaxed", embroidery: "Collar-edge chain stitch, contrast thread",
    care: stdCare, newArrived: true,
  },
  {
    id: "m06", slug: "indigo-aari-overshirt", name: "Indigo Aari Overshirt",
    shortDescription: "Denim overshirt with hand-guided Aari embroidery",
    description:
      "Cut from 8 oz washed denim and finished with Aari-style embroidery across the chest pocket — a craft borrowed from Kashmiri artisans, reinterpreted for the everyday. Wear it open over a tee or buttoned as a shirt; the denim softens with every wash while the embroidery holds its architecture.",
    gender: "men", category: "shirts", collection: "Craft Atlas",
    price: 2499, mrp: 3799, rating: 4.8, reviewCount: 143,
    badges: ["SALE"],
    colors: [C.indigo, C.charcoal],
    sizes: sizes(["XL"]),
    images: [
      { src: IMG("men_shirt", 8), alt: "Indigo Aari Overshirt — denim editorial", kind: "front" },
      { src: IMG("men_shirt", 1), alt: "Indigo Aari Overshirt — styled", kind: "model" },
      { src: IMG("embroidery", 5), alt: "Aari embroidery on denim", kind: "detail" },
      { src: IMG("fabric", 8), alt: "Washed denim texture", kind: "lifestyle" },
    ],
    fabric: "8 oz washed denim, 100% cotton",
    fit: "Relaxed", embroidery: "Aari-style chest pocket motif",
    care: stdCare,
  },
  {
    id: "m07", slug: "midnight-zip-hoodie", name: "Midnight Zip Hoodie",
    shortDescription: "400 GSM fleece zip hood with embroidered crest",
    description:
      "Our heaviest fleece. The Midnight is a 400 GSM brushed-back hoodie with a two-way zip, metal hardware, and a raised embroidered crest at the chest. Double-layered hood, ribbed cuffs with just the right bite, and a hem that sits exactly where it should. Winter layers, solved.",
    gender: "men", category: "hoodies", collection: "Midnight",
    price: 2799, mrp: 3999, rating: 4.9, reviewCount: 521,
    badges: ["BESTSELLER", "SALE"],
    colors: [C.jet, C.charcoal],
    sizes: sizes(["XXL"]),
    images: [
      { src: IMG("men_hoodie", 5), alt: "Midnight Zip Hoodie — studio", kind: "front" },
      { src: IMG("men_hoodie", 6), alt: "Midnight Zip Hoodie — back", kind: "back" },
      { src: IMG("embroidery", 2), alt: "Raised crest embroidery", kind: "detail" },
      { src: IMG("fabric", 3), alt: "Brushed fleece texture", kind: "lifestyle" },
    ],
    fabric: "400 GSM brushed fleece, 80% cotton 20% recycled poly",
    fit: "Regular", embroidery: "Raised 3D chest crest, 8,500 stitches",
    care: stdCare, bestSellerRank: 2,
  },
  {
    id: "m08", slug: "shadow-kantha-hoodie", name: "Shadow Kantha Hoodie",
    shortDescription: "Pullover hoodie with Kantha-stitch shoulder panels",
    description:
      "The Shadow takes Kantha — the centuries-old Bengali running stitch — and lays it across the shoulder panels of a heavyweight pullover hoodie. Tonal thread on jet fleece. Nothing shouts; everything is felt. Kangaroo pocket lined with jersey, hood with double drawcord tips in matte metal.",
    gender: "men", category: "hoodies", collection: "Craft Atlas",
    price: 2999, mrp: 4499, rating: 4.8, reviewCount: 236,
    badges: ["LIMITED", "SALE"],
    colors: [C.jet, C.olive],
    sizes: sizes(["S", "M"]),
    images: [
      { src: IMG("men_hoodie", 7), alt: "Shadow Kantha Hoodie — editorial", kind: "front" },
      { src: IMG("men_hoodie", 3), alt: "Shadow Kantha Hoodie — street", kind: "model" },
      { src: IMG("embroidery", 8), alt: "Kantha running stitch detail", kind: "detail" },
      { src: IMG("fabric", 7), alt: "Fleece texture", kind: "lifestyle" },
    ],
    fabric: "380 GSM loop-knit fleece, 100% cotton face",
    fit: "Oversized", embroidery: "Kantha shoulder panels, tonal thread",
    care: stdCare, lowStock: true,
  },
  {
    id: "m09", slug: "dune-crew-sweatshirt", name: "Dune Crew Sweatshirt",
    shortDescription: "Mid-weight crew with suede-touch embroidered patch",
    description:
      "The Dune crew is cut from 320 GSM loop-back fleece and finished with a suede-touch embroidered patch — a small rectangle of quiet luxury. Raglan seams give the shoulder room to move; the ribbing is reinforced twice at the cuffs. Warm without weight, plain without being plain.",
    gender: "men", category: "sweatshirts", collection: "Dune",
    price: 2199, mrp: 3499, rating: 4.6, reviewCount: 198,
    badges: ["SALE"],
    colors: [C.sand, C.jet, C.storm],
    sizes: sizes([]),
    images: [
      { src: IMG("sweatshirt", 3), alt: "Dune Crew Sweatshirt — street editorial", kind: "front" },
      { src: IMG("men_tee", 3), alt: "Dune Crew Sweatshirt — styled duo", kind: "model" },
      { src: IMG("embroidery", 7), alt: "Suede patch embroidery detail", kind: "detail" },
      { src: IMG("fabric", 5), alt: "Loop-back fleece texture", kind: "lifestyle" },
    ],
    fabric: "320 GSM loop-back fleece, 100% cotton face",
    fit: "Regular", embroidery: "Suede-touch patch, 4,000 stitches",
    care: stdCare,
  },
  {
    id: "m10", slug: "monsoon-bomber", name: "Monsoon Bomber",
    shortDescription: "Water-repellent bomber, embroidered storm lining",
    description:
      "A clean bomber in a matte water-repellent shell, lined with our storm print woven jacquard. Ribbed collar, cuffs and hem in matching tone; embroidered DEEPIER monogram at the chest and a full lineage of stitch-work along the inside placket — the part only you will see.",
    gender: "men", category: "jackets", collection: "Monsoon",
    price: 3999, mrp: 5999, rating: 4.7, reviewCount: 167,
    badges: ["NEW", "SALE"],
    colors: [C.jet, C.forest],
    sizes: sizes(["XS"]),
    images: [
      { src: IMG("men_jacket", 3), alt: "Monsoon Bomber — studio", kind: "front" },
      { src: IMG("men_jacket", 8), alt: "Monsoon Bomber — street", kind: "model" },
      { src: IMG("embroidery", 5), alt: "Monogram embroidery detail", kind: "detail" },
      { src: IMG("fabric", 3), alt: "Technical shell texture", kind: "lifestyle" },
    ],
    fabric: "Water-repellent matte shell, taffeta lining",
    fit: "Regular", embroidery: "Chest monogram + inner placket stitch line",
    care: ["Wipe clean with damp cloth", "Do not bleach", "Do not iron on embroidery", "Dry clean for best results"],
    newArrived: true,
  },
  {
    id: "m11", slug: "monolith-overcoat", name: "Monolith Overcoat",
    shortDescription: "Long-line overcoat with embroidered back sigil",
    description:
      "The Monolith is our most architectural piece — a long-line overcoat in bonded wool blend with a single embroidered sigil across the back. Dropped shoulders, hidden placket, and a silhouette that reads monochrome from across the street. For the days you want your coat to do the talking.",
    gender: "men", category: "jackets", collection: "Monolith",
    price: 5499, mrp: 7999, rating: 4.9, reviewCount: 89,
    badges: ["LIMITED", "SALE"],
    colors: [C.jet, C.charcoal],
    sizes: sizes(["S", "XS"]),
    images: [
      { src: IMG("lifestyle", 8), alt: "Monolith Overcoat — editorial", kind: "front" },
      { src: IMG("men_jacket", 6), alt: "Monolith Overcoat — street style", kind: "model" },
      { src: IMG("embroidery", 9), alt: "Back sigil embroidery in gold", kind: "detail" },
      { src: IMG("fabric", 8), alt: "Bonded wool texture", kind: "lifestyle" },
    ],
    fabric: "Bonded wool blend, satin lining",
    fit: "Oversized", embroidery: "Back sigil, metallic bronze thread",
    care: ["Dry clean only", "Store on wide hanger", "Steam to refresh", "Do not machine wash"],
    lowStock: true,
  },
  {
    id: "m12", slug: "heirloom-satin-bomber", name: "Heirloom Satin Bomber",
    shortDescription: "Zardozi-inspired embroidered satin bomber",
    description:
      "Our showpiece. A quilted satin bomber carrying a zardozi-inspired embroidered panel across the back — metallic bronze and jet thread laid the way heritage vessels are decorated. Souvenir jacket silhouette, ribbed trims, and a lining printed with the DEEPIER lineage. Numbered, never repeated.",
    gender: "men", category: "jackets", collection: "Heirloom",
    price: 4999, mrp: 6999, rating: 5.0, reviewCount: 64,
    badges: ["LIMITED"],
    colors: [C.indigo, C.jet],
    sizes: sizes(["M", "XL"]),
    images: [
      { src: IMG("men_jacket", 7), alt: "Heirloom Satin Bomber — embroidered back", kind: "front" },
      { src: IMG("men_jacket", 2), alt: "Heirloom Satin Bomber — street", kind: "model" },
      { src: IMG("embroidery", 9), alt: "Zardozi embroidery close-up", kind: "detail" },
      { src: IMG("fabric", 2), alt: "Satin texture", kind: "lifestyle" },
    ],
    fabric: "Quilted satin shell, quilted lining",
    fit: "Regular", embroidery: "Zardozi-inspired back panel, 42,000 stitches",
    care: ["Dry clean only", "Do not wring or twist", "Store flat or on wide hanger", "Keep away from rough surfaces"],
    lowStock: true,
  },

  /* ============================== WOMEN ============================== */
  {
    id: "w01", slug: "bone-essential-tee", name: "Bone Essential Tee",
    shortDescription: "Relaxed tee in bone with tonal stem stitch",
    description:
      "The Bone Essential is the baseline of the women's line — a relaxed, slightly cropped body in soft 220 GSM cotton with a tonal stem-stitch motif at the hem. It drapes instead of clinging, pairs with everything you own, and washes into an even softer version of itself.",
    gender: "women", category: "t-shirts", collection: "Core Stitch",
    price: 1299, mrp: 1999, rating: 4.7, reviewCount: 733,
    badges: ["BESTSELLER", "SALE"],
    colors: [C.bone, C.offWhite, C.jet],
    sizes: sizes(["XS"]),
    images: [
      { src: IMG("women_tee", 4), alt: "Bone Essential Tee — studio", kind: "front" },
      { src: IMG("women_hoodie", 1), alt: "Bone Essential Tee — styled", kind: "model" },
      { src: IMG("embroidery", 3), alt: "Stem stitch thread detail", kind: "detail" },
      { src: IMG("fabric", 1), alt: "Soft cotton texture", kind: "lifestyle" },
    ],
    fabric: "220 GSM, 100% combed cotton, bio-washed",
    fit: "Relaxed", embroidery: "Tonal hem motif, stem stitch",
    care: stdCare, bestSellerRank: 4,
  },
  {
    id: "w02", slug: "studio-white-tee", name: "Studio White Tee",
    shortDescription: "Crisp white tee, red-thread signature stitch",
    description:
      "A studio-staple white tee with DEEPIER's signature stitch running in a single red thread at the back neck — the brand's quiet heartbeat. Mid-weight jersey with a handfeel that only gets better; the fit is easy through the body with a neckline that holds its shape all day.",
    gender: "women", category: "t-shirts", collection: "Core Stitch",
    price: 1399, mrp: 2199, rating: 4.6, reviewCount: 512,
    badges: ["SALE"],
    colors: [C.offWhite, C.jet, C.clay],
    sizes: sizes([]),
    images: [
      { src: IMG("women_shirt", 2), alt: "Studio White Tee — street", kind: "front" },
      { src: IMG("sweatshirt", 8), alt: "Studio White Tee — styled", kind: "model" },
      { src: IMG("embroidery", 1), alt: "Red thread signature stitch", kind: "detail" },
      { src: IMG("fabric", 4), alt: "White jersey texture", kind: "lifestyle" },
    ],
    fabric: "210 GSM, 100% cotton, opaque in white",
    fit: "Regular", embroidery: "Back-neck signature stitch",
    care: stdCare,
  },
  {
    id: "w03", slug: "ember-relaxed-tee", name: "Ember Relaxed Tee",
    shortDescription: "Boxy tee with ember-toned cuff embroidery",
    description:
      "Cut boxy and slightly cropped, the Ember carries a line of ember-toned embroidery along the cuff — a small flare of warmth on a neutral body. It layers over denim and under shirting with equal ease, which is exactly the point. A quiet piece that finishes loud outfits.",
    gender: "women", category: "t-shirts", collection: "Ember",
    price: 1499, mrp: 2299, rating: 4.5, reviewCount: 284,
    badges: ["NEW", "SALE"],
    colors: [C.offWhite, C.clay, C.jet],
    sizes: sizes(["XXL"]),
    images: [
      { src: IMG("women_shirt", 6), alt: "Ember Relaxed Tee — street", kind: "front" },
      { src: IMG("women_hoodie", 8), alt: "Ember Relaxed Tee — styled", kind: "model" },
      { src: IMG("embroidery", 10), alt: "Ember-toned cuff embroidery", kind: "detail" },
      { src: IMG("fabric", 5), alt: "Cotton texture", kind: "lifestyle" },
    ],
    fabric: "230 GSM, 100% cotton",
    fit: "Relaxed", embroidery: "Cuff line, ember viscose thread",
    care: stdCare, newArrived: true,
  },
  {
    id: "w04", slug: "wildflower-oversized-tee", name: "Wildflower Oversized Tee",
    shortDescription: "Oversized tee, wildflower cascade down the back",
    description:
      "The Wildflower turns around. On the front it is a plain washed-grey oversized tee; across the back a cascade of hand-guided wildflowers climbs from hem to collar. Each flower is a different stitch — satin, stem, French knot — like a meadow stitched by someone who had all the time in the world.",
    gender: "women", category: "oversized-t-shirts", collection: "Wildflower",
    price: 1599, mrp: 2499, rating: 4.8, reviewCount: 356,
    badges: ["BESTSELLER", "SALE"],
    colors: [C.storm, C.bone],
    sizes: sizes(["S"]),
    images: [
      { src: IMG("women_hoodie", 3), alt: "Wildflower Oversized Tee — street", kind: "front" },
      { src: IMG("sweatshirt", 7), alt: "Wildflower Oversized Tee — styled", kind: "model" },
      { src: IMG("embroidery", 8), alt: "Wildflower stitch detail", kind: "detail" },
      { src: IMG("fabric", 6), alt: "Washed cotton texture", kind: "lifestyle" },
    ],
    fabric: "250 GSM, 100% cotton, garment washed",
    fit: "Oversized", embroidery: "Back wildflower cascade, mixed stitches",
    care: stdCare, bestSellerRank: 5,
  },
  {
    id: "w05", slug: "terracotta-linen-shirt", name: "Terracotta Linen Co-ord Shirt",
    shortDescription: "Breathable linen shirt with collar vine embroidery",
    description:
      "Cut from European flax linen in a warm terracotta, this shirt breathes through summer and layers through autumn. A delicate vine embroiders itself along the inner collar — a private detail for whoever gets close. Pair with the matching trouser for the full co-ord or wear it loose over white denim.",
    gender: "women", category: "shirts", collection: "Sunbaked",
    price: 2499, mrp: 3699, rating: 4.7, reviewCount: 221,
    badges: ["NEW", "SALE"],
    colors: [C.clay, C.sand, C.offWhite],
    sizes: sizes(["XS"]),
    images: [
      { src: IMG("women_shirt", 3), alt: "Terracotta Linen Shirt — editorial", kind: "front" },
      { src: IMG("women_shirt", 5), alt: "Terracotta Linen Shirt — flat detail", kind: "model" },
      { src: IMG("embroidery", 7), alt: "Collar vine embroidery", kind: "detail" },
      { src: IMG("fabric", 6), alt: "Linen texture", kind: "lifestyle" },
    ],
    fabric: "100% European flax linen, stone washed",
    fit: "Relaxed", embroidery: "Inner collar vine",
    care: ["Machine wash cold, gentle cycle", "Line dry in shade", "Warm iron on reverse", "Do not bleach"],
    newArrived: true,
  },
  {
    id: "w06", slug: "painter-stripe-shirt", name: "Painter Stripe Shirt",
    shortDescription: "Striped boyfriend shirt with painted cuff stitch",
    description:
      "A boyfriend-fit shirt in brushed cotton stripes, with a single 'painted' line of embroidery running the left cuff — as if the maker signed their work. Dropped shoulders, curved hem, and mother-of-pearl buttons. Equal parts borrowed-from-him and entirely yours.",
    gender: "women", category: "shirts", collection: "Atelier",
    price: 2299, mrp: 3499, rating: 4.6, reviewCount: 176,
    badges: ["SALE"],
    colors: [C.sage, C.bone, C.indigo],
    sizes: sizes(["XL", "XXL"]),
    images: [
      { src: IMG("women_shirt", 7), alt: "Painter Stripe Shirt — studio", kind: "front" },
      { src: IMG("sweatshirt", 6), alt: "Painter Stripe Shirt — editorial", kind: "model" },
      { src: IMG("embroidery", 8), alt: "Cuff signature stitch", kind: "detail" },
      { src: IMG("fabric", 1), alt: "Brushed cotton texture", kind: "lifestyle" },
    ],
    fabric: "Brushed cotton, yarn-dyed stripes",
    fit: "Relaxed", embroidery: "Left cuff painted line",
    care: stdCare,
  },
  {
    id: "w07", slug: "flame-motif-hoodie", name: "Flame Motif Hoodie",
    shortDescription: "Cream hoodie with flame-crest chest embroidery",
    description:
      "The Flame Motif hoodie is the piece our community photographs the most. A cream 350 GSM fleece hoodie with a flame crest embroidered at the chest in our signature bronze-and-jet thread. The hood is double-lined, the kangaroo pocket is phone-deep, and the cream is engineered not to yellow.",
    gender: "women", category: "hoodies", collection: "Flame",
    price: 2899, mrp: 4299, rating: 4.9, reviewCount: 468,
    badges: ["BESTSELLER", "SALE"],
    colors: [C.cream, C.jet, C.clay],
    sizes: sizes(["XS", "XXL"]),
    images: [
      { src: IMG("women_hoodie", 4), alt: "Flame Motif Hoodie — embroidery close-up", kind: "front" },
      { src: IMG("women_shirt", 8), alt: "Flame Motif Hoodie — collection shot", kind: "model" },
      { src: IMG("embroidery", 2), alt: "Flame crest in progress", kind: "detail" },
      { src: IMG("fabric", 5), alt: "Cream fleece texture", kind: "lifestyle" },
    ],
    fabric: "350 GSM brushed fleece, cotton-rich",
    fit: "Oversized", embroidery: "Flame chest crest, bronze thread",
    care: stdCare, bestSellerRank: 6,
  },
  {
    id: "w08", slug: "court-green-hoodie", name: "Court Pullover Hoodie",
    shortDescription: "Forest-green fleece with court-court embroidery",
    description:
      "A deep forest-green pullover built for courtside and everywhere else. Loop-back fleece, tonal embroidery at the sleeve, and a hood that actually stays up. The green reads richer in person — deep, muted, and endlessly wearable with denim and cream.",
    gender: "women", category: "hoodies", collection: "Court",
    price: 2799, mrp: 3999, rating: 4.6, reviewCount: 154,
    badges: ["SALE"],
    colors: [C.forest, C.jet, C.bone],
    sizes: sizes([]),
    images: [
      { src: IMG("women_hoodie", 6), alt: "Court Pullover Hoodie — green", kind: "front" },
      { src: IMG("men_hoodie", 3), alt: "Court Pullover Hoodie — street", kind: "model" },
      { src: IMG("embroidery", 8), alt: "Sleeve embroidery detail", kind: "detail" },
      { src: IMG("fabric", 7), alt: "Loop-back fleece texture", kind: "lifestyle" },
    ],
    fabric: "340 GSM loop-back fleece",
    fit: "Regular", embroidery: "Tonal sleeve motif",
    care: stdCare,
  },
  {
    id: "w09", slug: "autumn-cream-crew", name: "Autumn Cream Crew",
    shortDescription: "Soft knit-crew with falling-leaf embroidery",
    description:
      "The Autumn crew layers like a favourite — a soft brushed crew in undyed cream with a scatter of falling-leaf embroidery at the shoulder. Ribbing at the hem holds the shape; the body warms without bulk. Made for golden-hour walks and cold-morning coffees.",
    gender: "women", category: "sweatshirts", collection: "Autumn",
    price: 2299, mrp: 3499, rating: 4.7, reviewCount: 203,
    badges: ["SALE"],
    colors: [C.cream, C.camel, C.jet],
    sizes: sizes(["XS"]),
    images: [
      { src: IMG("sweatshirt", 1), alt: "Autumn Cream Crew — golden hour", kind: "front" },
      { src: IMG("women_shirt", 1), alt: "Autumn Cream Crew — street", kind: "model" },
      { src: IMG("embroidery", 7), alt: "Falling leaf embroidery", kind: "detail" },
      { src: IMG("fabric", 2), alt: "Brushed knit texture", kind: "lifestyle" },
    ],
    fabric: "300 GSM brushed fleece, undyed cream",
    fit: "Relaxed", embroidery: "Shoulder falling-leaf scatter",
    care: stdCare,
  },
  {
    id: "w10", slug: "rust-cord-jacket", name: "Rust Cord Trucker",
    shortDescription: "Corduroy trucker with embroidered back yoke",
    description:
      "A trucker cut from 8-wale corduroy in rust — the colour of late October. The back yoke carries a line of leaf-stitch embroidery in cream, and the fit is boxy enough to layer over knits. Antiqued brass hardware that will age with you.",
    gender: "women", category: "jackets", collection: "Sunbaked",
    price: 3499, mrp: 5299, rating: 4.8, reviewCount: 127,
    badges: ["NEW", "SALE"],
    colors: [C.rust, C.sand],
    sizes: sizes(["S", "XXL"]),
    images: [
      { src: IMG("women_jacket", 3), alt: "Rust Cord Trucker — street", kind: "front" },
      { src: IMG("women_jacket", 4), alt: "Rust Cord Trucker — sherpa detail", kind: "model" },
      { src: IMG("embroidery", 5), alt: "Back yoke embroidery", kind: "detail" },
      { src: IMG("fabric", 8), alt: "Corduroy texture", kind: "lifestyle" },
    ],
    fabric: "8-wale cotton corduroy, sherpa-lined collar option",
    fit: "Relaxed", embroidery: "Back yoke leaf-stitch line",
    care: ["Machine wash cold, inside out", "Line dry", "Do not iron cord pile", "Brush pile gently to refresh"],
    newArrived: true,
  },
  {
    id: "w11", slug: "camel-long-coat", name: "Camel Long Coat",
    shortDescription: "Floor-skimming coat, bronze thread monogram",
    description:
      "The Camel Long Coat is the quiet antagonist of every outfit — a floor-skimming line of camel wool blend with a bronze-thread monogram at the inner cuff. Peak lapels, deep welt pockets, and a back vent that walks beautifully. This is outerwear as intention.",
    gender: "women", category: "jackets", collection: "Monolith",
    price: 5999, mrp: 8999, rating: 4.9, reviewCount: 78,
    badges: ["LIMITED", "SALE"],
    colors: [C.camel, C.charcoal],
    sizes: sizes(["XS", "S"]),
    images: [
      { src: IMG("women_jacket", 8), alt: "Camel Long Coat — street editorial", kind: "front" },
      { src: IMG("women_jacket", 5), alt: "Camel Long Coat — editorial", kind: "model" },
      { src: IMG("embroidery", 9), alt: "Bronze monogram thread", kind: "detail" },
      { src: IMG("fabric", 7), alt: "Wool blend texture", kind: "lifestyle" },
    ],
    fabric: "Wool-blend melton, satin-lined sleeves",
    fit: "Regular", embroidery: "Inner-cuff bronze monogram",
    care: ["Dry clean only", "Steam between wears", "Store on wide hanger", "Use lint brush, never roll"],
    lowStock: true,
  },
  {
    id: "w12", slug: "noir-leather-jacket", name: "Noir Stitch Jacket",
    shortDescription: "Boxy jacket with jet-black tonal stitch panels",
    description:
      "The Noir is black on black done properly — a boxy jacket with tonal stitch panels running the sleeves and back, visible only when the light agrees. Structured shoulders, matte hardware, and a hem that sits at exactly the right height over everything. Limited to 200 pieces per drop.",
    gender: "women", category: "jackets", collection: "Noir",
    price: 4999, mrp: 7499, rating: 4.8, reviewCount: 92,
    badges: ["LIMITED"],
    colors: [C.jet],
    sizes: sizes(["M", "L"]),
    images: [
      { src: IMG("women_jacket", 1), alt: "Noir Stitch Jacket — editorial", kind: "front" },
      { src: IMG("lifestyle", 3), alt: "Noir Stitch Jacket — street", kind: "model" },
      { src: IMG("embroidery", 5), alt: "Tonal stitch panel detail", kind: "detail" },
      { src: IMG("fabric", 3), alt: "Structured twill texture", kind: "lifestyle" },
    ],
    fabric: "Structured cotton twill, satin lining",
    fit: "Oversized", embroidery: "Tonal sleeve + back stitch panels",
    care: ["Dry clean only", "Do not machine wash", "Wipe hardware with soft cloth", "Hang to store"],
    lowStock: true,
  },
];

/* ----------------------------- Categories ---------------------------- */

export const categories: Category[] = [
  { slug: "t-shirts", label: "T-Shirts", image: IMG("women_tee", 4), productCount: 7 },
  { slug: "oversized-t-shirts", label: "Oversized Tees", image: IMG("men_tee", 1), productCount: 4 },
  { slug: "shirts", label: "Shirts", image: IMG("women_shirt", 3), productCount: 4 },
  { slug: "hoodies", label: "Hoodies", image: IMG("men_hoodie", 7), productCount: 4 },
  { slug: "sweatshirts", label: "Sweatshirts", image: IMG("sweatshirt", 1), productCount: 2 },
  { slug: "jackets", label: "Jackets", image: IMG("men_jacket", 3), productCount: 6 },
];

/* ---------------------------- Collections ---------------------------- */

export const collections = [
  { slug: "core-stitch", label: "Core Stitch", description: "The foundational tees" },
  { slug: "nightbloom", label: "Nightbloom", description: "Chikankari-inspired washes" },
  { slug: "craft-atlas", label: "Craft Atlas", description: "Heritage stitches, modern cuts" },
  { slug: "heirloom", label: "Heirloom", description: "Zardozi showpieces" },
  { slug: "wildflower", label: "Wildflower", description: "Back-cascade florals" },
  { slug: "monolith", label: "Monolith", description: "Architectural outerwear" },
];

/* ------------------------------ Reviews ------------------------------ */

export const reviews: Review[] = [
  { id: "r1", name: "Aarav Mehta", location: "Mumbai", rating: 5, title: "The embroidery is unreal", text: "Received the Solstice tee last week and the Kantha crest is even better in person. You can feel the texture of every stitch. This is my fourth DEEPIER piece and the quality has never dipped.", product: "Solstice Embroidered Tee", date: "2 weeks ago", verified: true },
  { id: "r2", name: "Ishita Sharma", location: "Delhi", rating: 5, title: "Worth every rupee", text: "I was skeptical about the price but the fabric weight and the flame embroidery changed my mind completely. Washed it three times already — zero fading, zero shrinkage.", product: "Flame Motif Hoodie", date: "1 month ago", verified: true },
  { id: "r3", name: "Rohan Iyer", location: "Bengaluru", rating: 5, title: "Finally a brand that gets fit", text: "The oversized cut is actually oversized — not just 'one size up'. The Nightbloom tee drapes perfectly and the chikankari-style motif gets compliments every single time I wear it.", product: "Nightbloom Oversized Tee", date: "3 weeks ago", verified: true },
  { id: "r4", name: "Sara Thomas", location: "Kochi", rating: 4, title: "Beautiful craftsmanship", text: "The wildflower back on this tee is genuinely art. Only note: size down if you're between sizes. Packaging was gorgeous too — the kind you keep.", product: "Wildflower Oversized Tee", date: "2 months ago", verified: true },
  { id: "r5", name: "Kabir Singh", location: "Gurugram", rating: 5, title: "My most complimented jacket", text: "The Heirloom bomber stops people mid-conversation. The zardozi panel is dense and flawless. Numbered piece — feels like owning something that matters.", product: "Heirloom Satin Bomber", date: "1 month ago", verified: true },
  { id: "r6", name: "Ananya Rao", location: "Hyderabad", rating: 5, title: "Delivery faster than expected", text: "Ordered on Monday, wearing it by Thursday. The linen is soft but structured, and the collar vine embroidery is such a quiet flex. Already ordered the sand colourway.", product: "Terracotta Linen Co-ord Shirt", date: "3 days ago", verified: true },
  { id: "r7", name: "Vikram Nair", location: "Pune", rating: 5, title: "Hoodie season solved", text: "400 GSM feels like armour against winter. The raised crest embroidery catches light beautifully. My only complaint is that my friends keep borrowing it.", product: "Midnight Zip Hoodie", date: "2 weeks ago", verified: true },
  { id: "r8", name: "Meera Pillai", location: "Chennai", rating: 5, title: "The details are the brand", text: "Even the inner labels are embroidered. The camel coat monogram at the inner cuff made me smile — a detail nobody else would even notice, but I do, every time.", product: "Camel Long Coat", date: "1 week ago", verified: true },
];

/* ------------------------------ Journal ------------------------------ */

export const journal: JournalArticle[] = [
  {
    slug: "art-behind-every-stitch", title: "The Art Behind Every Stitch",
    category: "Craft", date: "2026-08-14", readTime: "6 min", image: IMG("embroidery", 9),
    excerpt: "From Kantha's running lines to the metallic drama of zardozi — a field guide to the stitches that build DEEPIER.",
    body: [
      "Every embroidery tradition begins the same way: a needle, a thread, and the patience to repeat a motion thousands of times. What separates craft from decoration is intent. Kantha's running stitch began as a way to layer old saris into new quilts — thrift turned into texture. When we lay a Kantha panel across a hoodie shoulder, we are quoting that history, not borrowing its costume.",
      "Zardozi arrived in India through Mughal courts, where metallic thread was worked so densely that garments became architecture. Our Heirloom bomber uses 42,000 stitches over three days on a single panel — as close as modern production gets to that original intensity, and the reason each piece is numbered.",
      "The point is not nostalgia. A stitch is simply the most durable line you can draw on fabric. Ink fades and prints crack after twenty washes; thread holds its geometry for the life of the garment. When you choose embroidery, you are choosing the version of the design that survives.",
      "In the studio we keep a wall of 'first attempts' — motifs that never made it to a garment. It is a reminder that behind every crest you wear, there are forty versions that were not good enough. That is the honest arithmetic of craft.",
    ],
  },
  {
    slug: "how-embroidery-changes-a-garment", title: "How Embroidery Changes a Garment",
    category: "Design", date: "2026-07-28", readTime: "5 min", image: IMG("embroidery", 5),
    excerpt: "The same blank tee, before and after the needle: a study in how stitching changes drape, weight, and the way a garment ages.",
    body: [
      "Embroidery is not printed on a garment; it is added to it. Every stitch consumes thread, tension and time, which means the fabric itself changes. A dense crest can add visible structure to a soft tee chest — the area around the motif sits flatter, photographs sharper, and hangs with slightly more authority.",
      "This is why we engineer embroidery into the pattern stage, not after it. A motif placed without regard to drape will pull the fabric sideways after washing. Our placements are tested through thirty-wash cycles before a single piece ships.",
      "There is also the way embroidered garments age. Prints fade evenly and then suddenly all at once. Embroidery ages like denim — the high points of the stitch soften first, the recesses hold their colour, and the motif develops a topography that is unique to how you wear and wash it.",
      "The practical takeaway: hold an embroidered garment up to light. If the stitching looks flat and printed, it is decoration. If it casts a tiny shadow, it is construction. That shadow is what you are paying for.",
    ],
  },
  {
    slug: "inside-the-deepier-studio", title: "Inside the DEEPIER Studio",
    category: "Behind the Scenes", date: "2026-07-02", readTime: "7 min", image: IMG("atelier", 8),
    excerpt: "Where the drops are born: a look at the sampling tables, the thread library, and the thirty-wash rule that governs everything.",
    body: [
      "The studio runs on two clocks. The design calendar counts weeks to a drop; the craft calendar counts washes to approval. Between them sit the sampling tables, where every motif is stitched at three densities before we choose the one that survives wash thirty without puckering.",
      "Our thread library holds over two hundred shades, sorted not by colour but by behaviour — how each thread reflects light, how it ages, how it tolerates friction. Matte viscose for quiet motifs, rayon for lustre, metallics only where the garment can carry the weight.",
      "Every sample must pass what we call the thirty-wash rule: thirty domestic wash cycles, inside out, with the ordinary detergent you would buy at a supermarket. If the motif shifts more than half a millimetre, it goes back to the table. Most do.",
      "The studio is also where the brand's quietly obsessive habits live — swing tags embroidered rather than printed, tissue stamped in-house, boxes designed to be kept. None of this is efficient. All of it is felt.",
    ],
  },
  {
    slug: "styling-oversized-embroidered-t-shirts", title: "Styling the Oversized Embroidered Tee",
    category: "Style", date: "2026-06-15", readTime: "4 min", image: IMG("men_tee", 4),
    excerpt: "Three silhouettes, one tee: how to wear oversized embroidery without drowning in it.",
    body: [
      "Oversized works when everything else is deliberate. Rule one: define one anchor. If the tee is long and wide, the trouser should be tapered or cuffed — the silhouette needs a narrowing to push against. Wide on wide only works when the fabric is stiff enough to hold architecture.",
      "Rule two: let the embroidery choose the palette. A tonal motif wants texture contrast — washed denim, corduroy, wool. A contrast motif wants neutrality around it: bone, black, grey. Never compete with a back cascade using a printed trouser.",
      "Rule three: half-tuck only if the hem embroidery is meant to be seen. The Wildflower tee, for instance, is designed to be worn out — tucking it hides the entire idea. The Ember, with its cuff embroidery, is designed to be layered; let the cuff peek past a jacket sleeve.",
      "Finally: shoes decide whether oversized reads intentional or accidental. Chunky soles ground the volume. Slim soles turn it into costume. Choose accordingly.",
    ],
  },
  {
    slug: "how-to-care-for-embroidered-clothing", title: "Caring for Embroidered Clothing",
    category: "Care", date: "2026-05-30", readTime: "5 min", image: IMG("embroidery", 1),
    excerpt: "Embroidery is tougher than print but not immortal. A practical care routine to make your motifs outlive the trends.",
    body: [
      "The single biggest enemy of embroidery is friction while wet — which is why every wash instruction we print begins the same way: inside out, cold water. Turning the garment inside out puts the abrasion on the fabric's back face instead of the thread's high points.",
      "Skip the dryer when you can. Heat relaxes thread tension and is the reason motifs go shiny over time. If you must tumble, low heat and a short cycle. Line drying in shade keeps both the fabric and the stitch colour stable.",
      "Ironing is where most damage happens. Never iron directly over a motif — the heat flattens the stitch geometry permanently. Iron inside out, or place a cotton cloth over the embroidery and press around it. Steam, not pressure, is your friend.",
      "Storage matters more than people think. Wire hangers stress shoulders and shift drape; wide hangers hold the silhouette. For heirloom-level pieces, tissue between folds prevents thread imprinting on fabric. Five extra seconds, years of extra life.",
    ],
  },
];

/* ------------------------------- FAQs -------------------------------- */

export const faqs = [
  { q: "How long does delivery take?", a: "Metro cities receive orders in 2–4 business days; the rest of India in 4–7 business days. All orders ship within 24 hours of confirmation and you will receive tracking by SMS and email the moment your parcel leaves our studio." },
  { q: "Is shipping really free?", a: "Yes — all orders above ₹999 ship free across India. Orders below ₹999 carry a flat ₹79 shipping fee. There are no hidden handling charges, ever." },
  { q: "What makes DEEPIER embroidery different from prints?", a: "Every DEEPIER motif is stitched with thread, not printed with ink. Embroidery adds real texture, catches light differently at every angle, and survives washing for the life of the garment — while prints typically crack and fade within a year." },
  { q: "How do I choose the right size?", a: "Each product page carries a detailed size chart with garment measurements in inches. Our fits run true to size — order your usual size. For oversized styles, they are intentionally cut 4–6 inches larger; size down only if you prefer a regular fit." },
  { q: "What is your return policy?", a: "Easy 15-day returns on all unworn items with tags intact. Raise a return from your account or the returns page, and our courier partner picks up from your doorstep. Refunds hit your original payment method within 5–7 working days of pickup." },
  { q: "Do you offer exchanges?", a: "Yes — free size exchanges within 15 days of delivery, subject to stock availability. Raise an exchange request from My Orders and we will reserve your preferred size while the pickup is scheduled." },
  { q: "Will the embroidery fade or come off?", a: "No. Every motif is tested through 30+ domestic wash cycles before approval. Wash inside out in cold water, avoid ironing directly over the motif, and the stitching will outlast the garment. That is the entire point of embroidery." },
  { q: "Do you ship internationally?", a: "We currently ship across India and to select international destinations including UAE, Singapore, UK, and USA. International shipping rates and timelines are calculated at checkout based on your delivery address." },
  { q: "How do I track my order?", a: "A tracking link is sent by SMS and email within 24 hours of dispatch. You can also track from My Account → Orders, or use the Track Order page with your order number and registered mobile." },
  { q: "Are DEEPIER pieces limited edition?", a: "Core Stitch essentials are permanent. Seasonal motifs and Heirloom pieces are produced in numbered, limited runs — once a drop sells out, it is rarely repeated. Join the newsletter for early access to every drop." },
  { q: "What payment methods do you accept?", a: "UPI, all major credit and debit cards (Visa, Mastercard, RuPay, Amex), net banking, wallets, and Cash on Delivery on orders up to ₹5,000. All payments are processed over encrypted, PCI-DSS compliant gateways." },
  { q: "How do I care for embroidered garments?", a: "Machine wash cold, inside out, with mild detergent. Do not iron directly on the motif, tumble dry low or line dry, and wash with similar colours. Full care instructions ship with every order and live on each product page." },
];

/* ------------------------------ Coupons ------------------------------ */

export const coupons: Coupon[] = [
  { code: "DEEPER10", type: "percent", value: 10, minOrder: 1499, label: "10% off orders above ₹1,499" },
  { code: "FIRSTSTITCH", type: "flat", value: 300, minOrder: 1999, label: "₹300 off your first order above ₹1,999" },
  { code: "HEIRLOOM15", type: "percent", value: 15, minOrder: 4999, label: "15% off orders above ₹4,999" },
];

export const POPULAR_SEARCHES = ["Oversized tee", "Embroidered hoodie", "Kantha", "Linen shirt", "Bomber", "Zardozi", "Sale", "New arrivals"];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function getProduct(slugOrId: string) {
  return products.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

export function byCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function byGender(gender: string) {
  return products.filter((p) => p.gender === gender);
}

export function bestSellers() {
  return products
    .filter((p) => p.bestSellerRank)
    .sort((a, b) => (a.bestSellerRank ?? 99) - (b.bestSellerRank ?? 99));
}

export function newArrivals() {
  return products.filter((p) => p.newArrived);
}

export function onSale() {
  return products.filter((p) => p.mrp > p.price);
}

export function embroidered() {
  return products;
}
