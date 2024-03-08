import Matter from 'matter-js'
import { writable } from 'svelte/store';

export const engine: any = writable()
export const world: any = writable()

export function createEngine() {
    const matterEngine = Matter.Engine.create();
    const matterWorld = matterEngine.world;

    const render = Matter.Render.create({
        element: document.body,
        engine: matterEngine
    });

    Matter.Render.run(render)
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, matterEngine)

    Matter.Events.on(engine, 'collisionStart', (event) => {
        console.log('Collision detected!');
    });

    engine.set(matterEngine)
    world.set(matterWorld)
}
