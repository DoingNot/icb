<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { pixiApplication } from '$lib/utils/App';
    import { world } from '$lib/utils/Engine';
    import loseHoleImage from '../assets/losehole.png';

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

    PIXI.Assets.load(loseHoleImage).then((r) => {
        const loseHoleSprite = PIXI.Sprite.from(r)
        loseHoleSprite.anchor.set(0.5)
        loseHoleSprite.position.set(x, y)
        loseHoleSprite.scale = { x: size/40, y: size/40 }

        $pixiApplication.stage.addChild(loseHoleSprite)
    })

</script>
