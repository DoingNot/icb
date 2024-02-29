<script lang="ts">
	import { onMount } from 'svelte';
	import * as PIXI from 'pixi.js';
	
	import { DEVICE_RATIO, detectWebGL, preloadFont } from '../utils';
	import { getAppContext, createParentContext } from '../context';
	import type { BaseEvent } from '../types';

	const { pixiApplication: pixiApplicationStore } = getAppContext<BaseEvent>();

	let canvas: HTMLCanvasElement;
	let pixiApplication: PIXI.Application;

	const parent = createParentContext();

	onMount(() => {
		PIXI.utils.clearTextureCache();
		PIXI.Assets.reset();
		PIXI.Filter.defaultResolution = DEVICE_RATIO;

		const webglResult = detectWebGL();

		pixiApplication = new PIXI.Application({
			backgroundAlpha: 0,
			autoDensity: true,
			resolution: DEVICE_RATIO,
			view: canvas,
			antialias: true, // iOS 15.4 is not happy with it. https://github.com/pixijs/pixijs/issues/8183
			forceCanvas: webglResult !== 1,
			width: 0,
			height: 0,
		});

		// For PixiJs dev tool
		// globalThis.__PIXI_APP__ = pixiApplication;

		// to prevent that you can't scroll the page with touch on the canvas. https://github.com/pixijs/pixijs/issues/4824
		pixiApplication.renderer.events.autoPreventDefault = false;
		pixiApplication.renderer.view.style.touchAction = 'auto';

		preloadFont().then(() => {
			pixiApplicationStore.set(pixiApplication);
			parent.set(pixiApplication.stage);
		});

		pixiApplication.ticker.maxFPS = 59.9;
		pixiApplication.ticker.minFPS = 57;

		return () => {
			pixiApplication.destroy();
		};
	});
</script>

<canvas data-test="pixi-canvas" bind:this={canvas} />
{#if $pixiApplicationStore && $parent}
	<slot />
{/if}

<style lang="scss">
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
</style>
