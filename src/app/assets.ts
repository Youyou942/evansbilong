export type ProjectPageImage = {
  src: string;
  alt: string;
  aspect: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  maxWidth?: string;
};

export const EVANS_SIGNATURE = "EVANS BILONG";
export const EVANS_PORTRAIT_IMAGE = new URL(
  "../../Generated Image April 13, 2026 - 10_58AM.jpg",
  import.meta.url,
).href;
export const EVANS_PORTRAIT_MOBILE_IMAGE = new URL(
  "../../images/Evans Phone.png",
  import.meta.url,
).href;
export const EVANS_PORTRAIT_ALT = "Portrait d'Evans Bilong";
export const EVANS_PORTRAIT_RATIO = "5504 / 3072";

export const JAPAN_VIDEO = new URL(
  "../../images/japan airlines vid_1.webm",
  import.meta.url,
).href;

export const JAPAN_PAGE_IMAGES: ProjectPageImage[] = [
  /* 00 — Logo (opening shot, plein format) */
  {
    src: new URL("../../images/Logo Jp.webp", import.meta.url).href,
    alt: "Japan Airlines — Logo redesign",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 01 — Maquette homepage */
  {
    src: new URL("../../images/Maquette Jp.webp", import.meta.url).href,
    alt: "Japan Airlines — Maquette homepage",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 02 — Mockup device */
  {
    src: new URL("../../images/Mockup Jp.webp", import.meta.url).href,
    alt: "Japan Airlines — Mockup",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 03 — Cards solo */
  {
    src: new URL("../../images/Cards solo Jp.webp", import.meta.url).href,
    alt: "Japan Airlines — Cards",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 04 — Cartes */
  {
    src: new URL("../../images/Cartes jp.webp", import.meta.url).href,
    alt: "Japan Airlines — Cartes",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 05 — Chartes */
  {
    src: new URL("../../images/Chartes Jp.webp", import.meta.url).href,
    alt: "Japan Airlines — Chartes graphiques",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 06 — Variantes logo */
  {
    src: new URL("../../images/Variantes logo.webp", import.meta.url).href,
    alt: "Japan Airlines — Variantes logo",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 07 — Slide 1 */
  {
    src: new URL("../../images/Slide 16_9 - 1.webp", import.meta.url).href,
    alt: "Japan Airlines — Slide 01",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 08 — Slide 2 */
  {
    src: new URL("../../images/Slide 16_9 - 2.webp", import.meta.url).href,
    alt: "Japan Airlines — Slide 02",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 09 — Panneau Japan */
  {
    src: new URL("../../images/panneau japan 3.webp", import.meta.url).href,
    alt: "Japan Airlines — Panneau",
    aspect: "16 / 9",
    objectFit: "cover",
    objectPosition: "center",
  },
  /* 10 — Desktop 9 */
  {
    src: new URL("../../images/Desktop - 9.webp", import.meta.url).href,
    alt: "Japan Airlines — Desktop 09",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 11 — Desktop 16 */
  {
    src: new URL("../../images/Desktop - 16.webp", import.meta.url).href,
    alt: "Japan Airlines — Desktop 16",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
];

export const HYPERPLANNING_PAGE_IMAGES: ProjectPageImage[] = [
  /* 00 — Mockup 1 HP (opening shot) */
  {
    src: new URL("../../images/Mockup 1 HP.png", import.meta.url).href,
    alt: "Hyperplanning — Mockup 01",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 01 — Refonte */
  {
    src: new URL("../../images/Refont HP.png", import.meta.url).href,
    alt: "Hyperplanning — Refonte",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 02 — Vie scolaire */
  {
    src: new URL("../../images/Vie scolaire HP.png", import.meta.url).href,
    alt: "Hyperplanning — Vie scolaire",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 03 — Planning */
  {
    src: new URL("../../images/Planning HP.png", import.meta.url).href,
    alt: "Hyperplanning — Planning",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 04 — Notes */
  {
    src: new URL("../../images/Notes HP.png", import.meta.url).href,
    alt: "Hyperplanning — Notes",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
  /* 05 — Arborescence */
  {
    src: new URL("../../images/Arborescence HP.png", import.meta.url).href,
    alt: "Hyperplanning — Arborescence",
    aspect: "16 / 9",
    objectFit: "contain",
    objectPosition: "center",
  },
];

export const OXRUI_PAGE_IMAGES: ProjectPageImage[] = [
  {
    src: new URL("../../images/Hero Xrui.png", import.meta.url).href,
    alt: "0XRUI — visuel 01",
    aspect: "2048 / 1077",
    objectFit: "contain",
    objectPosition: "center",
  },
  {
    src: new URL("../../images/Figures 2 Xrui.png", import.meta.url).href,
    alt: "0XRUI — visuel 02",
    aspect: "2048 / 1082",
    objectFit: "contain",
    objectPosition: "center",
  },
  {
    src: new URL("../../images/Figures Xrui.png", import.meta.url).href,
    alt: "0XRUI — visuel 03",
    aspect: "2048 / 1290",
    objectFit: "contain",
    objectPosition: "center",
  },
  {
    src: new URL("../../images/Mockup 0XRUI.png", import.meta.url).href,
    alt: "0XRUI — visuel 04",
    aspect: "2048 / 1062",
    objectFit: "contain",
    objectPosition: "center",
  },
  {
    src: new URL("../../images/Panier Xrui.png", import.meta.url).href,
    alt: "0XRUI — visuel 05",
    aspect: "2048 / 1286",
    objectFit: "contain",
    objectPosition: "center",
  },
  {
    src: new URL("../../images/Contact Xrui.png", import.meta.url).href,
    alt: "0XRUI — visuel 06",
    aspect: "2048 / 1186",
    objectFit: "contain",
    objectPosition: "center",
  },
  {
    src: new URL("../../images/Mockup 2 Xrui.png", import.meta.url).href,
    alt: "0XRUI — visuel mobile",
    aspect: "1176 / 2048",
    objectFit: "contain",
    objectPosition: "center",
    maxWidth: "min(100%, 32rem)",
  },
];