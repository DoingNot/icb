import { createApp } from 'pixi-svelte';

export const {
	loadingProgress,
	loaded,
	loadedAssets,
	canvasSizes,
	pixiApplication,
	onRender,
	rendered,
	reset,
} = createApp<object>();
