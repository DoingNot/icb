<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { pixiApplication, loadedAssets } from '$lib/utils/App';
    import { world } from "$lib/utils/Engine";

    export let level: number
    export let x: number
    export let y: number
    export let size: number
    export let label: string

    const winHole = Matter.Bodies.circle(
        x,
        y,
        size,
        {
            label: label,
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: '#111417',
            }
        }
    );
    Matter.Composite.add($world, winHole)

    const r = $loadedAssets.winHole
    const winHoleSprite = PIXI.Sprite.from(r)
    winHoleSprite.anchor.set(0.5)

    const style = new PIXI.TextStyle({
        fontWeight: "bold"
    });
    const text = new PIXI.Text(level, style);
    text.position.set(-8, -68)

    const winHoleContainer = new PIXI.Container();

    winHoleContainer.position.set(x, y)
    winHoleContainer.scale = { x: size/40, y: size/40 }

    winHoleContainer.addChild(winHoleSprite);
    winHoleContainer.addChild(text);

    $pixiApplication.stage.addChild(winHoleContainer);
</script>
