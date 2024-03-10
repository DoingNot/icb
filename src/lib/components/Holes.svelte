<script lang="ts">
    import LoseHole from "./LoseHole.svelte";
    import WinHole from "./WinHole.svelte";
    import { generateLevel } from "$lib/utils/GenerateLevel";
    import { difficulty, holesContainer, config } from "$lib/utils/stores";
    import { pixiApplication } from "$lib/utils/App";

    $pixiApplication.stage.addChild($holesContainer);
    $: config.set(generateLevel($difficulty))

</script>

{#if $config}
    {#each $config["loseHoles"] as loseHole}
        <LoseHole
            x={loseHole.x}
            y={loseHole.y}
            label={`loseHole_${loseHole.index + 1}`}
            size={loseHole.size}
        />
    {/each}

    {#each $config["winHoles"] as winHole}
        <WinHole
            winLevel={winHole.winLevel}
            x={winHole.x}
            y={winHole.y}
            label={`winHole_${winHole.winLevel}`}
            size={winHole.size}
        />
    {/each}
{/if}
