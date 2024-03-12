<script lang="ts">
    import UI from "./UI.svelte";
    import PixiApplication from "./PixiApplication.svelte";
    import Engine from "./Engine.svelte";
    import Bar from "./Bar.svelte";
    import Ball from "./Ball.svelte";
    import Holes from "./Holes.svelte";

</script>

<PixiApplication>
    <Engine>
        <Ball />
        <Bar />
    </Engine>
</PixiApplication>

<UI />
