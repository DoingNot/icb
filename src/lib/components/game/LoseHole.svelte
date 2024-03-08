<script lang="ts">
    import Matter from 'matter-js'
    import { world } from "$lib/utils/game/Engine";

    export let x: number
    export let y: number
    export let size = 22
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
            }
        }
    );
    Matter.Composite.add($world, loseHole)
</script>
