import { useEffect } from 'react'
import PhaserGame from './game/PhaserGame'
import { HUD } from './components/HUD'
import { FactBubble } from './components/FactBubble'
import { useGameStore } from './store/useGameStore'
import { EventBus } from './game/events/EventBus'
import type { Phase } from './store/useGameStore'

const PHASE_MAP: Record<string, Phase> = {
  MenuScene: 'menu',
  GameScene: 'playing',
  WinScene: 'win',
  GameOverScene: 'gameover',
}

export default function App() {
  const setPhase = useGameStore((s) => s.setPhase)

  useEffect(() => {
    const onSceneReady = (scene: Phaser.Scene) =>
      setPhase(PHASE_MAP[scene.scene.key] ?? 'menu')

    EventBus.on('scene-ready', onSceneReady)
    return () => EventBus.off('scene-ready', onSceneReady)
  }, [setPhase])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <PhaserGame />
      <HUD />
      <FactBubble />
    </div>
  )
}
