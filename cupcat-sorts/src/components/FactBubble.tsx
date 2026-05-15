import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { EventBus } from '../game/events/EventBus'

export function FactBubble() {
  const fact = useGameStore((s) => s.fact)
  const phase = useGameStore((s) => s.phase)
  const setFact = useGameStore((s) => s.setFact)

  useEffect(() => {
    EventBus.on('show-fact', setFact)
    return () => EventBus.off('show-fact', setFact)
  }, [setFact])

  if (phase !== 'playing' || !fact) return null

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-blue-600/90 text-white rounded-xl px-5 py-3 text-sm text-center pointer-events-none z-10 shadow-lg">
      {fact.emoji} {fact.text}
    </div>
  )
}
