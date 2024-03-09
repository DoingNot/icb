import { writable } from "svelte/store";

export const lives = writable(3)
export const level = writable(1)
export const reset = writable(false)
