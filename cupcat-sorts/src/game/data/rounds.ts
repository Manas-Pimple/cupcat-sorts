export type BinId = 'recycle' | 'compost' | 'landfill'

export interface Round {
  name: string
  emoji: string
  bin: BinId
  hint: string
  correction: string
  facts: { e: string; t: string }[]
}

export const ROUNDS: Round[] = [
  {
    name: 'Paper Cup',
    emoji: '☕',
    bin: 'landfill',
    hint: 'Check the lining — it changes everything.',
    correction: 'Paper cups have a plastic inner lining — most recyclers reject them. Landfill.',
    facts: [
      { e: '🧪', t: 'Paper cups have a thin plastic lining that makes them non-recyclable in most curbside programs.' },
      { e: '🌍', t: 'Over 50 billion paper cups are discarded annually — each a hidden source of micro-plastic.' },
    ],
  },
  {
    name: 'PLA Bioplastic Cup',
    emoji: '🥤',
    bin: 'compost',
    hint: 'Looks plastic, but it\'s plant-based!',
    correction: 'PLA bioplastic needs industrial composting — it can\'t go in recycling or home compost.',
    facts: [
      { e: '🌽', t: 'PLA cups are made from cornstarch — they need industrial composting at 60°C+ to break down.' },
      { e: '♻️', t: 'Bioplastics contaminate plastic recycling streams — never mix them with regular plastics.' },
    ],
  },
  {
    name: 'Plastic Bottle',
    emoji: '🍶',
    bin: 'recycle',
    hint: 'Look for the ♻ symbol and number.',
    correction: 'Clean #1 and #2 plastic bottles are widely recyclable — give it a rinse first!',
    facts: [
      { e: '🔢', t: 'Clean #1 (PET) and #2 (HDPE) bottles are accepted by most curbside recycling programs.' },
      { e: '💧', t: 'Food residue can contaminate an entire batch at the recycling facility — always rinse first.' },
    ],
  },
  {
    name: 'Compostable Box',
    emoji: '📦',
    bin: 'compost',
    hint: 'Look for the seedling certification label.',
    correction: 'Certified compostable packaging breaks down at commercial composters — not landfill.',
    facts: [
      { e: '🌱', t: 'ASTM D6400 certified packaging decomposes in commercial composters within 90 days.' },
      { e: '🏷️', t: '"Certified compostable" and "biodegradable" are NOT the same — only certified items belong in compost.' },
    ],
  },
  {
    name: 'Greasy Pizza Box',
    emoji: '🍕',
    bin: 'landfill',
    hint: 'Grease is the enemy of paper recycling.',
    correction: 'Grease and oil ruin paper fibres — the greasy box contaminates the whole recycling batch.',
    facts: [
      { e: '🛢️', t: 'Oil soaks into paper fibres and prevents bonding during recycling — the whole batch gets rejected.' },
      { e: '✂️', t: 'Pro tip: tear off the clean top flap to recycle it; the greasy bottom goes to landfill.' },
    ],
  },
  {
    name: 'Coffee Grounds',
    emoji: '🫘',
    bin: 'compost',
    hint: 'Organic material loves the pile!',
    correction: 'Coffee grounds are organic matter — perfect for compost, not landfill.',
    facts: [
      { e: '🌿', t: 'Coffee grounds are nitrogen-rich — they activate the compost pile and speed up decomposition.' },
      { e: '🐛', t: 'Worms love coffee grounds and process them into nutrient-dense castings for your garden.' },
    ],
  },
  {
    name: 'Foam Cup',
    emoji: '🥛',
    bin: 'landfill',
    hint: 'Almost no city recycles this material.',
    correction: 'Styrofoam (EPS) is rejected by almost all recyclers worldwide — it goes to landfill.',
    facts: [
      { e: '⏳', t: 'Styrofoam (EPS) takes 500+ years to break down — it just fragments into micro-plastics.' },
      { e: '🌿', t: 'Eco swap: bamboo or double-wall paper cups offer similar insulation with compostable end-of-life.' },
    ],
  },
  {
    name: 'Glass Jar',
    emoji: '🫙',
    bin: 'recycle',
    hint: 'Infinitely recyclable — no quality loss.',
    correction: 'Glass is infinitely recyclable without quality loss — always goes in recycling.',
    facts: [
      { e: '♾️', t: 'Glass can be recycled endlessly without any loss of purity or quality — unlike plastics.' },
      { e: '🏭', t: 'Making new glass from recycled cullet uses 30% less energy than raw sand and minerals.' },
    ],
  },
  {
    name: 'Bamboo Cup',
    emoji: '🍵',
    bin: 'compost',
    hint: 'A truly sustainable cup alternative!',
    correction: 'Uncoated bamboo cups are fully compostable — a certified sustainable choice.',
    facts: [
      { e: '🎋', t: 'Bamboo grows 3 feet per day without pesticides and sequesters more CO₂ than equivalent trees.' },
      { e: '♻️', t: 'Uncoated bamboo cups compost within 6 months — far better than any plastic alternative.' },
    ],
  },
]
