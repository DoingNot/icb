import Matter from 'matter-js'
import { writable } from 'svelte/store';
// import { DEVICE_RATIO } from './utils';
// import { GAME_HEIGHT, GAME_WIDTH, BACKGROUND_COLOR } from '$lib/utils/constants';

export const engine: any = writable();
export const world: any = writable();
export const runner: any = writable();

export function Engine() {
    const matterEngine = Matter.Engine.create({
        gravity: {
            scale: 0.004
        }
    });
    const matterWorld = matterEngine.world;
    const matterRunner = Matter.Runner.create();

    // ENGINE RENDERED WIREFRAME FOR DEBUGGING/TESTING
    // const render = Matter.Render.create({
    //     element: document.body,
    //     engine: matterEngine,
    //     options: {
    //         width: GAME_WIDTH,
    //         height: GAME_HEIGHT,
    //         pixelRatio: DEVICE_RATIO,
    //         background: BACKGROUND_COLOR,
    //         wireframes: false
    //     }
    // });

    // Matter.Render.run(render)
 
    Matter.Runner.run(matterRunner, matterEngine)

    engine.set(matterEngine)
    world.set(matterWorld)
    runner.set(matterRunner)
}
