import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { ROUNDS } from '../game/data/rounds'
import { EventBus } from '../game/events/EventBus'

export function HUD() {
  const lives = useGameStore((s) => s.lives)
  const round = useGameStore((s) => s.round)
  const phase = useGameStore((s) => s.phase)
  const setLives = useGameStore((s) => s.setLives)
  const setRound = useGameStore((s) => s.setRound)
  const total = ROUNDS.length

  useEffect(() => {
    EventBus.on('lives-changed', setLives)
    EventBus.on('round-changed', setRound)
    return () => {
      EventBus.off('lives-changed', setLives)
      EventBus.off('round-changed', setRound)
    }
  }, [setLives, setRound])

  if (phase !== 'playing') return null

  return (
    <div className="absolute top-0 inset-x-0 flex items-center px-3 py-1.5 bg-black/50 pointer-events-none z-10">
      {/* Lives */}
      <div className="text-xl tracking-wide w-28 shrink-0">
        {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
      </div>

      {/* Title */}
      <div className="flex-1 text-center text-sm font-bold text-white">
        🌿 CupCat Sorts!
      </div>

      {/* Round + dots */}
      <div className="w-28 shrink-0 flex flex-col items-end gap-0.5">
        <span className="text-white text-xs font-bold">Round {round + 1} / {total}</span>
        <div className="flex gap-1">
          {ROUNDS.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: i < round ? '#4caf50' : i === round ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
