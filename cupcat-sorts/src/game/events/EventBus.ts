import Phaser from 'phaser'

export interface Fact {
  emoji: string
  text: string
}

type GameEvents = {
  'lives-changed': [lives: number]
  'round-changed': [roundIdx: number]
  'show-fact': [fact: Fact | null]
  'scene-ready': [scene: Phaser.Scene]
}

const emitter = new Phaser.Events.EventEmitter()

export const EventBus = {
  emit<K extends keyof GameEvents>(event: K, ...args: GameEvents[K]) {
    return emitter.emit(event, ...args)
  },

  on<K extends keyof GameEvents>(
    event: K,
    listener: (...args: GameEvents[K]) => void,
  ) {
    emitter.on(event, listener)
  },

  off<K extends keyof GameEvents>(
    event: K,
    listener: (...args: GameEvents[K]) => void,
  ) {
    emitter.off(event, listener)
  },
}
