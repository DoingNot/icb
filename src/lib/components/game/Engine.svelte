<script lang="ts">
    import Matter from 'matter-js'
    import { Engine, engine, world } from '$lib/utils/game/Engine';

    Engine()

    Matter.Engine.update($engine, 1000 / 60);
</script>

<slot />
