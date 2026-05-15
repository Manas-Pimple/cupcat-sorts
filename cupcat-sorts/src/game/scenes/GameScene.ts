import Phaser from 'phaser'
import { BINS } from '../data/bins'
import { ROUNDS } from '../data/rounds'
import type { BinId, Round } from '../data/rounds'
import { EventBus } from '../events/EventBus'

const MAX_LIVES = 3 as const
const SKY       = 0x5ba3d8
const GRASS     = 0x4caf50
const GRASS_DARK = 0x388e3c
const HORIZON   = 445

const BIN_W = 140
const BIN_H = 150
const BIN_GAP = 10

export class GameScene extends Phaser.Scene {
  private lives = MAX_LIVES
  private roundIndex = 0
  private cat!: Phaser.GameObjects.Text
  private itemLabel!: Phaser.GameObjects.Text
  private hintText!: Phaser.GameObjects.Text
  private catTween!: Phaser.Tweens.Tween
  private clouds: { con: Phaser.GameObjects.Container; speed: number }[] = []

  constructor() {
    super('GameScene')
  }

  create() {
    this.lives = MAX_LIVES
    this.roundIndex = 0

    const W = this.scale.width

    // Sky + grass
    this.add.rectangle(0, 0, W, HORIZON, SKY).setOrigin(0)
    this.add.rectangle(0, HORIZON - 4, W, 8, GRASS_DARK).setOrigin(0)
    this.add.rectangle(0, HORIZON, W, this.scale.height - HORIZON, GRASS).setOrigin(0)

    this.spawnClouds(W)

    // Hint speech bubble (static bg, dynamic text)
    this.drawBubble(W / 2, 54, 350, 88)
    this.hintText = this.add.text(W / 2, 98, '', {
      fontSize: '13px',
      color: '#1a1a2e',
      wordWrap: { width: 318 },
      align: 'center',
    }).setOrigin(0.5)

    // Cat
    this.cat = this.add.text(W / 2, 292, '🐱', { fontSize: '56px' }).setOrigin(0.5)
    this.catTween = this.tweens.add({
      targets: this.cat, y: 302, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    })

    // Item label pill
    this.drawPill(W / 2, 364, 240, 36)
    this.itemLabel = this.add.text(W / 2, 382, '', {
      fontSize: '14px', color: '#1a1a2e', fontStyle: 'bold',
    }).setOrigin(0.5)

    this.buildBins(W)
    this.loadRound()

    EventBus.emit('scene-ready', this)
    EventBus.emit('lives-changed', this.lives)
  }

  // ---------- helpers ----------

  private drawBubble(cx: number, ty: number, w: number, h: number) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.96)
    g.lineStyle(1.5, 0xddddee)
    g.fillRoundedRect(cx - w / 2, ty, w, h, 12)
    g.strokeRoundedRect(cx - w / 2, ty, w, h, 12)
    // Arrow pointing down
    const ay = ty + h
    g.fillStyle(0xffffff, 0.96)
    g.fillTriangle(cx - 12, ay, cx + 12, ay, cx, ay + 16)
  }

  private drawPill(cx: number, ty: number, w: number, h: number) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.95)
    g.fillRoundedRect(cx - w / 2, ty, w, h, h / 2)
  }

  private buildBins(W: number) {
    const totalW = BINS.length * BIN_W + (BINS.length - 1) * BIN_GAP
    const startX = (W - totalW) / 2
    const binTop = HORIZON + 8

    BINS.forEach((bin, i) => {
      const bx = startX + i * (BIN_W + BIN_GAP)
      const cx = bx + BIN_W / 2

      // Card background
      const cardG = this.add.graphics()
      cardG.fillStyle(bin.color, 1)
      cardG.fillRoundedRect(bx, binTop, BIN_W, BIN_H, 14)

      // Slight top shine
      cardG.fillStyle(0xffffff, 0.1)
      cardG.fillRoundedRect(bx + 4, binTop + 4, BIN_W - 8, 50, 10)

      // Icon
      this.add.text(cx, binTop + 28, bin.icon, { fontSize: '28px' }).setOrigin(0.5)

      // Label
      this.add.text(cx, binTop + 68, bin.label, {
        fontSize: '14px', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5)

      // Description
      this.add.text(cx, binTop + 92, bin.description, {
        fontSize: '11px', color: '#c8e6ff', align: 'center',
      }).setOrigin(0.5, 0)

      // Hover overlay
      const overlay = this.add.graphics()

      // Hit area
      const hit = this.add.rectangle(bx, binTop, BIN_W, BIN_H)
        .setOrigin(0)
        .setInteractive({ useHandCursor: true })

      hit.on('pointerover', () => {
        overlay.fillStyle(0xffffff, 0.18)
        overlay.fillRoundedRect(bx, binTop, BIN_W, BIN_H, 14)
      })
      hit.on('pointerout', () => overlay.clear())
      hit.on('pointerdown', () => this.onBinClick(bin.id))
    })
  }

  private spawnClouds(W: number) {
    const defs = [
      { x: 80,  y: 80,  scale: 0.9,  speed: 0.2  },
      { x: 290, y: 122, scale: 0.7,  speed: 0.15 },
      { x: 450, y: 75,  scale: 0.55, speed: 0.25 },
    ]
    this.clouds = defs.map(({ x, y, scale, speed }) => ({
      con: this.makeCloud(x, y, scale),
      speed,
    }))
    void W
  }

  private makeCloud(x: number, y: number, scale: number) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.85)
    g.fillEllipse(0, 0, 70 * scale, 34 * scale)
    g.fillEllipse(-21 * scale, -12 * scale, 42 * scale, 28 * scale)
    g.fillEllipse(19 * scale, -10 * scale, 48 * scale, 26 * scale)
    return this.add.container(x, y, [g])
  }

  // ---------- game logic ----------

  private loadRound() {
    const round = ROUNDS[this.roundIndex]
    this.hintText.setText(round.hint)
    this.itemLabel.setText(`${round.emoji}  ${round.name}`)
    EventBus.emit('show-fact', null)
    EventBus.emit('round-changed', this.roundIndex)
  }

  private onBinClick(binId: BinId) {
    const round: Round = ROUNDS[this.roundIndex]

    if (binId === round.bin) {
      this.catTween.pause()
      this.cat.setText('😸')
      const fact = round.facts[0]
      EventBus.emit('show-fact', { emoji: fact.e, text: fact.t })

      this.time.delayedCall(2200, () => {
        this.cat.setText('🐱')
        this.catTween.resume()
        this.roundIndex++
        if (this.roundIndex >= ROUNDS.length) {
          this.scene.start('WinScene')
        } else {
          this.loadRound()
        }
      })
    } else {
      this.lives--
      this.catTween.pause()
      this.cat.setText('😿')
      this.cameras.main.shake(260, 0.014)
      EventBus.emit('lives-changed', this.lives)

      this.time.delayedCall(900, () => {
        this.cat.setText('🐱')
        this.catTween.resume()
        if (this.lives <= 0) this.scene.start('GameOverScene')
      })
    }
  }

  update() {
    for (const { con, speed } of this.clouds) {
      con.x += speed
      if (con.x > 580) con.x = -100
    }
  }
}
