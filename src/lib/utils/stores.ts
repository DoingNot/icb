import { writable, derived } from "svelte/store";
import type { ResetInfo } from "./types";

export const lives = writable(3)
export const lostLives = derived(lives, ($lives)  => 3 - $lives)
export const level = writable(1)
export const reset = writable<ResetInfo | undefined>(undefined)
