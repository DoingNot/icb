<script lang="ts">
    import Matter from 'matter-js'
    import Circle from "../graphics/Circle.svelte";
    import { world } from "$lib/utils/game/createEngine";

    const ball = Matter.Bodies.circle(100, 100, 16);
    const BAR_HEIGHT_OFFSET = 4
    Matter.Composite.add($world, ball)

    const scale = 4
    let x = ball.position.x
    let y = ball.position.y
    let rotation = ball.angle
    const update = () => {
        x = ball.position.x
        y = ball.position.y
        rotation = ball.angle
    }
    setInterval(update, 10)
    $: console.log(x, ball.position.x, $world, ball)
</script>

<Circle
    {scale}
    {x}
    y={y + BAR_HEIGHT_OFFSET}
    rotation={rotation}
    pivot={{ x: scale / 2, y: scale / 2 }}
/>
