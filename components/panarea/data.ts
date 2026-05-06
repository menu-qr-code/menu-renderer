import type { PiattoData } from "./LiquidGlassCard";

export const PALETTE = {
  bg: "#0D1B2A",
  bgDeep: "#0B2D4E",
  text: "#F8F6F0",
  textMuted: "#A8A099",
  accent: "#E8622A",
  accentBlue: "#4A90B8",
  border: "rgba(248, 246, 240, 0.1)",
};

export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1600&auto=format&fit=crop&q=80",
];

export const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=70",
    alt: "Mare delle Eolie",
  },
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=70",
    alt: "Interno del locale",
  },
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=70",
    alt: "Pizza napoletana",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=70",
    alt: "Pizza margherita",
  },
  {
    src: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=70",
    alt: "Mozzarella di bufala",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=70",
    alt: "Piatti dell'isola",
  },
];

export const PARALLAX_IMAGE =
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1600&auto=format&fit=crop&q=70";

export const PIATTI: PiattoData[] = [
  // Pizze
  {
    id: 1,
    nome: "Panarea",
    prezzo: "€14",
    descrizione: "Pomodoro giallo del Vesuvio, mozzarella di bufala DOP, capperi di Salina, basilico.",
    ingredienti: "Pomodoro giallo · Bufala DOP · Capperi di Salina · Basilico",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=70",
    categoria: "Pizze",
  },
  {
    id: 2,
    nome: "Stromboli",
    prezzo: "€15",
    descrizione: "Fior di latte, nduja di Spilinga, provola affumicata, cipolla rossa di Tropea.",
    ingredienti: "Fior di latte · Nduja · Provola affumicata · Cipolla rossa",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=70",
    categoria: "Pizze",
  },
  {
    id: 3,
    nome: "Margherita del Mare",
    prezzo: "€12",
    descrizione: "Pomodoro San Marzano DOP, mozzarella di bufala, olio EVO, basilico fresco.",
    ingredienti: "San Marzano DOP · Bufala DOP · Olio EVO · Basilico",
    imageUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&auto=format&fit=crop&q=70",
    categoria: "Pizze",
  },
  {
    id: 4,
    nome: "Vulcano",
    prezzo: "€16",
    descrizione: "Crema di pistacchio, mortadella di Bologna IGP, stracciatella pugliese, limone.",
    ingredienti: "Pistacchio · Mortadella IGP · Stracciatella · Limone",
    imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=70",
    categoria: "Pizze",
  },
  // Antipasti & Fritti
  {
    id: 5,
    nome: "Fritto Misto dell'Isola",
    prezzo: "€11",
    descrizione: "Frittura dorata di calamari, gamberi, zucchine. Maionese al limone.",
    ingredienti: "Calamari · Gamberi · Zucchine · Maionese al limone",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=70",
    categoria: "Antipasti",
  },
  {
    id: 6,
    nome: "Burrata & Salumi",
    prezzo: "€13",
    descrizione: "Burrata di Andria, prosciutto crudo 24 mesi, pomodorini confit, focaccia.",
    ingredienti: "Burrata · Prosciutto crudo · Pomodorini · Focaccia",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=70",
    categoria: "Antipasti",
  },
  {
    id: 7,
    nome: "Montanara",
    prezzo: "€6",
    descrizione: "Pizza fritta, pomodoro San Marzano, parmigiano, basilico. Servita calda.",
    ingredienti: "Impasto fritto · San Marzano · Parmigiano · Basilico",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=70",
    categoria: "Antipasti",
  },
  // Dolci
  {
    id: 8,
    nome: "Ricotta & Agrumi",
    prezzo: "€7",
    descrizione: "Ricotta di pecora, scorza di arancia candita, miele di zagara, granella di pistacchio.",
    ingredienti: "Ricotta · Arancia candita · Miele · Pistacchio",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=70",
    categoria: "Dolci",
  },
];
