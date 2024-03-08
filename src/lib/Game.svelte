<script lang="ts">
    import Engine from "./components/game/Engine.svelte";
    import Bar from "./components/game/Bar.svelte";
    import Ball from "./components/game/Ball.svelte";
    import Holes from "./components/game/Holes.svelte";
</script>

<Engine>
    <Holes />
    <Bar />
    <Ball />
</Engine>
