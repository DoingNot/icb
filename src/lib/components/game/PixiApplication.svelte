<script lang="ts">
    import * as PIXI from 'pixi.js';

    import { DEVICE_RATIO } from '$lib/utils/game/utils';

    let { children }: any = $props();

    function createApp() {
        let pixiApplication = $state(new PIXI.Application<HTMLCanvasElement>({
        backgroundAlpha: 1,
        autoDensity: true,
        resolution: DEVICE_RATIO,
        antialias: true,
        width: 400,
        height: 700,
        }))

        globalThis.__PIXI_APP__ = pixiApplication;

        // to prevent that you can't scroll the page with touch on the canvas. https://github.com/pixijs/pixijs/issues/4824
        pixiApplication.renderer.events.autoPreventDefault = false;
        pixiApplication.renderer.view.style.touchAction = 'auto';

        document.body.appendChild(pixiApplication.view)

        return {
            get pixiApplication() { return pixiApplication },
        };

    }

  export const app = createApp();
</script>

{#if app.pixiApplication}
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
