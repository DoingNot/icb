<script lang="ts">
    import Matter from 'matter-js'
    import { createEngine } from '$lib/utils/game/createEngine';
    import { engine, world } from '$lib/utils/game/createEngine';

    createEngine()

    Matter.Engine.update($engine, 1000 / 60);

    $: console.log($engine, $world, 'hih')
</script>

<slot />
