import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/useGameStore'
import { ROUNDS } from '../game/data/rounds'
import { EventBus } from '../game/events/EventBus'

export function HUD() {
  const lives    = useGameStore((s) => s.lives)
  const round    = useGameStore((s) => s.round)
  const phase    = useGameStore((s) => s.phase)
  const setLives = useGameStore((s) => s.setLives)
  const setRound = useGameStore((s) => s.setRound)
  const total    = ROUNDS.length

  const livesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    EventBus.on('lives-changed', setLives)
    EventBus.on('round-changed', setRound)
    return () => {
      EventBus.off('lives-changed', setLives)
      EventBus.off('round-changed', setRound)
    }
  }, [setLives, setRound])

  // Pulse animation on life loss
  useEffect(() => {
    const el = livesRef.current
    if (!el) return
    el.classList.remove('hud-pulse')
    void el.offsetWidth  // reflow to restart animation
    el.classList.add('hud-pulse')
  }, [lives])

  if (phase !== 'playing') return null

  return (
    <div className="absolute top-0 inset-x-0 flex items-center px-3 py-2 bg-black/55 backdrop-blur-sm pointer-events-none z-10">
      {/* Lives */}
      <div ref={livesRef} className="text-lg tracking-wide w-28 shrink-0 select-none">
        {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
      </div>

      {/* Title */}
      <div className="flex-1 text-center text-sm font-bold text-white tracking-wide drop-shadow">
        🌿 CupCat Sorts!
      </div>

      {/* Round progress */}
      <div className="w-28 shrink-0 flex flex-col items-end gap-1">
        <span className="text-white text-xs font-semibold opacity-90">
          Round {round + 1} / {total}
        </span>
        <div className="flex gap-1">
          {ROUNDS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === round ? 10 : 8,
                height:     i === round ? 10 : 8,
                background: i < round ? '#4caf50' : i === round ? '#fff' : 'rgba(255,255,255,0.3)',
                boxShadow:  i === round ? '0 0 6px #fff' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
