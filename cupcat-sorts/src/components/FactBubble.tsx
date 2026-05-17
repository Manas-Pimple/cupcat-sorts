import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { EventBus } from '../game/events/EventBus'

export function FactBubble() {
  const fact    = useGameStore((s) => s.fact)
  const phase   = useGameStore((s) => s.phase)
  const setFact = useGameStore((s) => s.setFact)

  useEffect(() => {
    EventBus.on('show-fact', setFact)
    return () => EventBus.off('show-fact', setFact)
  }, [setFact])

  if (phase !== 'playing' || !fact) return null

  return <FactBubbleInner key={fact.text} emoji={fact.emoji} text={fact.text} isCorrection={fact.type === 'correction'} />
}

function FactBubbleInner({ emoji, text, isCorrection }: { emoji: string; text: string; isCorrection: boolean }) {
  const colorCls = isCorrection
    ? 'bg-amber-600/92 border border-amber-400/40'
    : 'bg-blue-600/92 border border-blue-400/30'

  return (
    <div className={`fact-bubble absolute bottom-5 left-1/2 w-[92%] max-w-md rounded-2xl px-5 py-3 shadow-xl pointer-events-none z-10 text-sm text-center text-white leading-snug ${colorCls}`}>
      <span className="mr-1.5 text-base">{emoji}</span>
      {isCorrection && <span className="font-bold mr-1">Hint: </span>}
      {text}
    </div>
  )
}
