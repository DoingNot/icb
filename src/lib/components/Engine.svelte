<script lang="ts">
    import Matter from 'matter-js'
    import { Engine, engine, runner } from '$lib/utils/Engine';
    import { lives } from '$lib/utils/stores';

    Engine()
    Matter.Engine.update($engine, 1000 / 60);

    $: if($lives === 0) {
        console.log('gg')
        Matter.Runner.stop($runner)
    }
</script>

<slot />
