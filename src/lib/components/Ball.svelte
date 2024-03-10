<script lang="ts">
    import Matter from 'matter-js'
    import * as PIXI from 'pixi.js';
    import { DropShadowFilter } from '@pixi/filter-drop-shadow'

    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { sineOut, quintIn } from 'svelte/easing';

    import { pixiApplication, loadedAssets } from '$lib/utils/App';
    import { world } from "$lib/utils/Engine";
    import { BALL_COLOR, BALL_STROKE_COLOR, BALL_LINE_WIDTH, BALL_DROPSHADOW_OPTIONS, BALL_STARTING_X, BALL_STARTING_Y, BALL_SIZE, BALL_SIZE_PIXI } from '$lib/utils/constants';
    import { reset, lives, level, win } from '$lib/utils/stores';

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

    onMount(() => {
        matterBall = Matter.Bodies.circle(
            BALL_STARTING_X,
            BALL_STARTING_Y,
            BALL_SIZE,
            {
                label: 'Ball',
                friction: 0.505,
                frictionStatic: 0.52,
                frictionAir: 0,
                render: {
                    fillStyle: BALL_COLOR,
                    strokeStyle: BALL_STROKE_COLOR,
                    lineWidth: BALL_LINE_WIDTH
                }
            }
        );
        Matter.Body.setMass(matterBall, 1000)
        Matter.Composite.add($world, matterBall)

        const r =$loadedAssets['ball']
        ball = PIXI.Sprite.from(r);
        const ballContainer = new PIXI.Container();
        ballContainer.addChild(ball)
        ballContainer.filters = [new DropShadowFilter(BALL_DROPSHADOW_OPTIONS)];
        $pixiApplication.stage.addChild(ballContainer)
        ball.anchor.set(0.5)
        ball.scale = { x: BALL_SIZE_PIXI, y: BALL_SIZE_PIXI }
        ballContainer.zIndex = 999

        const updateLoop = setInterval(update, 1000 / 60)

        return () => {
            clearInterval(updateLoop)
        }
    });

    const update = () => {
        if(ball) {
            if($reset || $win) {
                Matter.Body.setPosition(matterBall, { x: $tweenedX, y: $tweenedY })
            } else if (!$reset || !$win) {
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

    const fallInHoleAnimation = (x: number, y: number) => {
        tweenXDuration = 400
        tweenYDuration = 400
        tweenedX.set(x)
        tweenedY.set(y)

        tweenAngleDuration = 400
        tweenedAngle.set(matterBall.angle + 500)

        tweenedScale.set(0.3)
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

