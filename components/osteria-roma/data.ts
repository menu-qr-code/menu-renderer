export interface PiattoData {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: string;
  imageUrl: string;
  categoria: string;
  ingredienti?: string;
  allergeni?: string;
}

export const PIATTI: PiattoData[] = [
  {
    id: "ant-1",
    nome: "Carciofi alla Romana",
    categoria: "Antipasti",
    prezzo: "€12",
    descrizione: "Carciofi romani teneri brasati con aglio, mentuccia e olio extravergine. Ricetta della tradizione.",
    imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Carciofi, aglio, mentuccia, olio EVO",
    allergeni: "Nessuno",
  },
  {
    id: "ant-2",
    nome: "Supplì al Telefono",
    categoria: "Antipasti",
    prezzo: "€8",
    descrizione: "Supplì fritti con riso al ragù e mozzarella filante. Il filo di mozzarella è il nostro marchio.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Riso, ragù, mozzarella, uova, pangrattato",
    allergeni: "Glutine, uova, latticini",
  },
  {
    id: "pri-1",
    nome: "Cacio e Pepe",
    categoria: "Primi",
    prezzo: "€14",
    descrizione: "Tonnarelli con pecorino romano DOP e pepe nero macinato al momento. Nient'altro.",
    imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Tonnarelli, pecorino romano DOP, pepe nero",
    allergeni: "Glutine, latticini",
  },
  {
    id: "pri-2",
    nome: "Carbonara della Tradizione",
    categoria: "Primi",
    prezzo: "€15",
    descrizione: "Rigatoni con guanciale croccante, uovo intero, pecorino e pepe. Zero panna — come vuole Roma.",
    imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Rigatoni, guanciale, uovo, pecorino, pepe",
    allergeni: "Glutine, uova, latticini",
  },
  {
    id: "pri-3",
    nome: "Amatriciana",
    categoria: "Primi",
    prezzo: "€14",
    descrizione: "Bucatini con guanciale, pomodoro San Marzano, pecorino e peperoncino. La matrice di tutto.",
    imageUrl: "https://images.unsplash.com/photo-1567608285969-48e4bbe0d399?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Bucatini, guanciale, pomodoro, pecorino, peperoncino",
    allergeni: "Glutine, latticini",
  },
  {
    id: "sec-1",
    nome: "Abbacchio alla Scottadito",
    categoria: "Secondi",
    prezzo: "€22",
    descrizione: "Costolette di agnello alla brace, da mangiare con le mani. Scottante come il nome dice.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Agnello, rosmarino, aglio, olio EVO",
    allergeni: "Nessuno",
  },
  {
    id: "sec-2",
    nome: "Pollo alla Romana",
    categoria: "Secondi",
    prezzo: "€18",
    descrizione: "Pollo in umido con peperoni rossi e gialli, pomodoro e vino bianco. Piatto della domenica.",
    imageUrl: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Pollo, peperoni, pomodoro, vino bianco",
    allergeni: "Nessuno",
  },
  {
    id: "dol-1",
    nome: "Tiramisù della Casa",
    categoria: "Dolci",
    prezzo: "€7",
    descrizione: "Preparato la mattina con mascarpone fresco, savoiardi e caffè ristretto. La nonna lo approva.",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Mascarpone, uova, savoiardi, caffè, cacao",
    allergeni: "Uova, latticini, glutine",
  },
  {
    id: "dol-2",
    nome: "Crostata di Ricotta",
    categoria: "Dolci",
    prezzo: "€6",
    descrizione: "Frolla croccante con crema di ricotta romana e scorza d'arancia. Semplice, perfetta.",
    imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Ricotta, farina, burro, uova, arancia",
    allergeni: "Uova, latticini, glutine",
  },
  {
    id: "vin-1",
    nome: "Frascati DOC",
    categoria: "Vini",
    prezzo: "€18/b",
    descrizione: "Bianco dei Castelli Romani. Fresco, leggero, minerale. Il vino dell'osteria per eccellenza.",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Malvasia, Trebbiano — Castelli Romani",
  },
  {
    id: "vin-2",
    nome: "Cesanese del Piglio",
    categoria: "Vini",
    prezzo: "€24/b",
    descrizione: "Rosso laziale DOCG, tannico e speziato. Si sposa perfettamente con l'abbacchio.",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
    ingredienti: "Cesanese — Frosinone, Lazio",
  },
];

export const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1567608285969-48e4bbe0d399?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596797882870-8c33d938b2b4?w=800&auto=format&fit=crop&q=80",
];

export const PARALLAX_IMAGE =
  "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=1600&auto=format&fit=crop&q=80";
