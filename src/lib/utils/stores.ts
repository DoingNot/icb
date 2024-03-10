import * as PIXI from 'pixi.js';
import { writable, derived } from "svelte/store";
import { type GameLevel, type HoleInfo } from "./types";

export const holesContainer = writable(new PIXI.Container())
export const lives = writable(3)
export const lostLives = derived(lives, ($lives)  => 3 - $lives)
export const level = writable(1)
export const win = writable<HoleInfo | undefined>(undefined)
export const reset = writable<HoleInfo | undefined>(undefined)
export const difficulty = writable(0)

export const config = writable<GameLevel>({ winHoles: [], loseHoles: []})
export const resetBoard = writable(false)
