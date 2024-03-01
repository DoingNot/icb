<script lang="ts">
    import Rectangle from "../graphics/Rectangle.svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import { onMount } from "svelte";

    const y = tweened(500, {
        duration: 15,
        easing: cubicInOut
    });

    let increaseIntervalId: ReturnType<typeof setInterval>;
    let decreaseIntervalId: ReturnType<typeof setInterval>;

    const increaseY = () => {
        y.set($y - 3);
    };

    const decreaseY = () => {
        y.set($y + 3);
    };

    const keyDownHandler = (event: KeyboardEvent) => {
        if (event.key === 'w' && !increaseIntervalId) {
            increaseY();
            increaseIntervalId = setInterval(increaseY, 50);
        }
        if (event.key === 's' && !decreaseIntervalId) {
            decreaseY();
            decreaseIntervalId = setInterval(decreaseY, 50);
        }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key === 'w') {
            clearInterval(increaseIntervalId);
            increaseIntervalId = 0;
        }
        if (event.key === 's') {
            clearInterval(decreaseIntervalId);
            decreaseIntervalId = 0;
        }
    };

    onMount(() => {
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
    });

</script>

<Rectangle 
    scale={{'x': 6, 'y': 1}}
    backgroundColor={0xff00ff}
    y={$y}
/>
