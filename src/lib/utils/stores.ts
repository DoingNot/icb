import { writable, derived } from "svelte/store";
import { type GameLevel, type HoleInfo } from "./types";
import { DEFAULT_KEY_LEFT_DOWN, DEFAULT_KEY_LEFT_UP, DEFAULT_KEY_RIGHT_DOWN, DEFAULT_KEY_RIGHT_UP } from './constants';

export const leftUpKey = writable(DEFAULT_KEY_LEFT_UP)
export const leftDownKey = writable(DEFAULT_KEY_LEFT_DOWN)
export const rightUpKey = writable(DEFAULT_KEY_RIGHT_UP)
export const rightDownKey = writable(DEFAULT_KEY_RIGHT_DOWN)
export const lives = writable(3)
export const lostLives = derived(lives, ($lives)  => 3 - $lives)
export const level = writable(1)
export const win = writable<HoleInfo | undefined>(undefined)
export const reset = writable<HoleInfo | undefined>(undefined)
export const gameWon = writable(false)
export const difficulty = writable(0)
export const config = writable<GameLevel>({ winHoles: [], loseHoles: []})
export const resetBoard = writable(false)
