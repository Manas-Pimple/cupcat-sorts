import Phaser from 'phaser'
import { EventBus } from '../events/EventBus'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene')
  }

  create() {
    const { width, height } = this.scale

    this.add.rectangle(0, 0, width, height, 0x1a0000).setOrigin(0)

    const earth = this.add
      .text(width / 2, height * 0.35, '🌍', { fontSize: '80px' })
      .setOrigin(0.5)

    this.tweens.add({
      targets: earth,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 1200,
      ease: 'Power2',
      delay: 400,
    })

    this.add
      .text(width / 2, height * 0.55, 'GAME OVER', {
        fontSize: '44px',
        color: '#ff5252',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height * 0.64, 'CupCat could not save the planet 😿', {
        fontSize: '18px',
        color: '#ef9a9a',
      })
      .setOrigin(0.5)

    const btn = this.add
      .text(width / 2, height * 0.78, 'Try Again', {
        fontSize: '26px',
        color: '#ffffff',
        backgroundColor: '#b71c1c',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    btn.on('pointerdown', () => this.scene.start('MenuScene'))

    EventBus.emit('scene-ready', this)
  }
}
