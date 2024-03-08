<script lang="ts">
    import Engine from "./components/game/Engine.svelte";
    import PixiApplication from "./components/game/PixiApplication.svelte";
    import Bar from "./components/game/Bar.svelte";
    import Ball from "./components/game/Ball.svelte";
</script>

<PixiApplication>
    <Engine>
        <Bar />
        <Ball />
    </Engine>
</PixiApplication>
