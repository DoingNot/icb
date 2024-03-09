<script lang="ts">
    import PixiApplication from "./PixiApplication.svelte";
    import Engine from "./Engine.svelte";
    import Bar from "./Bar.svelte";
    import Ball from "./Ball.svelte";
    import Holes from "./Holes.svelte";
</script>

<PixiApplication>
    <Engine>
        <Bar />
        <Ball />
        <Holes />
    </Engine>
</PixiApplication>
