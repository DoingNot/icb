<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { pixiApplication } from '$lib/utils/game/App';
    import { world } from "$lib/utils/game/Engine";
    import { BALL_COLOR, BALL_STROKE_COLOR, BALL_LINE_WIDTH, GAME_HEIGHT, GAME_WIDTH } from './constants';
    import ballImage from '../../assets/ball.png'
    import { onMount } from 'svelte';

    let ball: PIXI.Sprite
    let matterBall: Matter.Body

    onMount(() => {
        matterBall = Matter.Bodies.circle(
            GAME_WIDTH / 2,
            GAME_HEIGHT - 150,
            19,
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
        Matter.Composite.add($world, matterBall)

        PIXI.Assets.load(ballImage).then((r) => {
            ball = PIXI.Sprite.from(r);
            $pixiApplication.stage.addChild(ball)
            ball.anchor.set(0.5)
            ball.scale = { x: 0.7, y: 0.7 }
        })
    })

    const update = () => {
        ball.position.set(matterBall.position.x, matterBall.position.y)
    }

    $: if(ball) {
        setInterval(update, 10)
    }
    $: console.log(ball?.rotation, 'ahh', matterBall?.angle)
</script>

