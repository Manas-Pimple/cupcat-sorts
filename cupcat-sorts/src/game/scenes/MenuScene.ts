import Phaser from 'phaser'
import { EventBus } from '../events/EventBus'

const SKY   = 0x5ba3d8
const GRASS = 0x4caf50
const GRASS_DARK = 0x388e3c

export class MenuScene extends Phaser.Scene {
  private clouds: { con: Phaser.GameObjects.Container; speed: number }[] = []

  constructor() {
    super('MenuScene')
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height
    const HORIZON = H * 0.7

    // Background
    this.add.rectangle(0, 0, W, HORIZON, SKY).setOrigin(0)
    this.add.rectangle(0, HORIZON - 4, W, 8, GRASS_DARK).setOrigin(0)
    this.add.rectangle(0, HORIZON, W, H - HORIZON, GRASS).setOrigin(0)

    this.spawnClouds(W, HORIZON)

    // Cat (with bounce)
    const cat = this.add.text(W / 2, 148, '🐱', { fontSize: '72px' }).setOrigin(0.5)
    this.tweens.add({ targets: cat, y: 158, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })

    // Title
    this.add.text(W / 2, 252, '🌱 CupCat Sorts! 🌱', {
      fontSize: '32px',
      color: '#d4ff4d',
      fontStyle: 'bold',
      stroke: '#1a4a1a',
      strokeThickness: 4,
    }).setOrigin(0.5)

    // Subtitles
    this.add.text(W / 2, 304, 'Help the eco-cat sort cups into the right bins!', {
      fontSize: '14px', color: '#e8f5e9',
    }).setOrigin(0.5)
    this.add.text(W / 2, 326, 'Learn real facts about bioplastics & eco-friendly cups.', {
      fontSize: '13px', color: '#c8e6c9',
    }).setOrigin(0.5)

    // Info bar
    const infoG = this.add.graphics()
    infoG.fillStyle(0x000000, 0.35)
    infoG.fillRoundedRect(W / 2 - 190, 362, 380, 34, 10)
    this.add.text(W / 2, 379, '❤️❤️❤️  3 lives  ·  Sort wrong = Earth explodes 🌍', {
      fontSize: '12px', color: '#ffffff',
    }).setOrigin(0.5)

    // Start button
    this.makeButton(W / 2, HORIZON + 44, 260, 52, '🌿  Start Sorting!')

    EventBus.emit('scene-ready', this)
  }

  private makeButton(cx: number, cy: number, w: number, h: number, label: string) {
    const g = this.add.graphics()

    const draw = (color: number) => {
      g.clear()
      g.fillStyle(color)
      g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 14)
    }
    draw(0x4caf50)

    this.add.text(cx, cy, label, {
      fontSize: '20px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5)

    const hit = this.add.rectangle(cx, cy, w, h).setInteractive({ useHandCursor: true })
    hit.on('pointerover', () => draw(0x388e3c))
    hit.on('pointerout',  () => draw(0x4caf50))
    hit.on('pointerdown', () => {
      draw(0x2e7d32)
      this.time.delayedCall(120, () => this.scene.start('GameScene'))
    })
  }

  private spawnClouds(W: number, HORIZON: number) {
    const defs = [
      { x: 100, y: 82,  scale: 1.0, speed: 0.22 },
      { x: 320, y: 128, scale: 0.75, speed: 0.16 },
      { x: 460, y: 72,  scale: 0.6,  speed: 0.28 },
    ]
    this.clouds = defs.map(({ x, y, scale, speed }) => ({
      con: this.makeCloud(x, y, scale),
      speed,
      limit: W + 100,
    })) as { con: Phaser.GameObjects.Container; speed: number }[]
    void HORIZON
  }

  private makeCloud(x: number, y: number, scale: number) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.88)
    g.fillEllipse(0, 0, 72 * scale, 36 * scale)
    g.fillEllipse(-22 * scale, -13 * scale, 44 * scale, 30 * scale)
    g.fillEllipse(20 * scale, -10 * scale, 50 * scale, 28 * scale)
    return this.add.container(x, y, [g])
  }

  update() {
    for (const { con, speed } of this.clouds) {
      con.x += speed
      if (con.x > 580) con.x = -100
    }
  }
}
