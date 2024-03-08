<script lang="ts">
    import Matter from 'matter-js';
    import Rectangle from "$lib/components/graphics/Rectangle.svelte";
    import { tweened } from "svelte/motion";
    import { onMount } from "svelte";
    import { world } from '$lib/utils/game/createEngine';
    import { TWEEN_DURATION, BAR_WIDTH, BAR_HEIGHT, BLOCK_OFFSET, BAR_COLOR, KEY_LEFT_UP, KEY_LEFT_DOWN, KEY_RIGHT_UP, KEY_RIGHT_DOWN, PIXI_MATTER_RATIO } from './constants'


    const leftY = tweened(500, {
        duration: TWEEN_DURATION,
    });

    const rightY = tweened(500, {
        duration: TWEEN_DURATION,
    });

    let increaseLeftTimeoutId: number | undefined = undefined;
    let decreaseLeftTimeoutId: number | undefined = undefined;
    let increaseRightTimeoutId: number | undefined = undefined;
    let decreaseRightTimeoutId: number | undefined = undefined;

    const updateBody = () => {
        Matter.Body.setPosition(barBody, {
            x: BAR_WIDTH / 2,
            y: ($leftY + $rightY) / 2,
        });
        Matter.Body.setAngle(barBody, barRotation);
        Matter.Body.setPosition(barLeft, {
            x: BLOCK_OFFSET / 2,
            y: $leftY - BLOCK_OFFSET / 2
        })
        Matter.Body.setPosition(barRight, {
            x: BAR_WIDTH - (BLOCK_OFFSET / 2),
            y: $rightY - BLOCK_OFFSET / 2
        })
    }

    const increaseLeftY = async () => {
        if($rightY - $leftY > 150) {
            return
        }
        leftY.set($leftY - 3);
        if (increaseLeftTimeoutId !== undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
        }
        updateBody()
    };

    const decreaseLeftY = async () => {
        if($leftY - $rightY > 150) {
            return
        }
        leftY.set($leftY + 3);
        if (decreaseLeftTimeoutId !== undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
        }
        updateBody()
    };

    const increaseRightY = async () => {
        if($leftY - $rightY > 150) {
            return
        }
        rightY.set($rightY - 3);
        if (increaseRightTimeoutId !== undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
        }
        updateBody()
    };

    const decreaseRightY = async () => {
        if($rightY - $leftY > 150) {
            return
        }
        rightY.set($rightY + 3);
        if (decreaseRightTimeoutId !== undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
        }
        updateBody()
    };

    const keyDownHandler = async (event: KeyboardEvent) => {
        if (event.key === KEY_LEFT_UP && increaseLeftTimeoutId === undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
            await increaseLeftY();
        }
        if (event.key === KEY_LEFT_DOWN && decreaseLeftTimeoutId === undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
            await decreaseLeftY();
        }
        if (event.key === KEY_RIGHT_UP && increaseRightTimeoutId === undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
            await increaseRightY();
        }
        if (event.key === KEY_RIGHT_DOWN && decreaseRightTimeoutId === undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
            await decreaseRightY();
        }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key === KEY_LEFT_UP) {
            clearTimeout(increaseLeftTimeoutId);
            increaseLeftTimeoutId = undefined;
        }
        if (event.key === KEY_LEFT_DOWN) {
            clearTimeout(decreaseLeftTimeoutId);
            decreaseLeftTimeoutId = undefined;
        }
        if (event.key === KEY_RIGHT_UP) {
            clearTimeout(increaseRightTimeoutId);
            increaseRightTimeoutId = undefined;
        }
        if (event.key === KEY_RIGHT_DOWN) {
            clearTimeout(decreaseRightTimeoutId);
            decreaseRightTimeoutId = undefined;
        }
    };


    let barBody;
    let barLeft;
    let barRight;

    onMount(() => {
        barBody = Matter.Bodies.rectangle(
            BAR_WIDTH / 2,
            ($leftY + $rightY) / 2,
            BAR_WIDTH,
            BAR_HEIGHT,
            {
                frictionAir: 0,
                isStatic: true,
                label: 'Bar',
            }
        );
        barLeft = Matter.Bodies.rectangle(
            BLOCK_OFFSET / 2,
            $leftY - BLOCK_OFFSET / 2,
            BAR_WIDTH / 40,
            BAR_HEIGHT * 5,
            {
                isStatic: true,
                label: 'BarLeft'
            }
        );
        barRight = Matter.Bodies.rectangle(
            BAR_WIDTH - (BLOCK_OFFSET / 2),
            $rightY - BLOCK_OFFSET / 2,
            BAR_WIDTH / 40,
            BAR_HEIGHT * 5,
            {
                isStatic: true,
                label: 'BarLeft'
            }
        );

        Matter.World.add($world, [barBody, barLeft, barRight]);

        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
            clearTimeout(increaseLeftTimeoutId);
            clearTimeout(decreaseLeftTimeoutId);
            clearTimeout(increaseRightTimeoutId);
            clearTimeout(decreaseRightTimeoutId);
        };
    });

    $: leftX = 0;
    $: rightX = BAR_WIDTH;
    $: barRotation = Math.atan2(BAR_WIDTH, $leftY - $rightY) - Math.PI/2;
</script>

<Rectangle
    scale={{ x: (BAR_WIDTH / 40) / PIXI_MATTER_RATIO, y: BAR_HEIGHT * 5 / PIXI_MATTER_RATIO }}
    backgroundColor={BAR_COLOR}
    y={$leftY - BLOCK_OFFSET}
    x={leftX + BLOCK_OFFSET / 2}
    pivot={{ x: 0, y: BAR_HEIGHT / 3 }}
/>
<Rectangle
    scale={{ x: (BAR_WIDTH / 40) / PIXI_MATTER_RATIO, y: BAR_HEIGHT * 5 / PIXI_MATTER_RATIO }}
    backgroundColor={BAR_COLOR}
    y={$rightY - BLOCK_OFFSET}
    x={rightX - BLOCK_OFFSET / 3}
    pivot={{ x: 0, y: BAR_HEIGHT / 2 }}
/>
<Rectangle
    scale={{ x: BAR_WIDTH / PIXI_MATTER_RATIO, y: BAR_HEIGHT / PIXI_MATTER_RATIO }}
    backgroundColor={BAR_COLOR}
    y={($leftY + $rightY) / 2}
    x={BAR_WIDTH/2}
    pivot={{ x: 25, y: 25 }}
    rotation={barRotation}
/>
