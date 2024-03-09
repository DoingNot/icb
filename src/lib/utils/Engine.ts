import Matter from 'matter-js'
import { writable } from 'svelte/store';
import { DEVICE_RATIO } from './utils';
import { GAME_HEIGHT, GAME_WIDTH, BACKGROUND_COLOR } from '$lib/utils/constants';
import { lives, reset, level } from './stores';

export const engine: any = writable();
export const world: any = writable();

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
            background: BACKGROUND_COLOR,
            wireframes: false
        }
    });

    Matter.Render.run(render)
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, matterEngine)

    Matter.Events.on(matterEngine, 'collisionStart', (event) => {
        for(const pair of event.pairs) {
            const isLoseHole = (pair.bodyA.label === 'Ball' && ['loseHole', 'center'].every((s) => pair.bodyB.label.includes(s))) ||
                               (pair.bodyB.label === 'Ball' && ['loseHole', 'center'].every((s) => pair.bodyA.label.includes(s)))
            if(isLoseHole) {
                console.log(pair.bodyA.label, pair.bodyB.label)
                lives.set(2)
                reset.set(true)
            }
        }
    });

    engine.set(matterEngine)
    world.set(matterWorld)
}
