export type BinId = 'recycle' | 'compost' | 'landfill'

export interface Round {
  name: string
  emoji: string
  bin: BinId
  hint: string
  facts: { e: string; t: string }[]
}

export const ROUNDS: Round[] = [
  {
    name: 'Paper Cup',
    emoji: '☕',
    bin: 'landfill',
    hint: 'Check the lining — it matters!',
    facts: [
      { e: '🧪', t: 'Paper cups have a thin plastic lining that makes them non-recyclable.' },
      { e: '♻️', t: 'Some cities accept them at special drop-offs — check locally.' },
    ],
  },
  {
    name: 'Plastic Bottle',
    emoji: '🍶',
    bin: 'recycle',
    hint: 'Look for the ♻ symbol and number.',
    facts: [
      { e: '🔢', t: 'Clean #1 (PET) and #2 (HDPE) bottles are widely recyclable.' },
      { e: '💧', t: 'Rinse before recycling — food residue contaminates whole batches.' },
    ],
  },
  {
    name: 'Coffee Grounds',
    emoji: '🫘',
    bin: 'compost',
    hint: 'Organic material loves the pile!',
    facts: [
      { e: '🌱', t: 'Coffee grounds are nitrogen-rich — perfect compost activator.' },
      { e: '🐛', t: 'Worms love coffee grounds and help break them down fast.' },
    ],
  },
]
