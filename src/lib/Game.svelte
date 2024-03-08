<script lang="ts">
    import PixiApplication from "./components/game/PixiApplication.svelte";
    import Engine from "./components/game/Engine.svelte";
    import Game from "./components/game/Game.svelte";
    import Bar from "./components/game/Bar.svelte";
    import Ball from "./components/game/Ball.svelte";
    import Holes from "./components/game/Holes.svelte";
</script>

<PixiApplication>
    <Engine>
        <Game>
            <Holes />
            <Bar />
            <Ball />
        </Game>
    </Engine>
</PixiApplication>
