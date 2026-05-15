import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { buildConfig } from './config'

export default function PhaserGame() {
  const ref = useRef<HTMLDivElement>(null)
  const game = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (game.current || !ref.current) return
    game.current = new Phaser.Game({ ...buildConfig(), parent: ref.current })

    return () => {
      game.current?.destroy(true)
      game.current = null
    }
  }, [])

  return <div ref={ref} className="w-full h-full" />
}
