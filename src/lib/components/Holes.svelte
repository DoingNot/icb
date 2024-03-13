<script lang="ts">
    import { Container } from "pixi-svelte";
    import LoseHole from "./LoseHole.svelte";
    import WinHole from "./WinHole.svelte";
    import { generateLevel } from "$lib/utils/GenerateLevel";
    import { difficulty, config } from "$lib/utils/stores";

    $: config.set(generateLevel($difficulty))
</script>

<Container>
    {#if $config}
        <!-- {#each $config["loseHoles"] as loseHole} -->
        <!--     <LoseHole -->
        <!--         x={loseHole.x} -->
        <!--         y={loseHole.y} -->
        <!--         label={`loseHole_${loseHole.index + 1}`} -->
        <!--         size={loseHole.size} -->
        <!--     /> -->
        <!-- {/each} -->

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
</Container>
