<script lang="ts">
    import Matter from 'matter-js'
    import { world } from "$lib/utils/game/createEngine";
    import { BALL_COLOR, BALL_STROKE_COLOR, BALL_LINE_WIDTH, GAME_HEIGHT, GAME_WIDTH } from './constants';

    const ball = Matter.Bodies.circle(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 150,
        16,
        {
            label: 'Ball',
            mass: 1,
            friction: 0.01,
            frictionStatic: 0.2,
            frictionAir: 0,
            render: {
                fillStyle: BALL_COLOR,
                strokeStyle: BALL_STROKE_COLOR,
                lineWidth: BALL_LINE_WIDTH
            }
        }
    );
    Matter.Composite.add($world, ball)
</script>

