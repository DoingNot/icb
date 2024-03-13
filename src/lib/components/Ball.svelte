<script lang="ts">
    import { Sprite } from 'pixi-svelte';
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { DropShadowFilter } from '@pixi/filter-drop-shadow'

    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { sineOut, quintIn } from 'svelte/easing';

    import { world } from "$lib/utils/Engine";
    import { BALL_COLOR, BALL_STROKE_COLOR, BALL_LINE_WIDTH, BALL_DROPSHADOW_OPTIONS, BALL_STARTING_X, BALL_STARTING_Y, BALL_SIZE, BALL_SIZE_PIXI } from '$lib/utils/constants';
    import { reset, win } from '$lib/utils/stores';

    let matterBall: Matter.Body
    let ballX: number;
    let ballY: number;
    let ballRotation: number;
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

    let tweenedScale = tweened(BALL_SIZE_PIXI, {
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

    // manually tick matter body properties as it is not reactive
    const matterTicker = () => {
        matterBall.position.x = matterBall.position.x
        matterBall.position.y = matterBall.position.y
        matterBall.angle = matterBall.angle
    }

    onMount(() => {
        matterBall = Matter.Bodies.circle(
            BALL_STARTING_X,
            BALL_STARTING_Y,
            BALL_SIZE,
            {
                label: 'Ball',
                friction: 0.50,
                frictionStatic: 0.7,
                frictionAir: 0,
                render: {
                    fillStyle: BALL_COLOR,
                    strokeStyle: BALL_STROKE_COLOR,
                    lineWidth: BALL_LINE_WIDTH
                }
            }
        );
        Matter.Body.setMass(matterBall, 0.0001)
        Matter.Composite.add($world, matterBall)

        setInterval(matterTicker, 1000 / 60);
    });

    $: {
        if($reset || $win) {
            Matter.Body.setPosition(matterBall, { x: $tweenedX, y: $tweenedY })
        } else if (!$reset || !$win) {
            tweenedX.set(matterBall?.position.x || 0)
            tweenedY.set(matterBall?.position.y || 0)
            tweenedAngle.set(matterBall?.angle || 0)
        }
        if(matterBall) {
            ballX = matterBall.position.x
            ballY = matterBall.position.y
            ballRotation = matterBall.angle
        }
    }

    const fallInHoleAnimation = (x: number, y: number) => {
        tweenXDuration = 400
        tweenYDuration = 400
        tweenedX.set(x)
        tweenedY.set(y)

        tweenAngleDuration = 400
        tweenedAngle.set(matterBall.angle + 500)

        tweenedScale.set(BALL_SIZE_PIXI / 1.5)
        tweenedAlpha.set(0)

        Matter.Body.setStatic(matterBall, true)
        setTimeout(() => tweenXDuration = 0, 490)
        setTimeout(() => tweenYDuration = 0, 490)
        setTimeout(() => tweenedScale.set(BALL_SIZE_PIXI), 500)
        setTimeout(() => tweenedX.set(BALL_STARTING_X), 500)
        setTimeout(() => tweenedY.set(BALL_STARTING_Y), 500)
        setTimeout(() => Matter.Body.setStatic(matterBall, false), 550)
        setTimeout(() => tweenedAlpha.set(1), 550)
    }

    $: if($reset) {
        fallInHoleAnimation($reset.HoleX, $reset.HoleY)
        setTimeout(() => reset.set(undefined), 750)
    }

    $: if($win) {
        fallInHoleAnimation($win.HoleX, $win.HoleY)
        setTimeout(() => win.set(undefined), 750)
    }


</script>

<Sprite 
    key="ball"
    x={ballX+ 10}
    y={ballY + 38}
    anchor={0.5}
    zIndex={999}
    width={$tweenedScale}
    height={$tweenedScale}
    rotation={ballRotation}
    alpha={$tweenedAlpha}
/>

