import * as PIXI from 'pixi.js';
import { writable } from 'svelte/store';
import { DEVICE_RATIO } from '$lib/utils/game/utils';

export const pixiApplication: any = writable()

export function createApp() {

    const app = new PIXI.Application<HTMLCanvasElement>({
        backgroundAlpha: 1,
        backgroundColor: 0x21252A,
        autoDensity: true,
        resolution: DEVICE_RATIO,
        antialias: true,
        width: 400,
        height: 700,
    })

    globalThis.__PIXI_APP__ = app;

    // to prevent that you can't scroll the page with touch on the canvas. https://github.com/pixijs/pixijs/issues/4824
    app.renderer.events.autoPreventDefault = false;
    app.renderer.view.style.touchAction = 'auto';

    document.body.appendChild(app.view)
    pixiApplication.set(app)

    return () => {
        app.destroy();
    };
}

