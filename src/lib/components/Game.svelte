<script lang="ts">
    import UI from "./UI.svelte";
    import PixiApplication from "./PixiApplication.svelte";
    import Engine from "./Engine.svelte";
    import Bar from "./Bar.svelte";
    import Ball from "./Ball.svelte";
    import Holes from "./Holes.svelte";

</script>

<UI />
<PixiApplication>
    <Engine>
        <Holes />
        <Ball />
        <Bar />
    </Engine>
</PixiApplication>

