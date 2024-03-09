<script lang="ts">
    import { onMount } from 'svelte';
    import { App, pixiApplication } from '$lib/utils/App';

    onMount(() => {
        App()
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
