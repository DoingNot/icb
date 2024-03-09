<script lang="ts">
    import LoseHole from "./LoseHole.svelte";
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
