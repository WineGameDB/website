export enum GameStatus {
  NotWorking,
  WorksOOTB,
  WorksWithFixes,
  MainContentAccessible,
  Unknown,
}

export type Storefront = 'Epic' | 'GOG'

export type GameTuple = [
  id: number,
  internal_name: string,
  title: string,
  store: Storefront,
  status: GameStatus
]

export interface Game {
  id: number
  internal_name: string
  title: string
  store: Storefront
  status: GameStatus
}
