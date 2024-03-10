<script lang="ts">
    import { onMount } from 'svelte';
    import { App, loaded } from '$lib/utils/App';

    onMount(() => {
        App()
    })

</script>

{#if $loaded}
    <slot />
{:else}
    <div class="flex absolute w-screen h-screen justify-center items-center z-50">
        <h1 class="h1 font-bold text-xl">loading...</h1>
    </div>
{/if}
