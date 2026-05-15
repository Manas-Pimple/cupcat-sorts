import type { BinId } from './rounds'

export interface Bin {
  id: BinId
  label: string
  icon: string
  description: string
  color: number
}

export const BINS: Bin[] = [
  {
    id: 'recycle',
    label: 'Recycle',
    icon: '♻️',
    description: 'Clean paper,\nglass, plastics',
    color: 0x1565c0,
  },
  {
    id: 'compost',
    label: 'Compost',
    icon: '🌿',
    description: 'Food waste &\ncompostables',
    color: 0x2e7d32,
  },
  {
    id: 'landfill',
    label: 'Landfill',
    icon: '🗑️',
    description: 'Non-recyclable\nwaste',
    color: 0x455a64,
  },
]
