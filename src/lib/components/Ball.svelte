<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { DropShadowFilter } from '@pixi/filter-drop-shadow'
    import { pixiApplication } from '$lib/utils/App';
    import { world } from "$lib/utils/Engine";
    import { BALL_COLOR, BALL_STROKE_COLOR, BALL_LINE_WIDTH, GAME_HEIGHT, GAME_WIDTH, BALL_DROPSHADOW_OPTIONS } from '$lib/utils/constants';
    import ballImage from '../assets/ball.png'
    import { onMount } from 'svelte';
    import { reset } from '$lib/utils/stores';

    let ball: PIXI.Sprite
    let matterBall: Matter.Body

    onMount(() => {
        matterBall = Matter.Bodies.circle(
            GAME_WIDTH / 2,
            GAME_HEIGHT - 140,
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
            const ballContainer = new PIXI.Container();
            ballContainer.addChild(ball)
            ballContainer.filters = [new DropShadowFilter(BALL_DROPSHADOW_OPTIONS)];
            $pixiApplication.stage.addChild(ballContainer)
            ball.anchor.set(0.5)
            ball.scale = { x: 0.7, y: 0.7 }
        })

        setInterval(update, 1000 / 60)
    });

    const update = () => {
        if(ball) {
            ball.position.set(matterBall.position.x, matterBall.position.y - 3)
            ball.rotation = matterBall.angle
        }
    }

    $: if($reset) {
        reset.set(false)
        console.log('reset..')
    }

</script>

