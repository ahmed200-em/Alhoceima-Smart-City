export const reportCategories = [
  { value: 'transport', label: 'Transport' },
  { value: 'electricite', label: 'Electricity' },
  { value: 'eau', label: 'Water' },
  { value: 'dechets', label: 'Waste' },
  { value: 'eclairage', label: 'Street lighting' },
  { value: 'urbanisme', label: 'Urban planning' },
  { value: 'cadre-de-vie', label: 'Neighbourhood environment' },
  { value: 'autre', label: 'Other' },
]

export const reportStatuses = [
  { value: 'pending', label: 'Pending', step: 'Report submitted', note: 'Your report was saved.' },
  { value: 'in-progress', label: 'In progress', step: 'Work in progress', note: 'Work on the reported issue has started.' },
  { value: 'resolved', label: 'Resolved', step: 'Report resolved', note: 'This report is closed in the demo.' },
]

export const sampleReports = [
  {
    id: 'SC-2024-00123',
    category: 'eau',
    title: 'Water leak on the road',
    description: 'Water is leaking onto the road near the junction, making it difficult for pedestrians to cross.',
    neighborhood: 'Hay Al Matar',
    address: 'Rue Al Massira, near the junction',
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
    title: 'Broken street light',
    description: 'The street light near the pedestrian crossing has been out for several evenings.',
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
    title: 'Missed waste collection',
    description: 'The bins near the bus stop are full and need emptying.',
    neighborhood: 'Ajdir',
    address: 'Near the bus stop',
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
    title: 'Pothole in the road',
    description: 'A pothole formed at the entrance to the street after the recent rain.',
    neighborhood: 'Calabonita',
    address: '',
    createdAt: '2024-05-02T11:00:00Z',
    status: 'pending',
    history: [{ status: 'pending', date: '2024-05-02T11:00:00Z' }],
    sample: true,
  },
]
