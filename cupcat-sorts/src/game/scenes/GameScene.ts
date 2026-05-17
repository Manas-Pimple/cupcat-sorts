import Phaser from 'phaser'
import { BINS } from '../data/bins'
import { ROUNDS } from '../data/rounds'
import type { BinId, Round } from '../data/rounds'
import { EventBus } from '../events/EventBus'

const MAX_LIVES = 3 as const

export class GameScene extends Phaser.Scene {
  private lives = MAX_LIVES
  private roundIndex = 0
  private isResolvingRound = false

  private cat!: Phaser.GameObjects.Text
  private catTween!: Phaser.Tweens.Tween
  private hintText!: Phaser.GameObjects.Text
  private itemLabel!: Phaser.GameObjects.Text

  private clouds: { con: Phaser.GameObjects.Container; speed: number }[] = []
  private cloudWrapX = 0

  constructor() {
    super('GameScene')
  }

  create() {
    this.lives = MAX_LIVES
    this.roundIndex = 0
    this.isResolvingRound = false

    const W = this.scale.width
    const H = this.scale.height
    this.cloudWrapX = W + 100

    const HORIZON = Math.round(H * 0.695)
    const BIN_H   = Math.round(H * 0.234)
    const BIN_W   = Math.round((W - 24) / 3) - 8
    const BIN_GAP  = 8

    // Background
    this.add.rectangle(0, 0, W, HORIZON, 0x5ba3d8).setOrigin(0)
    this.add.rectangle(0, HORIZON - 4, W, 8, 0x388e3c).setOrigin(0)
    this.add.rectangle(0, HORIZON, W, H - HORIZON, 0x4caf50).setOrigin(0)

    this.spawnClouds(W, H)

    // Hint bubble
    const bubTop = H * 0.052
    const bubH   = H * 0.10
    const bubW   = W * 0.55
    this.drawStaticBubble(W / 2, bubTop, bubW, bubH)
    this.hintText = this.add.text(W / 2, bubTop + bubH * 0.50, '', {
      fontSize: `${Math.round(H * 0.020)}px`,
      color: '#1a1a2e',
      wordWrap: { width: bubW * 0.86 },
      align: 'center',
    }).setOrigin(0.5)

    // Cat
    const catY = H * 0.395
    this.cat = this.add.text(W / 2, catY, '🐱', {
      fontSize: `${Math.round(H * 0.13)}px`,
    }).setOrigin(0.5)
    this.catTween = this.tweens.add({
      targets: this.cat,
      y: catY + H * 0.018,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Item label pill
    const pillTop = H * 0.555
    const pillH   = Math.round(H * 0.056)
    const pillW   = W * 0.54
    this.drawPill(W / 2, pillTop, pillW, pillH)
    this.itemLabel = this.add.text(W / 2, pillTop + pillH / 2, '', {
      fontSize: `${Math.round(H * 0.022)}px`, color: '#1a1a2e', fontStyle: 'bold',
    }).setOrigin(0.5)

    this.buildBins(W, H, HORIZON, BIN_W, BIN_H, BIN_GAP)
    this.loadRound()

    EventBus.emit('scene-ready', this)
    EventBus.emit('lives-changed', this.lives)
  }

  // ─── Drawing helpers ────────────────────────────────────────────────────────

  private drawStaticBubble(cx: number, ty: number, w: number, h: number) {
    const r = 14
    const g = this.add.graphics()

    // Drop shadow
    g.fillStyle(0x000000, 0.12)
    g.fillRoundedRect(cx - w / 2 + 3, ty + 4, w, h, r)

    // Fill
    g.fillStyle(0xffffff, 0.97)
    g.fillRoundedRect(cx - w / 2, ty, w, h, r)

    // Subtle gradient top shine
    g.fillStyle(0xffffff, 0.30)
    g.fillRoundedRect(cx - w / 2 + 6, ty + 5, w - 12, h * 0.38, r - 4)

    // Border
    g.lineStyle(1.5, 0xb0c8e8, 0.7)
    g.strokeRoundedRect(cx - w / 2, ty, w, h, r)

    // Tail arrow
    const ay = ty + h
    g.fillStyle(0xffffff, 0.97)
    g.fillTriangle(cx - 10, ay, cx + 10, ay, cx, ay + 12)
    g.lineStyle(1.5, 0xb0c8e8, 0.7)
    g.lineBetween(cx - 10, ay, cx, ay + 12)
    g.lineBetween(cx, ay + 12, cx + 10, ay)
  }

  private drawPill(cx: number, ty: number, w: number, h: number) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.95)
    g.fillRoundedRect(cx - w / 2, ty, w, h, h / 2)
  }

  // ─── Bins ───────────────────────────────────────────────────────────────────

  private buildBins(W: number, H: number, HORIZON: number, BIN_W: number, BIN_H: number, BIN_GAP: number) {
    const totalW = BINS.length * BIN_W + (BINS.length - 1) * BIN_GAP
    const startX = (W - totalW) / 2
    const binTop = HORIZON + 8

    const iconSz  = `${Math.round(H * 0.048)}px`
    const labelSz = `${Math.round(H * 0.024)}px`
    const descSz  = `${Math.round(H * 0.018)}px`

    BINS.forEach((bin, i) => {
      const bx = startX + i * (BIN_W + BIN_GAP)
      const cx = bx + BIN_W / 2

      const cardG = this.add.graphics()
      cardG.fillStyle(bin.color, 1)
      cardG.fillRoundedRect(bx, binTop, BIN_W, BIN_H, 14)
      cardG.fillStyle(0xffffff, 0.1)
      cardG.fillRoundedRect(bx + 4, binTop + 4, BIN_W - 8, BIN_H * 0.28, 10)

      this.add.text(cx, binTop + BIN_H * 0.20, bin.icon,  { fontSize: iconSz }).setOrigin(0.5)
      this.add.text(cx, binTop + BIN_H * 0.50, bin.label, {
        fontSize: labelSz, color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5)
      this.add.text(cx, binTop + BIN_H * 0.66, bin.description, {
        fontSize: descSz, color: '#c8e6ff', align: 'center',
      }).setOrigin(0.5, 0)

      const overlay = this.add.graphics()
      const hit = this.add.rectangle(bx, binTop, BIN_W, BIN_H)
        .setOrigin(0)
        .setInteractive({ useHandCursor: true })

      hit.on('pointerover', () => {
        overlay.fillStyle(0xffffff, 0.18)
        overlay.fillRoundedRect(bx, binTop, BIN_W, BIN_H, 14)
      })
      hit.on('pointerout',  () => overlay.clear())
      hit.on('pointerdown', () => this.onBinClick(bin.id))
    })
  }

  // ─── Clouds ─────────────────────────────────────────────────────────────────

  private spawnClouds(W: number, H: number) {
    const skyH = H * 0.42
    const defs = [
      { x: W * 0.14, y: skyH * 0.22, scale: 0.9,  speed: 0.30 },
      { x: W * 0.55, y: skyH * 0.36, scale: 0.7,  speed: 0.22 },
      { x: W * 0.88, y: skyH * 0.20, scale: 0.55, speed: 0.38 },
    ]
    this.clouds = defs.map(({ x, y, scale, speed }) => ({
      con: this.makeCloud(x, y, scale),
      speed,
    }))
  }

  private makeCloud(x: number, y: number, scale: number) {
    const g = this.add.graphics()
    g.fillStyle(0xffffff, 0.82)
    g.fillEllipse(0, 0, 70 * scale, 34 * scale)
    g.fillEllipse(-21 * scale, -12 * scale, 42 * scale, 28 * scale)
    g.fillEllipse(19 * scale, -10 * scale, 48 * scale, 26 * scale)
    return this.add.container(x, y, [g])
  }

  // ─── Game logic ─────────────────────────────────────────────────────────────

  private loadRound() {
    const round = ROUNDS[this.roundIndex]
    this.hintText.setText(round.hint)
    this.itemLabel.setText(`${round.emoji}  ${round.name}`)
    EventBus.emit('show-fact', null)
    EventBus.emit('round-changed', this.roundIndex)
  }

  private onBinClick(binId: BinId) {
    if (this.isResolvingRound) return
    this.isResolvingRound = true

    const round: Round = ROUNDS[this.roundIndex]

    if (binId === round.bin) {
      this.catTween.pause()
      this.cat.setText('😸')
      const fact = round.facts[0]
      EventBus.emit('show-fact', { emoji: fact.e, text: fact.t, type: 'fact' })

      this.time.delayedCall(2400, () => {
        this.cat.setText('🐱')
        this.catTween.resume()
        this.roundIndex++
        if (this.roundIndex >= ROUNDS.length) {
          this.scene.start('WinScene')
        } else {
          this.loadRound()
          this.isResolvingRound = false
        }
      })
    } else {
      this.lives--
      this.catTween.pause()
      this.cat.setText('😿')
      this.cameras.main.shake(260, 0.014)
      EventBus.emit('lives-changed', this.lives)

      const correctBin = BINS.find(b => b.id === round.bin)
      EventBus.emit('show-fact', {
        emoji: correctBin?.icon ?? '♻️',
        text: round.correction,
        type: 'correction',
      })

      this.time.delayedCall(950, () => {
        this.cat.setText('🐱')
        this.catTween.resume()
        if (this.lives <= 0) {
          this.scene.start('GameOverScene')
        } else {
          this.isResolvingRound = false
        }
      })
    }
  }

  update() {
    for (const { con, speed } of this.clouds) {
      con.x += speed
      if (con.x > this.cloudWrapX) con.x = -100
    }
  }
}
