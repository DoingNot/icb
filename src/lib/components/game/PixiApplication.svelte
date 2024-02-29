<script lang="ts">
    import { onMount } from 'svelte';
    import { createApp, pixiApplication } from '$lib/utils/game/createApp';

    onMount(() => {
        createApp()
    })

</script>

{#if $pixiApplication}
    <slot />
{/if}

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
</style>
