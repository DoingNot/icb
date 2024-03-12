<script lang="ts">
    import { Assets } from 'pixi.js';
    import { ASSETS_DATA } from '$lib/utils/constants';
    import { createApp, setAppContext, getAppContext, App, Text, spriteLoad } from 'pixi-svelte';
    import { onMount } from 'svelte';
    import assets from '$lib/assets'

    const app = createApp();
    const { loaded } = app;

    setAppContext({ ...app, assets })
    const { pixiApplication } = app;

    async function loadAssets() {
        const assets = {}
        for (const asset of ASSETS_DATA) {
            const texture = await Assets.load(asset.src)
            assets[asset.alias] = texture
        }

        return assets
    }

    // loadAssets().then(r => assets = r)
    //
    // $: if(assets) {
    //     context.loadedAssets.set(assets)
    // }
    // $: console.log($pixiApplication)
    // $: console.log($loadedAssets)
    // $: console.log(context.loadedAssets)
    // for PIXIJS Dev tools
    $: if($pixiApplication) {
        globalThis.__PIXI_APP__ = $pixiApplication;
    }

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
