<script lang="ts">
    import Matter from 'matter-js';
    import Rectangle from "$lib/components/graphics/Rectangle.svelte";
    import { tweened } from "svelte/motion";
    import { onMount } from "svelte";
    import { world } from '$lib/utils/game/createEngine';


    const leftY = tweened(500, {
        duration: 5,
    });

    const rightY = tweened(500, {
        duration: 5,
    });

    let increaseLeftTimeoutId: number | undefined = undefined;
    let decreaseLeftTimeoutId: number | undefined = undefined;
    let increaseRightTimeoutId: number | undefined = undefined;
    let decreaseRightTimeoutId: number | undefined = undefined;

    const updateBody = () => {
        Matter.Body.setPosition(barBody, {
            x: barWidth / 2,
            y: ($leftY + $rightY) / 2,
        });
        Matter.Body.setAngle(barBody, barRotation);
        console.log($world)
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
        if (event.key === 'w' && increaseLeftTimeoutId === undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
            await increaseLeftY();
        }
        if (event.key === 's' && decreaseLeftTimeoutId === undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
            await decreaseLeftY();
        }
        if (event.key === 'o' && increaseRightTimeoutId === undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
            await increaseRightY();
        }
        if (event.key === 'l' && decreaseRightTimeoutId === undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
            await decreaseRightY();
        }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key === 'w') {
            clearTimeout(increaseLeftTimeoutId);
            increaseLeftTimeoutId = undefined;
        }
        if (event.key === 's') {
            clearTimeout(decreaseLeftTimeoutId);
            decreaseLeftTimeoutId = undefined;
        }
        if (event.key === 'o') {
            clearTimeout(increaseRightTimeoutId);
            increaseRightTimeoutId = undefined;
        }
        if (event.key === 'l') {
            clearTimeout(decreaseRightTimeoutId);
            decreaseRightTimeoutId = undefined;
        }
    };


    let barBody;

    onMount(() => {
        barBody = Matter.Bodies.rectangle(
            barWidth/ 2,
            ($leftY + $rightY) / 2,
            barWidth,
            barHeight,
            {
                frictionAir: 0,
                isStatic: true,
                label: 'Bar',
            }
        );

        Matter.World.add($world, barBody);

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

    const BLOCK_OFFSET = 32;
    $: barHeight = 20;
    $: barWidth = 390;
    $: leftX = 0;
    $: rightX = barWidth;
    $: barRotation = Math.atan2(barWidth, $leftY - $rightY) - Math.PI/2;
</script>

<Rectangle
    scale={{ x: 0.2, y: 0.8 }}
    backgroundColor={0xff00ff}
    y={$leftY - BLOCK_OFFSET}
    x={leftX + BLOCK_OFFSET / 6}
    pivot={{ x: 0, y: barHeight / 2 }}
/>
<Rectangle
    scale={{ x: 0.2, y: 0.8 }}
    backgroundColor={0xff00ff}
    y={$rightY - BLOCK_OFFSET}
    x={rightX - BLOCK_OFFSET / 6}
    pivot={{ x: 0, y: barHeight / 2 }}
/>
<Rectangle
    scale={{ x: 10, y: 0.2 }}
    backgroundColor={0xff00ff}
    y={($leftY + $rightY) / 2}
    x={barWidth/2}
    pivot={{ x: 25, y: 25 }}
    rotation={barRotation}
/>
