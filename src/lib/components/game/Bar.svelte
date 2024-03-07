<script lang="ts">
    import Rectangle from "../graphics/Rectangle.svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import { onMount } from "svelte";

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

    const increaseLeftY = async () => {
        leftY.set($leftY - 3);
        if (increaseLeftTimeoutId !== undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
        }
    };

    const decreaseLeftY = async () => {
        leftY.set($leftY + 3);
        if (decreaseLeftTimeoutId !== undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
        }
    };

    const increaseRightY = async () => {
        rightY.set($rightY - 3);
        if (increaseRightTimeoutId !== undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
        }
    };

    const decreaseRightY = async () => {
        rightY.set($rightY + 3);
        if (decreaseRightTimeoutId !== undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
        }
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

    onMount(() => {
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

    $: barHeight = 50;
    $: barWidth = 390;
    $: leftX = 0;
    $: rightX = barWidth;
    $: barLength = Math.sqrt(($rightY - $leftY) ** 2 + barWidth ** 2);
    $: barRotation = Math.atan2(barWidth, $leftY - $rightY) - Math.PI/2;
    $: console.log($leftY, $rightY, barRotation)
</script>

<Rectangle
    scale={{ x: 0.2, y: 0.2 }}
    backgroundColor={0xff00ff}
    y={$leftY}
    x={leftX}
    pivot={{ x: 0, y: barHeight / 2 }}
/>
<Rectangle
    scale={{ x: 0.2, y: 0.2 }}
    backgroundColor={0xff00ff}
    y={$rightY}
    x={rightX}
    pivot={{ x: 0, y: barHeight / 2 }}
/>
<Rectangle
    scale={{ x: 10, y: barHeight / 100 }}
    backgroundColor={0xff00ff}
    y={($leftY + $rightY) / 2}
    x={barWidth/2}
    pivot={{ x: 25, y: 25 }}
    rotation={barRotation}
/>
