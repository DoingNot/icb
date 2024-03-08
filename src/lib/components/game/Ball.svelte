<script lang="ts">
    import Matter from 'matter-js'
    import { world } from "$lib/utils/game/createEngine";
    import { BALL_COLOR, GAME_HEIGHT, GAME_WIDTH } from './constants';

    const ball = Matter.Bodies.circle(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 150,
        16,
        {
            label: 'Ball',
            mass: 1,
            friction: 0.02,
            frictionStatic: 0.2,
            frictionAir: 0
        }
    );
    Matter.Composite.add($world, ball)
</script>

