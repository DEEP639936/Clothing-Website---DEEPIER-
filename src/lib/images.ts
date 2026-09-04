// DEEPIER curated local image assets — optimized webp, served from /public/img
export const IMG = (pool: string, n: number) => `/img/${pool}-${n}.webp`;

export const HERO_IMAGES = IMG("lifestyle", 6);
export const STORY_IMAGE = IMG("lifestyle", 5);
export const LIMITED_CAMPAIGN = IMG("men_jacket", 7);
export const NEWDROP_CAMPAIGN = IMG("men_tee", 3);

export const CATEGORY_IMAGES: Record<string, string> = {
  "t-shirts": IMG("women_tee", 4),
  "oversized-t-shirts": IMG("men_tee", 1),
  shirts: IMG("women_shirt", 3),
  hoodies: IMG("men_hoodie", 7),
  sweatshirts: IMG("sweatshirt", 1),
  jackets: IMG("men_jacket", 3),
  embroidery: IMG("embroidery", 5),
  "new-arrivals": IMG("men_jacket", 2),
};

export const EMBROIDERY_STORY_IMAGES = [
  IMG("embroidery", 2),
  IMG("embroidery", 3),
  IMG("embroidery", 5),
  IMG("embroidery", 9),
];

export const ATELIER_IMAGES = [
  IMG("atelier", 2),
  IMG("atelier", 3),
  IMG("atelier", 5),
  IMG("atelier", 8),
  IMG("atelier", 7),
  IMG("hero", 6),
];

export const FABRIC_IMAGES = [
  IMG("fabric", 1),
  IMG("fabric", 3),
  IMG("fabric", 5),
  IMG("fabric", 7),
];

export const INSTAGRAM_IMAGES = [
  IMG("lifestyle", 3),
  IMG("men_shirt", 6),
  IMG("men_tee", 3),
  IMG("hero", 5),
  IMG("sweatshirt", 5),
  IMG("hero", 10),
  IMG("sweatshirt", 3),
  IMG("men_hoodie", 7),
];

export const ABOUT_IMAGES = {
  beginning: IMG("hero", 10),
  studio: IMG("hero", 6),
  craft: IMG("atelier", 2),
  goldenHour: IMG("lifestyle", 6),
  editorial: IMG("lifestyle", 8),
};

export const JOURNAL_IMAGES = {
  stitch: IMG("embroidery", 9),
  garment: IMG("embroidery", 5),
  studio: IMG("atelier", 8),
  styling: IMG("men_tee", 4),
  care: IMG("embroidery", 1),
};
