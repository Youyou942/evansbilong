import { OXRUI_PAGE_IMAGES, JAPAN_PAGE_IMAGES, HYPERPLANNING_PAGE_IMAGES } from "../assets";
import type { ProjectPageImage } from "../assets";

/* ═══════════════════════════════════════════════════════════
   DONNÉES CENTRALISÉES DES PROJETS
   Source unique de vérité — Projects.tsx + ProjectPage.tsx
═══════════════════════════════════════════════════════════ */

export type ProjectTag = string;

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  description: string;
  /** Image de couverture utilisée dans la liste des projets */
  coverImage?: string;
  /** Image principale (opening shot) */
  image: string;
  /** Images dédiées à la page projet (si différentes du cover + gallery) */
  pageImages?: ProjectPageImage[];
  /** Galerie — 3 images DIFFÉRENTES de l'image principale */
  gallery: string[];
  objectPosition: string;
  year: string;
  tags: ProjectTag[];
  externalUrl?: string;
  role: string;
  videos?: ProjectVideo[];
  caseStudy: {
    problem: string;
    solution: string;
    result: string;
  };
};

export type ProjectVideo = {
  title: string;
  src: string;
  poster: string;
  description: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "0xrui",
    index: "01",
    title: "0XRUI",
    category: "Site e-commerce",
    description:
      "Enter The Sanctuary.",
    image: new URL("../../../images/Mockup 0XRUI-optimized.webp", import.meta.url).href,
    pageImages: OXRUI_PAGE_IMAGES,
    gallery: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ],
    objectPosition: "center 30%",
    year: "2026",
    tags: ["E-commerce", "Shopify", "UI/UX"],
    role: "UI/UX design + développement Shopify",
    externalUrl: "https://0xrui.com",
    caseStudy: {
      problem:
        "L'enjeu était de lancer la collection sans perdre le produit dans la mise en scène. Il fallait garder de l'impact et rendre l'achat fluide.",
      solution:
        "J'ai conçu et développé une boutique Shopify sur mesure, avec une identité nette, des produits faciles à lire et un parcours d'achat simple.",
      result:
        "Le site installe clairement l'univers de 0XRUI et accompagne l'achat avec naturel.",
    },
  },
  {
    slug: "japan-airlines",
    index: "02",
    title: "Japan Airlines",
    category: "Rebranding de marque",
    description:
      "Fly into Tomorrow.",
    coverImage: new URL("../../../images/Mockup Jp-optimized.webp", import.meta.url).href,
    image:
      "https://images.unsplash.com/photo-1773713035735-d126c00f8e7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    pageImages: JAPAN_PAGE_IMAGES,
    gallery: [
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ],
    objectPosition: "center 40%",
    year: "2025",
    tags: ["Illustrator", "Figma", "After Effects"],
    role: "Direction artistique, UX/UI homepage et motion design, en collaboration.",
    caseStudy: {
      problem:
        "L'identité devait évoluer sans perdre la force ni la reconnaissance du Tsuru.",
      solution:
        "J'ai retravaillé l'identité, la homepage et le motion autour d'un système plus net, plus lisible, plus actuel.",
      result:
        "La marque gagne en clarté, en impact et en cohérence.",
    },
  },
  {
    slug: "hyperplanning",
    index: "03",
    title: "Hyperplanning",
    category: "UX/UI · Refonte produit",
    description:
      "Designed for clarity.",
    image: new URL("../../../images/Mockup 1 HP-optimized.webp", import.meta.url).href,
    coverImage: new URL("../../../images/Mockup 1 HP-optimized.webp", import.meta.url).href,
    pageImages: HYPERPLANNING_PAGE_IMAGES,
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ],
    objectPosition: "center 30%",
    year: "2025",
    tags: ["UX/UI", "Refonte produit", "Figma"],
    role: "UX/UI, refonte produit.",
    caseStudy: {
      problem:
        "Une plateforme essentielle, mais difficile à lire. Trop d'informations, pas assez de hiérarchie.",
      solution:
        "Navigation clarifiée, écrans allégés, interactions plus directes. Un travail centré sur la lisibilité, la rapidité et la compréhension.",
      result:
        "La refonte simplifie l'usage sans perdre la richesse fonctionnelle de la plateforme.",
    },
  },
  {
    slug: "videos",
    index: "04",
    title: "Réalisations vidéo",
    category: "Motion / Vidéo",
    description: "Frames in Motion.",
    image: "/videos/posters/esmod-2026-lyon.webp",
    coverImage: "/videos/posters/esmod-2026-lyon.webp",
    pageImages: [
      {
        src: "/videos/posters/esmod-2026-lyon.webp",
        alt: "Réalisations vidéo — image de couverture",
        aspect: "16 / 9",
        objectFit: "cover",
        objectPosition: "center",
      },
    ],
    gallery: [],
    objectPosition: "center",
    year: "2025 / 2026",
    tags: ["Montage vidéo", "Motion design", "Direction visuelle"],
    role: "Montage vidéo · Motion design · Direction visuelle",
    videos: [
      {
        title: "Falling Clip V2",
        src: "/videos/falling-clip-v2.mp4",
        poster: "/videos/posters/falling-clip-v2.webp",
        description: "Rythme brut / chute contrôlée",
      },
      {
        title: "This is real",
        src: "/videos/this-is-real.mp4",
        poster: "/videos/posters/this-is-real.webp",
        description: "Motion tracking / réel déformé",
      },
      {
        title: "ESMOD 2026 Lyon",
        src: "/videos/esmod-2026-lyon.mp4",
        poster: "/videos/posters/esmod-2026-lyon.webp",
        description: "Défilé / énergie backstage",
      },
      {
        title: "Tourner la page",
        src: "/videos/tourner-la-page.mp4",
        poster: "/videos/posters/tourner-la-page.webp",
        description: "Ambiance noire / mouvement court",
      },
    ],
    caseStudy: {
      problem:
        "Construire une séquence vidéo courte demande de trouver rapidement un rythme, une intention et une cohérence visuelle.",
      solution:
        "Le travail se concentre sur le montage, l'ambiance, les transitions et la direction de l'image pour donner une identité claire à chaque format.",
      result:
        "Chaque vidéo installe une atmosphère identifiable et montre une approche visuelle construite.",
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx > 0 ? PROJECTS[idx - 1] : PROJECTS[PROJECTS.length - 1];
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : PROJECTS[0];
  return { prev, next };
}
