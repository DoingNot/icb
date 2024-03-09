<script lang="ts">
    import LoseHole from "./LoseHole.svelte";
    import WinHole from "./WinHole.svelte";
    import { config } from "$lib/utils/config";
</script>

{#each config["loseHoles"] as loseHole, index}
    <LoseHole
        x={loseHole.x}
        y={loseHole.y}
        label={`loseHole_${index}`}
        size={loseHole.size}
    />
{/each}

{#each config["winHoles"] as winHole, index}
    <WinHole
        level={winHole.level}
        x={winHole.x}
        y={winHole.y}
        label={`winHole_${index}`}
        size={winHole.size}
    />
{/each}
