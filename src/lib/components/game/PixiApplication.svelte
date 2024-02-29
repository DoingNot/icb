<script lang="ts">
	import { onMount } from 'svelte';
	import * as PIXI from 'pixi.js';
	
  import { DEVICE_RATIO } from '$lib/utils/game/utils';

  let { children }: any = $props();
	let pixiApplication: any = $state();


	onMount(() => {
		pixiApplication = new PIXI.Application<HTMLCanvasElement>({
			backgroundAlpha: 1,
			autoDensity: true,
			resolution: DEVICE_RATIO,
			antialias: true,
			width: 400,
			height: 700,
		});

		globalThis.__PIXI_APP__ = pixiApplication;

		// to prevent that you can't scroll the page with touch on the canvas. https://github.com/pixijs/pixijs/issues/4824
		pixiApplication.renderer.events.autoPreventDefault = false;
		pixiApplication.renderer.view.style.touchAction = 'auto';

    document.body.appendChild(pixiApplication.view)

		return () => {
			pixiApplication.destroy();
		};
	});
</script>

{#if pixiApplication}
    {@render children()}
{/if}

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
</style>
