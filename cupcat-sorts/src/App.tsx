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
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      {/* CSS containment: fills screen while keeping 3∶4 aspect ratio — no letterbox distortion */}
      <div
        className="relative overflow-hidden"
        style={{
          width:  'min(100vw, 75vh)',
          height: 'min(100vh, calc(100vw * 4 / 3))',
        }}
      >
        <PhaserGame />
        <HUD />
        <FactBubble />
      </div>
    </div>
  )
}
