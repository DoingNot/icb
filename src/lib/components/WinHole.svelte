<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { loadedAssets } from '$lib/utils/App';
    import { world } from "$lib/utils/Engine";
    import { level, holesContainer } from '$lib/utils/stores';

    export let winLevel: number
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
    const winHoleCenter = Matter.Bodies.circle(
        x,
        y,
        size/6,
        {
            label: `${label}_center`,
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: 'green',
            },
        }
    )
    Matter.Composite.add($world, [winHole, winHoleCenter])

    const r = $loadedAssets.winHole
    const winHoleSprite = PIXI.Sprite.from(r)
    winHoleSprite.anchor.set(0.5)
    winHoleSprite.scale = { x: 0.25, y: 0.25 }

    $: winHoleSprite.texture = $level != winLevel ? $loadedAssets.winHoleInactive : r

    $: style = new PIXI.TextStyle({
        fill: $level != winLevel ? "#1c1c1c" : "#53DB11",
        fontWeight: "800"
    });
    const text = new PIXI.Text(winLevel, style);
    text.position.set(-8, -72)

    const winHoleContainer = new PIXI.Container();

    winHoleContainer.position.set(x, y)
    winHoleContainer.scale = { x: size/40, y: size/40 }

    winHoleContainer.addChild(winHoleSprite);
    winHoleContainer.addChild(text);

    $holesContainer.addChild(winHoleContainer);
</script>
