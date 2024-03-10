<script lang="ts">
    import heart from '../assets/heart.png'
    import greyheart from '../assets/greyheart.png'
    import { lives, lostLives } from "$lib/utils/stores";
    import { GAME_HEIGHT, GAME_WIDTH } from '$lib/utils/constants';
    import { loaded } from '$lib/utils/App';

    $: showRestartScreen = $lives < 1
</script>

{#if $loaded}
    <div class="absolute w-screen h-screen flex justify-center items-center">
        <div class={`w-[${GAME_WIDTH}px] h-${GAME_HEIGHT}px justify-center flex items-center`}>
            <div class="bottom-20 p-2 flex absolute flex-row">
                {#each Array.from({ length: $lives }, (_, i) => i + 1) as life}
                    <img src={heart} alt=''/>
                {/each}
                {#each Array.from({ length: $lostLives }, (_, i) => i + 1) as life}
                    <img src={greyheart} alt=''/>
                {/each}
            </div>

            {#if showRestartScreen}
                <div class="absolute bg-slate-700 p-8 alig">
                    <p>restart?</p>
                </div>
            {/if}
        </div>
    </div>
{/if}
