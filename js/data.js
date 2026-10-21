// Base de données officielle - Somone Tech Gear
const PRODUITS = [
  {
    id: 1,
    nom: "Clavier Mécanique RGB Pro",
    prix: 45000,
    categorie: "Périphériques",
    images: [
      "images/clavier-1.jpg",
      "images/clavier-2.jpg",
      "images/clavier-3.jpg"
    ],
    description: "Switchs tactiles silencieux, rétroéclairage RGB personnalisable et châssis en aluminium.",
    caracteristiques: "Sans fil / Filaire (Type-C), Autonomie 40h",
    vedette: true
  },
  {
    id: 2,
    nom: "Souris Ergonomique Master",
    prix: 28000,
    categorie: "Périphériques",
    images: [
      "images/souris-1.jpg",
      "images/souris-2.jpg",
      "images/souris-3.jpg"
    ],
    description: "Capteur haute précision 16 000 DPI et prise en main ergonomique pour les longues sessions de code.",
    caracteristiques: "Bluetooth & 2.4GHz, 7 boutons programmables",
    vedette: true
  },
  {
    id: 3,
    nom: "Casque Audio Code & Sound",
    prix: 55000,
    categorie: "Audio",
    images: [
      "images/casque-1.jpg",
      "images/casque-2.jpg",
      "images/casque-3.jpg"
    ],
    description: "Réduction de bruit active (ANC) et coussinets à mémoire de forme pour une concentration maximale.",
    caracteristiques: "Autonomie 30h, Réduction de bruit active",
    vedette: true
  },
  {
    id: 4,
    nom: "Tapis de Bureau XL Somone",
    prix: 12000,
    categorie: "Accessoires",
    images: [
      "images/tapis-1.jpg",
      "images/tapis-2.jpg",
      "images/tapis-3.jpg"
    ],
    description: "Surface textile ultra-lisse imperméable et base antidérapante en caoutchouc synthétique.",
    caracteristiques: "Dimensions 900x400mm, Épaisseur 4mm",
    vedette: true
  },
  {
    id: 5,
    nom: "Hub USB-C 8-en-1 Aluminium",
    prix: 22000,
    categorie: "Accessoires",
    images: [
      "images/hub-1.jpg",
      "images/hub-2.jpg",
      "images/hub-3.jpg"
    ],
    description: "Multipliez vos connectiques : HDMI 4K, 3x USB 3.0, Lecteur SD/TF et Port Ethernet RJ45.",
    caracteristiques: "Charge Pass-Through 100W, Aluminium anodisé",
    vedette: false
  },
  {
    id: 6,
    nom: "Support d'Écran Articulé",
    prix: 32000,
    categorie: "Accessoires",
    images: [
      "images/setup-1.jpg",
      "images/setup-2.jpg",
      "images/setup-3.jpg"
    ],
    description: "Bras à vérin à gaz pour ajuster parfaitement la hauteur et l'angle de votre moniteur.",
    caracteristiques: "Compatible VESA 75/100, Charge max 9kg",
    vedette: false
  },
  {
    id: 7,
    nom: "Hoodie Somone 'Clean Code'",
    prix: 25000,
    categorie: "Merch",
    images: [
      "images/hoodie-1.jpg",
      "images/hoodie-2.jpg",
      "images/hoodie-3.jpg"
    ],
    description: "Sweat à capuche molletonné coupe oversize avec logo minimaliste Somone Tech brodé.",
    caracteristiques: "100% Coton biologique, M au XXL",
    vedette: false
  },
  {
    id: 8,
    nom: "Gourde Isotherme Tech 750ml",
    prix: 10000,
    categorie: "Merch",
    images: [
      "images/gourde-1.jpg",
      "images/gourde-2.jpg",
      "images/gourde-3.jpg"
    ],
    description: "Conserve vos boissons froides pendant 24h et chaudes pendant 12h sur votre bureau.",
    caracteristiques: "Acier inoxydable sans BPA, Double paroi",
    vedette: false
  }
];