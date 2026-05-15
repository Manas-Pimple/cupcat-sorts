import Phaser from 'phaser'
import { EventBus } from '../events/EventBus'

export class WinScene extends Phaser.Scene {
  constructor() {
    super('WinScene')
  }

  create() {
    const { width, height } = this.scale

    this.add.rectangle(0, 0, width, height, 0x1b5e20).setOrigin(0)

    this.add
      .text(width / 2, height * 0.3, '🎉 You Win! 🎉', {
        fontSize: '42px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height * 0.48, 'CupCat saves the planet!', {
        fontSize: '22px',
        color: '#a5d6a7',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: this.add
        .text(width / 2, height * 0.56, '🌍', { fontSize: '64px' })
        .setOrigin(0.5),
      angle: 360,
      duration: 3000,
      repeat: -1,
    })

    const btn = this.add
      .text(width / 2, height * 0.75, 'Play Again', {
        fontSize: '26px',
        color: '#ffffff',
        backgroundColor: '#388e3c',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    btn.on('pointerdown', () => this.scene.start('MenuScene'))

    EventBus.emit('scene-ready', this)
  }
}
