import Phaser from 'phaser'
import { EventBus } from '../events/EventBus'

export class MenuScene extends Phaser.Scene {
  private clouds: { con: Phaser.GameObjects.Container; speed: number }[] = []
  private cloudWrapX = 0

  constructor() {
    super('MenuScene')
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height
    const HORIZON = H * 0.7
    this.cloudWrapX = W + 100

    // Background
    this.add.rectangle(0, 0, W, HORIZON, 0x5ba3d8).setOrigin(0)
    this.add.rectangle(0, HORIZON - 4, W, 8, 0x388e3c).setOrigin(0)
    this.add.rectangle(0, HORIZON, W, H - HORIZON, 0x4caf50).setOrigin(0)

    this.spawnClouds(W, H)

    // Cat
    const catY = H * 0.22
    const cat = this.add.text(W / 2, catY, '🐱', {
      fontSize: `${Math.round(H * 0.115)}px`,
    }).setOrigin(0.5)
    this.tweens.add({ targets: cat, y: catY + H * 0.018, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })

    // Title
    this.add.text(W / 2, H * 0.39, 'CupCat Sorts!', {
      fontSize: `${Math.round(H * 0.052)}px`,
      color: '#d4ff4d',
      fontStyle: 'bold',
      stroke: '#1a4a1a',
      strokeThickness: 4,
    }).setOrigin(0.5)

    // Subtitles
    this.add.text(W / 2, H * 0.47, 'Help the eco-cat sort cups into the right bins!', {
      fontSize: `${Math.round(H * 0.022)}px`, color: '#e8f5e9',
    }).setOrigin(0.5)
    this.add.text(W / 2, H * 0.505, 'Learn real facts about bioplastics & eco-friendly cups.', {
      fontSize: `${Math.round(H * 0.020)}px`, color: '#c8e6c9',
    }).setOrigin(0.5)

    // Info bar
    const infoBarW = W * 0.82
    const infoBarH = Math.round(H * 0.053)
    const infoY = H * 0.56
    const infoG = this.add.graphics()
    infoG.fillStyle(0x000000, 0.35)
    infoG.fillRoundedRect(W / 2 - infoBarW / 2, infoY, infoBarW, infoBarH, 10)
    this.add.text(W / 2, infoY + infoBarH / 2, '3 lives  ·  Sort wrong = Earth explodes', {
      fontSize: `${Math.round(H * 0.019)}px`, color: '#ffffff',
    }).setOrigin(0.5)

    // Start button
    this.makeButton(W / 2, HORIZON + H * 0.07, W * 0.56, H * 0.082, 'Start Sorting!')

    EventBus.emit('scene-ready', this)
  }

  private makeButton(cx: number, cy: number, w: number, h: number, label: string) {
    const g = this.add.graphics()
    const fontSize = Math.round(h * 0.38)

    const draw = (color: number) => {
      g.clear()
      g.fillStyle(color)
      g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 14)
    }
    draw(0x4caf50)

    this.add.text(cx, cy, label, {
      fontSize: `${fontSize}px`, color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5)

    const hit = this.add.rectangle(cx, cy, w, h).setInteractive({ useHandCursor: true })
    hit.on('pointerover', () => draw(0x388e3c))
    hit.on('pointerout',  () => draw(0x4caf50))
    hit.on('pointerdown', () => {
      draw(0x2e7d32)
      this.time.delayedCall(120, () => this.scene.start('GameScene'))
    })
  }

  private spawnClouds(W: number, H: number) {
    const skyH = H * 0.42
    const defs = [
      { x: W * 0.18, y: skyH * 0.22, scale: 1.0,  speed: 0.22 },
      { x: W * 0.60, y: skyH * 0.36, scale: 0.75, speed: 0.16 },
      { x: W * 0.90, y: skyH * 0.20, scale: 0.6,  speed: 0.28 },
    ]
    this.clouds = defs.map(({ x, y, scale, speed }) => ({
      con: this.makeCloud(x, y, scale),
      speed,
    }))
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
      if (con.x > this.cloudWrapX) con.x = -100
    }
  }
}
