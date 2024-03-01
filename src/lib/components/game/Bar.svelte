<script lang="ts">
    import Rectangle from "../graphics/Rectangle.svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import { onMount } from "svelte";

    const y = tweened(500, {
        duration: 5,
    });

    let increaseTimeoutId: number | undefined = undefined;
    let decreaseTimeoutId: number | undefined = undefined;

    const increaseY = async () => {
        y.set($y - 3);
        await waitForTimeout(20);
        if (increaseTimeoutId !== undefined) {
            increaseTimeoutId = setTimeout(increaseY, 0);
        }
    };

    const decreaseY = async () => {
        y.set($y + 3);
        await waitForTimeout(20);
        if (decreaseTimeoutId !== undefined) {
            decreaseTimeoutId = setTimeout(decreaseY, 0);
        }
    };

    const keyDownHandler = async (event: KeyboardEvent) => {
        if (event.key === 'w' && increaseTimeoutId === undefined) {
            increaseTimeoutId = setTimeout(increaseY, 0);
            await increaseY();
        }
        if (event.key === 's' && decreaseTimeoutId === undefined) {
            decreaseTimeoutId = setTimeout(decreaseY, 0);
            await decreaseY();
        }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key === 'w') {
            clearTimeout(increaseTimeoutId);
            increaseTimeoutId = undefined;
        }
        if (event.key === 's') {
            clearTimeout(decreaseTimeoutId);
            decreaseTimeoutId = undefined;
        }
    };

    onMount(() => {
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
            clearTimeout(increaseTimeoutId);
            clearTimeout(decreaseTimeoutId);
        };
    });

</script>

<Rectangle 
    scale={{'x': 6, 'y': 1}}
    backgroundColor={0xff00ff}
    y={$y}
    pivot={{'x': -53, 'y': 0}}
/>
