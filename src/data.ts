export type Category = 'Energie' | 'Eclairage' | 'Alimentation' | 'Lecture' | 'Hygiène' | 'Communication' | 'Outils' | 'Divers' ;
export type Usage = 'Urbain' | 'Bivouac' | 'Maison' | 'Tous' ;

export interface Product {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  amazonLink: string;
  category: Category;
  usage: Usage[];
  videoUrl?: string;
}

export const categories: Category[] = [
  'Energie',
  'Eclairage',
  'Alimentation',
  'Lecture',
  'Hygiène',
  'Communication',
  'Outils',
  'Divers'
];

export const usages: Usage[] = [
  'Urbain',
  'Bivouac',
  'Maison',
  'Tous'
];

export const products: Product[] = [
  {
    id: 'p1',
    title: 'BigBlue 28W',
    summary: 'Chargeur Solaire Pliable avec 2 USB C + 1 USB A Ports(5V/4,8A au Total) Panneau Solaire Portable Imperméable IP44.',
    imageUrl: '/images/solar-panel.jpg',
    amazonLink: 'https://amzn.to/4sxGqMg',
    category: 'Energie',
    usage: ['Bivouac', 'Maison'],
    videoUrl: 'https://www.youtube.com/shorts/Aa2BK6vcBzA'
  },
  {
    id: 'p2',
    title: 'Anker SOLIX C300 DC PowerBank',
    summary: 'Station électrique, 288 Wh (90 000 mAh) pour Plusieurs appareils, Batterie LiFePO4, générateur Solaire 300 W, Camping, Voyage et urgences.',
    imageUrl: '/images/generator.jpg',
    amazonLink: 'https://amzn.to/4rltIPJ',
    category: 'Energie',
    usage: ['Urbain', 'Bivouac', 'Maison'],
    videoUrl: 'https://www.youtube.com/shorts/L6SzFPsrr5c'
  },
  {
    id: 'p3',
    title: 'Nitecore NU25 MTC',
    summary: 'La lampe frontale NU25MCT offre 400 lumens (portée 132 m), une autonomie jusqu’à 45 h avec indicateur de batterie, 3 températures de couleur + modes ultra-faible (6 lumens) et rouge, le tout dans un format ultra-léger de 50 g, étanche IP66 et verrouillable.',
    imageUrl: '/images/NU25MTC.jpg',
    amazonLink: 'https://amzn.to/4rhLO5a',
    category: 'Eclairage',
    usage: ['Bivouac', 'Urbain'],
    videoUrl: 'https://www.youtube.com/shorts/hNM58qB3q84'
  },
  {
    id: 'p4',
    title: 'Radio Portable Survie XHDATA D608WB',
    summary: 'Solaire Dynamo Survival Batterie Rechargeable 3000 mAh du Téléphone par USB Bluetooth/TF Lampe de Poche Lampe de Lecture SOS Camping Situations d\'urgence.',
    imageUrl: '/images/Radio.jpg',
    amazonLink: 'https://amzn.to/46RmnjA',
    category: 'Communication',
    usage: ['Maison', 'Bivouac'],
    videoUrl: 'https://www.youtube.com/shorts/ViSxS2_9BjA'
  },
  {
    id: 'p5',
    title: 'NRG-5 nourriture d\'urgence - 24 x 2300 kcal',
    summary: 'La ration de secours NRG-5 est une solution nutritionnelle complète conçue pour les situations d’urgence.',
    imageUrl: '/images/NRG5.jpg',
    amazonLink: 'https://amzn.to/3P5bpAL',
    category: 'Alimentation',
    usage: ['Maison', 'Bivouac'],
    videoUrl: 'https://www.youtube.com/shorts/yHoDRjm5YKw'
  },
  {
    id: 'p6',
    title: 'GRAYL GeoPress 710 ml',
    summary: 'Filtre à eau pour l\'extérieur, Élimine 99,99% de toutes les bactéries et virus.',
    imageUrl: '/images/Grayl.jpg',
    amazonLink: 'https://amzn.to/4aY8l1X',
    category: 'Alimentation',
    usage: ['Bivouac', 'Urbain'],
    videoUrl: 'https://www.youtube.com/shorts/w_3D3_Cu7fo'
  },
  {
    id: 'p7',
    title: 'Survivre à l\'effondrement économique',
    summary: 'Comment se préparer ? Comment survivre à ces prochaines années de grands changements qui seront à la fois soudains, rapides et violents ? Êtes-vous prêts ?',
    imageUrl: '/images/survivre-a-l-effondrement-economique.jpg',
    amazonLink: 'https://amzn.to/46ONcEX',
    category: 'Lecture',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=tsYORZrfbRU'
  },
  {
    id: 'p8',
    title: 'Trousse de Premiers Secours Complète LEWIS-PLAST',
    summary: 'Grande trousse de premiers secours tout usage 224 pièces.',
    imageUrl: '/images/trousse.jpg',
    amazonLink: 'https://amzn.to/4aXDhiX',
    category: 'Divers',
    usage: ['Tous'],
    videoUrl: 'https://www.youtube.com/watch?v=r829HNMfq5M'
  },
  {
    id: 'p9',
    title: 'Lepro Lampe LED',
    summary: ' Lampe Camping LED [Jusqu\'à 200h d\'éclairage ] , Lanterne Camping Puissante 1000lm, Alimentation par pile, Luminosité Réglable, Etanche, pour Camping, Bivouac, Pêche, Randonnée, Cave, 2pcs.',
    imageUrl: '/images/lanterneLepro.jpg',
    amazonLink: 'https://amzn.to/4bwJ7YE',
    category: 'Eclairage',
    usage: ['Bivouac', 'Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=Mjur5mgo4yk'
  },
  {
    id: 'p10',
    title: 'AFERIY Generateur Electrique Portable 2400W',
    summary: 'Batterie Nomade LiFePO4, Charge en 1,5H, Prise UE 220-240V, Fonction UPS, Station électrique Portable pour Camping/Maison/Bureau, Garantie 7 Ans.',
    imageUrl: '/images/generator2.jpg',
    amazonLink: 'https://amzn.to/3Nqds1R',
    category: 'Energie',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/shorts/Fra8mGcbMOg'
  },
  {
    id: 'p11',
    title: 'ECO-WORTHY Bluetooth 280A',
    summary: 'Batterie Lithium 12V 280AH LiFePO4 avec BMS Protection, Plus de 6000 Cycles, 3584Wh Batterie Lithium pour Camping-Car, Bateau, Système Solaire, Maison, Panneau Solaire',
    imageUrl: '/images/batterie.jpg',
    amazonLink: 'https://amzn.to/4liMPZo',
    category: 'Energie',
    usage: ['Maison'],
    videoUrl: 'https://youtu.be/QxkUG6bzs7I'
  },
  {
    id: 'p12',
    title: 'Filtre à Eau Sawyer Mini',
    summary: 'Filtre à eau pour l\'extérieur, Élimine 99,99% de toutes les bactéries et virus.',
    imageUrl: '/images/sawyer-water-filter-1.jpg',
    amazonLink: 'https://amzn.to/47jfuHO',
    category: 'Alimentation',
    usage: ['Bivouac'],
    videoUrl: 'https://www.youtube.com/shorts/yXcgoJJtyoY'
  },
  {
    id: 'p13',
    title: 'Rues Barbares : survivre en ville',
    summary: 'Comment survivre en ville ? Si vous ne lisez pas ce livre, nous ne donnons pas cher de votre peau de citadin !',
    imageUrl: '/images/rue-barbare.jpg',
    amazonLink: 'https://amzn.to/3PnBZVQ',
    category: 'Lecture',
    usage: ['Urbain', 'Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=W2ojY3Qw5_w'
  },
  {
    id: 'p14',
    title: 'Pâte combustible HENDI',
    summary: 'Cette Pâte Combustible pour Chafing Dish en Boîte. Le lot se compose de 12 boîtes de 200 g pour une durée de combustion de 3h.',
    imageUrl: '/images/pate.jpg',
    amazonLink: 'https://amzn.to/4uhZ2kY',
    category: 'Divers',
    usage: ['Bivouac', 'Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=gkMXSr_ZG3g&t=578s'
  },
  {
    id: 'p15',
    title: 'Résilience! L\'eau - Manuel Pratique',
    summary: 'Manuel survivaliste 100% pratique dédié entièrement au sujet fondamental de l’eau.',
    imageUrl: '/images/Leau.jpg',
    amazonLink: 'https://amzn.to/4ud7DFP',
    category: 'Lecture',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/shorts/sFIQbk3fBGk'
  },
  {
    id: '16',
    title: 'Merrell Homme Moab 3',
    summary: 'Excellente chaussures de randonnée.',
    imageUrl: '/images/merell.jpg',
    amazonLink: 'https://amzn.to/4lhTuTC',
    category: 'Divers',
    usage: ['Bivouac', 'Urbain'],
    videoUrl: 'https://www.youtube.com/watch?v=mLFOX9Rs4kE'
  },
  {
    id: '17',
    title: 'L\'autonomie énergétique',
    summary: 'Indépendance énergétique!',
    imageUrl: '/images/Lchaillot-1.jpg',
    amazonLink: 'https://amzn.to/4buE6zU',
    category: 'Lecture',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=shDxHwS4H5s'
  },
  {
    id: '18',
    title: 'MOUNTAINTOP Sac à dos',
    summary: 'Sac à dos de randonnée 40 l idéal pour une évacuation réussie.',
    imageUrl: '/images/sacados.jpg',
    amazonLink: 'https://amzn.to/4bhieH2',
    category: 'Divers',
    usage: ['Bivouac'],
    videoUrl: 'https://www.youtube.com/watch?v=1cTlsnusmsU'
  },
  {
    id: '19',
    title: 'Butoir de porte alarme',
    summary: 'Petit système de blocage de porte (portable et réglable) avec alarme, 80 dB, pour la maison, l\'hôtel, les évacuations.',
    imageUrl: '/images/blocporte.jpg',
    amazonLink: 'https://amzn.to/4blloJY',
    category: 'Divers',
    usage: ['Urbain', 'Maison'],
    videoUrl: 'https://www.youtube.com/shorts/i6T69cakDdI'
  },
  {
    id: '20',
    title: 'Victron Energy MPPT 100V 30 amp 12/24-Volt (Bluetooth)',
    summary: 'Régulateur MPPT pour recharger une batterie avec un panneau solaire.',
    imageUrl: '/images/victron.jpg',
    amazonLink: 'https://amzn.to/4bhP0Yt',
    category: 'Energie',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/shorts/t5f-7bHHw2o'
  },
  {
    id: '21',
    title: 'Douche Sopal',
    summary: 'Douche électrique portable pour le camping et les situations d\'urgence. Elle vous permet de faire aussi la vaisselle.',
    imageUrl: '/images/douche.jpg',
    amazonLink: 'https://amzn.to/3Pgn1RN',
    category: 'Hygiène',
    usage: ['Bivouac', 'Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=5Waa_5Qe4hI'
  },
  {
    id: '22',
    title: 'Panneau solaire 400W',
    summary: 'Pour recharger les générateurs et ta batterie de secours.',
    imageUrl: '/images/panneau.jpg',
    amazonLink: 'https://amzn.to/41ipHkj',
    category: 'Energie',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/shorts/ahsgvW8M4cA'
  },
  {
    id: '23',
    title: 'Leatherman Wave+',
    summary: 'Pince multifonction avec 18 outils essentiels.',
    imageUrl: '/images/Leatherman.jpg',
    amazonLink: 'https://amzn.to/4ss54hK',
    category: 'Outils',
    usage: ['Tous'],
    videoUrl: 'https://www.youtube.com/shorts/gQCkQbkHx6E'
  },
  {
    id: '24',
    title: 'Scie pliante Bahco Laplander',
    summary: 'Scie compacte et robuste pour le bois et les matériaux tendres.',
    imageUrl: '/images/scie-bahco.jpg',
    amazonLink: 'https://amzn.to/4lJBpxL',
    category: 'Outils',
    usage: ['Bivouac', 'Maison'],
    videoUrl: 'https://www.youtube.com/shorts/hczCV27fdlU'
  },
  {
    id: '25',
    title: 'Réchaud à gaz',
    summary: 'Sans électricité, comment faire à manger ?',
    imageUrl: '/images/rechaud.jpg',
    amazonLink: 'https://amzn.to/3PmiWvf',
    category: 'Alimentation',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=3s2PebUPtuU'
  },
  {
    id: '26',
    title: 'Filtre à eau British Berkefeld 6l',
    summary: 'Un système de filtre à eau pour la famille, d\'exellente quatité en inox alimentaire.',
    imageUrl: '/images/BB.jpg',
    amazonLink: 'https://amzn.to/4lJBpxL',
    category: 'Alimentation',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=emxDhrU_8yw'
  },
  {
    id: '27',
    title: 'Filtres pour filtre à eau British Berkefeld',
    summary: 'Purifier son eau devient un jeu d\'enfant.',
    imageUrl: '/images/FiltreBB.jpg',
    amazonLink: 'https://amzn.to/4lOvKGX',
    category: 'Alimentation',
    usage: ['Maison'],
    videoUrl: 'https://www.youtube.com/watch?v=emxDhrU_8yw'
  }
];