<script lang="ts">
    import Rectangle from "../graphics/Rectangle.svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import { onMount } from "svelte";

    const y = tweened(500, {
        duration: 15,
        easing: cubicInOut
    });

    let increaseIntervalId;
    let decreaseIntervalId;

    const increaseY = () => {
        y.set($y - 3);
    };

    const decreaseY = () => {
        y.set($y + 3);
    };

    const keyDownHandler = (event) => {
        if (event.key === 'w' && !increaseIntervalId) {
            increaseY();
            increaseIntervalId = setInterval(increaseY, 50); // Adjust interval time as needed
        }
        if (event.key === 's' && !decreaseIntervalId) {
            decreaseY();
            decreaseIntervalId = setInterval(decreaseY, 50); // Adjust interval time as needed
        }
    };

    const keyUpHandler = (event) => {
        if (event.key === 'w') {
            clearInterval(increaseIntervalId);
            increaseIntervalId = null;
        }
        if (event.key === 's') {
            clearInterval(decreaseIntervalId);
            decreaseIntervalId = null;
        }
    };

    onMount(() => {
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
    });

    $: console.log($y, 'y');
</script>

<Rectangle 
    scale={1}
    backgroundColor={0xff00ff}
    x={200}
    y={$y}
/>
