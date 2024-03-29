import * as PIXI from 'pixi.js';
import { writable, type Writable } from 'svelte/store';
import { DEVICE_RATIO } from '$lib/utils/utils';
import { ASSETS_DATA, GAME_HEIGHT, GAME_WIDTH, BACKGROUND_COLOR } from '$lib/utils/constants';

export const pixiApplication: any = writable()
export const loadedAssets: any = writable([]);
export const loaded = writable(false);

export function App() {

    const app = new PIXI.Application<HTMLCanvasElement>({
        backgroundAlpha: 1,
        backgroundColor: BACKGROUND_COLOR,
        autoDensity: true,
        resolution: DEVICE_RATIO,
        antialias: true,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
    })

    globalThis.__PIXI_APP__ = app;

    ASSETS_DATA.forEach((asset) => PIXI.Assets.add({ alias: asset.alias, src: asset.src }));
    const assetTextures = PIXI.Assets.load(ASSETS_DATA.map((asset) => asset.alias))
    assetTextures.then((r) => {
        loadedAssets.set(r);
        loaded.set(true);
    });

    // to prevent that you can't scroll the page with touch on the canvas. https://github.com/pixijs/pixijs/issues/4824
    app.renderer.events.autoPreventDefault = true;
    app.renderer.view.style.touchAction = 'disabled';
    app.stage.sortableChildren = true;

    document.body.appendChild(app.view)
    pixiApplication.set(app)

    return () => {
        app.destroy();
    };
}
