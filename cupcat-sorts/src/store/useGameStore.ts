import { create } from 'zustand'
import type { Fact } from '../game/events/EventBus'

export type Phase = 'menu' | 'playing' | 'win' | 'gameover'

interface GameState {
  lives: number
  round: number
  phase: Phase
  fact: Fact | null
  setLives: (lives: number) => void
  setRound: (round: number) => void
  setPhase: (phase: Phase) => void
  setFact: (fact: Fact | null) => void
}

export const useGameStore = create<GameState>((set) => ({
  lives: 3,
  round: 0,
  phase: 'menu',
  fact: null,
  setLives: (lives) => set({ lives }),
  setRound: (round) => set({ round }),
  setPhase: (phase) => set({ phase }),
  setFact: (fact) => set({ fact }),
}))
