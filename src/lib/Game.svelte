<script lang="ts">
    import Engine from "./components/game/Engine.svelte";
    import PixiApplication from "./components/game/PixiApplication.svelte";
    import Bar from "./components/game/bar/Bar.svelte";
</script>

<PixiApplication>
    <Engine>
        <Bar />
    </Engine>
</PixiApplication>
