<script lang="ts">
    import { createApp, setAppContext, App } from 'pixi-svelte';
    import assets from '$lib/assets'
    import { BAR_WIDTH } from '$lib/utils/constants';
    import { onMount } from 'svelte';

    const app = createApp();
    const { loaded } = app;

    setAppContext({ ...app, assets })
    const { pixiApplication } = app;

    $: if($pixiApplication) {
        //for pixijs devtools
        globalThis.__PIXI_APP__ = $pixiApplication;
        $pixiApplication.stage.position.set(window.innerWidth / 2 - BAR_WIDTH / 2, 0)
    }

    const resize = () => {
        $pixiApplication?.stage.position.set(window.innerWidth / 2 - BAR_WIDTH / 2, 0)
    }

    onMount(() => {
        window.addEventListener("resize", resize)
    })

</script>

<App>
    {#if $loaded}
            <slot />
    {:else}
        <div class="flex absolute w-screen h-screen justify-center items-center z-40">
            <h1 class="h1 font-bold text-xl opacity-90">loading...</h1>
        </div>
    {/if}
</App>
