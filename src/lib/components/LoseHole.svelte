<script lang="ts">
    import { Sprite } from 'pixi-svelte';
    import Matter from 'matter-js'
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

</script>

<Sprite
    key="losehole"
    {x}
    {y}
    width={size*2}
    height={size*2}
    anchor={{ x: 0.3, y: -0.3 }}
/>
