import Matter from 'matter-js'
import { writable } from 'svelte/store';
import { DEVICE_RATIO } from './utils';
import { GAME_HEIGHT, GAME_WIDTH } from '$lib/components/game/constants';

export const engine: any = writable()
export const world: any = writable()

export function Engine() {
    const matterEngine = Matter.Engine.create();
    const matterWorld = matterEngine.world;

    const render = Matter.Render.create({
        element: document.body,
        engine: matterEngine,
        options: {
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            pixelRatio: DEVICE_RATIO,
            background: '#D0AE2D',
            wireframes: false
        }
    });

    Matter.Render.run(render)
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, matterEngine)

    Matter.Events.on(matterEngine, 'collisionStart', (event) => {
        // console.log('Collision detected!', event);
    });

    engine.set(matterEngine)
    world.set(matterWorld)
}
