<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { loadedAssets } from '$lib/utils/App';
    import { holesContainer } from '$lib/utils/stores';
    import { world } from '$lib/utils/Engine';

    export let x: number
    export let y: number
    export let size: number 
    export let label: string

    const loseHole = Matter.Bodies.circle(
        x,
        y,
        size,
        {
            label: label,
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: '#111417',
            },
        }
    );
    const loseHoleCenter = Matter.Bodies.circle(
        x,
        y,
        size/5,
        {
            label: `${label}_center`,
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: 'red',
            },
        }
    )
    Matter.Composite.add($world, [loseHole, loseHoleCenter])

    const r = $loadedAssets.loseHole
    const loseHoleSprite = PIXI.Sprite.from(r)
    loseHoleSprite.anchor.set(0.5)
    loseHoleSprite.position.set(x, y)
    loseHoleSprite.scale = { x: size/40, y: size/40 }

    $holesContainer.addChild(loseHoleSprite)

</script>
