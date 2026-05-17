import Phaser from 'phaser'
import { MenuScene } from './scenes/MenuScene'
import { GameScene } from './scenes/GameScene'
import { WinScene } from './scenes/WinScene'
import { GameOverScene } from './scenes/GameOverScene'

export function buildConfig(): Omit<Phaser.Types.Core.GameConfig, 'parent'> {
  return {
    type: Phaser.AUTO,
    backgroundColor: '#0d0d1a',
    scene: [MenuScene, GameScene, WinScene, GameOverScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  }
}
