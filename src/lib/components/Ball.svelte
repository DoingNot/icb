<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { DropShadowFilter } from '@pixi/filter-drop-shadow'
    import { pixiApplication, loadedAssets } from '$lib/utils/App';
    import { world } from "$lib/utils/Engine";
    import { BALL_COLOR, BALL_STROKE_COLOR, BALL_LINE_WIDTH, GAME_HEIGHT, GAME_WIDTH, BALL_DROPSHADOW_OPTIONS, BALL_STARTING_X, BALL_STARTING_Y } from '$lib/utils/constants';
    import ballImage from '../assets/ball.png'
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { sineOut, quintIn } from 'svelte/easing';
    import { reset, lives } from '$lib/utils/stores';

    let ball: PIXI.Sprite
    let matterBall: Matter.Body
    let tweenXDuration = 0
    let tweenYDuration = 0
    let tweenAngleDuration = 0

    const tweenedX = tweened(BALL_STARTING_X, {
        duration: (() => tweenXDuration),
        easing: sineOut
    })

    const tweenedY = tweened(BALL_STARTING_Y, {
        duration: (() => tweenYDuration),
    })

    let tweenedScale = tweened(0.7, {
        duration: 300,
        easing: quintIn
    })

    let tweenedAlpha = tweened(1, {
        duration: 300,
        easing: quintIn
    })

    let tweenedAngle = tweened(0, {
        duration: (() => tweenAngleDuration),
        easing: quintIn
    })

    onMount(() => {
        matterBall = Matter.Bodies.circle(
            BALL_STARTING_X,
            BALL_STARTING_Y,
            18,
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

        const r =$loadedAssets['ball']
        ball = PIXI.Sprite.from(r);
        const ballContainer = new PIXI.Container();
        ballContainer.addChild(ball)
        ballContainer.filters = [new DropShadowFilter(BALL_DROPSHADOW_OPTIONS)];
        $pixiApplication.stage.addChild(ballContainer)
        ball.anchor.set(0.5)
        ball.scale = { x: 0.7, y: 0.7 }

        const updateLoop = setInterval(update, 1000 / 60)

        return () => {
            clearInterval(updateLoop)
        }
    });

    const update = () => {
        if(ball) {
            if($reset) {
                Matter.Body.setPosition(matterBall, { x: $tweenedX, y: $tweenedY })
            } else if (!$reset) {
                tweenedX.set(matterBall.position.x)
                tweenedY.set(matterBall.position.y)
                tweenedAngle.set(matterBall.angle)
            }
            ball.position.set(matterBall.position.x, matterBall.position.y - 4)
            ball.rotation = matterBall.angle
            ball.scale.set($tweenedScale)
            ball.alpha = $tweenedAlpha
        }
    }

    const fallInHoleAnimation = () => {
        if($reset) {
            console.log(matterBall)
            tweenXDuration = Math.min(Math.abs(400 / matterBall.velocity.x), 500)
            tweenYDuration = Math.min(Math.abs(400 / matterBall.velocity.y), 500)
            tweenedX.set($reset.loseHoleX)
            tweenedY.set($reset.loseHoleY)

            tweenAngleDuration = Math.min(Math.abs(400 /matterBall.angularSpeed), 500)
            tweenedAngle.set(matterBall.angle + 500)

            tweenedScale.set(0.3)
            tweenedAlpha.set(0)

            Matter.Body.setStatic(matterBall, true)
            setTimeout(() => tweenedScale.set(0.7), 500)
            setTimeout(() => tweenedAlpha.set(1), 550)
            setTimeout(() => tweenXDuration = 0, 490)
            setTimeout(() => tweenYDuration = 0, 490)
            setTimeout(() => tweenedX.set(BALL_STARTING_X), 500)
            setTimeout(() => tweenedY.set(BALL_STARTING_Y), 500)
            setTimeout(() => Matter.Body.setStatic(matterBall, false), 520)
        }
    }

    $: if($reset) {
        lives.set($lives - 1)

        fallInHoleAnimation()

        setTimeout(() => reset.set(undefined), 550)
    }

</script>

