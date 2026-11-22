export const reportCategories = [
  { value: 'transport', label: 'Transport' },
  { value: 'electricite', label: 'Électricité' },
  { value: 'eau', label: 'Eau' },
  { value: 'dechets', label: 'Déchets' },
  { value: 'eclairage', label: 'Éclairage public' },
  { value: 'urbanisme', label: 'Urbanisme' },
  { value: 'cadre-de-vie', label: 'Cadre de vie' },
  { value: 'autre', label: 'Autre' },
]

export const reportStatuses = [
  { value: 'pending', label: 'En attente', step: 'Signalement soumis', note: 'Votre signalement a été enregistré.' },
  { value: 'in-progress', label: 'En cours', step: 'Traitement en cours', note: 'Le traitement du signalement a commencé.' },
  { value: 'resolved', label: 'Résolu', step: 'Signalement résolu', note: 'Le signalement est clôturé dans la démonstration.' },
]

export const sampleReports = [
  {
    id: 'SC-2024-00123',
    category: 'eau',
    title: 'Fuite d’eau sur la chaussée',
    description: 'Une fuite d’eau s’écoule sur la chaussée près du carrefour. Le passage des piétons devient difficile.',
    neighborhood: 'Hay Al Matar',
    address: 'Rue Al Massira, près du carrefour',
    createdAt: '2024-05-12T09:15:00Z',
    status: 'in-progress',
    history: [
      { status: 'pending', date: '2024-05-12T09:15:00Z' },
      { status: 'in-progress', date: '2024-05-13T08:20:00Z' },
    ],
    sample: true,
  },
  {
    id: 'SC-2024-00110',
    category: 'eclairage',
    title: 'Poteau d’éclairage défectueux',
    description: 'Le luminaire près du passage piéton reste éteint depuis plusieurs soirs.',
    neighborhood: 'Badès',
    address: 'Rue Ibn Sina',
    createdAt: '2024-05-08T15:20:00Z',
    status: 'pending',
    history: [{ status: 'pending', date: '2024-05-08T15:20:00Z' }],
    sample: true,
  },
  {
    id: 'SC-2024-00098',
    category: 'dechets',
    title: 'Collecte des déchets manquée',
    description: 'Les bacs près de l’arrêt de bus sont pleins et doivent être vidés.',
    neighborhood: 'Ajdir',
    address: 'À proximité de l’arrêt de bus',
    createdAt: '2024-05-05T08:05:00Z',
    status: 'resolved',
    history: [
      { status: 'pending', date: '2024-05-05T08:05:00Z' },
      { status: 'in-progress', date: '2024-05-05T10:45:00Z' },
      { status: 'resolved', date: '2024-05-05T16:45:00Z' },
    ],
    sample: true,
  },
  {
    id: 'SC-2024-00087',
    category: 'transport',
    title: 'Nid-de-poule sur la route',
    description: 'Un nid-de-poule s’est formé à l’entrée de la rue après les dernières pluies.',
    neighborhood: 'Calabonita',
    address: '',
    createdAt: '2024-05-02T11:00:00Z',
    status: 'pending',
    history: [{ status: 'pending', date: '2024-05-02T11:00:00Z' }],
    sample: true,
  },
]
