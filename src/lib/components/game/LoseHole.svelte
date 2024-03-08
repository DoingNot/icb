<script lang="ts">
    import Matter from 'matter-js'
    import { world } from "$lib/utils/game/createEngine";

    export let x: number
    export let y: number
    export let size = 20
    export let label: string

    const loseHole = Matter.Bodies.circle(
        x,
        y,
        size,
        {
            label: label,
            isStatic: true,
            isSensor: true
        }
    );
    Matter.Composite.add($world, loseHole)
</script>
