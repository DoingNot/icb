<script lang="ts">
    import { blur } from 'svelte/transition';
    import heart from '../assets/heart.png'
    import greyheart from '../assets/greyheart.png'
    import { lives, lostLives, level, difficulty, holesContainer, config } from "$lib/utils/stores";
    import { EASY_HOLES_COUNT, EXTREME_HOLES_COUNT, GAME_HEIGHT, GAME_WIDTH, HARD_HOLES_COUNT, NORMAL_HOLES_COUNT } from '$lib/utils/constants';
    import { loaded, pixiApplication } from '$lib/utils/App';
    import { world } from '$lib/utils/Engine';
    import Matter from 'matter-js';

    $: showRestartScreen = $lives < 1
    let difficultyText: string;

    const restartGame = () => {
        level.set(1)
        lives.set(3)
    }

    const resetBoard = () => {
        level.set(1)
        lives.set(3)
        difficulty.set(0)
        $holesContainer.removeChildren();
        Matter.Composite.remove($world, $world.bodies.filter((body: Matter.Body) => body.label.split('_').some((v: string) => ['loseHole', 'winHole'].includes(v))))
    }
    
    const setDifficulty = (difficultyName: string, numHoles: number) => {
        difficultyText = difficultyName;
        difficulty.set(numHoles);
    }

    $: if($level === 11) {
        resetBoard()
        level.set(1)
        lives.set(3)
    }

</script>

{#if $loaded}
    <div class="absolute w-screen h-screen flex justify-center items-center z-50">
        <div class={`w-[${GAME_WIDTH}px] h-${GAME_HEIGHT}px justify-center flex items-center`}>
            <div class="bottom-10 flex absolute flex-col gap-1 justify-center items-center">
                <h1 class="h1 font-bold text-center cursor-default hover:cursor-pointer" on:click={() => resetBoard()}>Level: {$level} | Difficulty: {difficultyText ?? 'hi :)'}</h1>
                <div class="flex flex-row gap-1">
                    {#each Array.from({ length: $lives }, (_, i) => i + 1) as _life}
                        <img src={heart} alt=''/>
                    {/each}
                    {#each Array.from({ length: $lostLives }, (_, i) => i + 1) as _life}
                        <img src={greyheart} alt=''/>
                    {/each}
                </div>
            </div>

            {#if showRestartScreen}
                <div class="absolute w-screen h-screen bg-gray-950/50 backdrop-blur-sm z-40" transition:blur={{ delay: 100, duration: 450 }}/>
                <div class="flex flex-col justify-between absolute bg-[#1b1b1c] rounded-xl p-8 align-center w-[280px] h-[180px] z-50" transition:blur={{ delay: 200, duration: 450 }}>
                    <h1 class="h1 font-bold text-2xl text-slate-200 text-center">Game Over</h1>
                    <button class="bg-[#2c2c2e]" type="button" on:click={restartGame}>Restart</button>
                </div>
            {/if}

            {#if !$difficulty || $level === 11}
                <div class="absolute w-screen h-screen bg-gray-950/50 backdrop-blur-sm z-40" transition:blur={{ delay: 20, duration: 250 }}/>
                <div class="flex flex-col justify-between absolute bg-[#1b1b1c] rounded-xl p-8 align-center w-[480px] h-[180px] z-50" transition:blur={{ delay: 20, duration: 150 }}>
                    <h1 class="h1 font-bold text-2xl text-slate-200 text-center">{$level === 11 ? 'You Won! Play Again?' : 'Select Difficulty'}</h1>
                    <div class="flex flex-row gap-2">
                        <button class="bg-[#2c2c2e] w-32" type="button" on:click={() => setDifficulty('Easy', EASY_HOLES_COUNT)}>Easy</button>
                        <button class="bg-[#2c2c2e] w-32" type="button" on:click={() => setDifficulty('Normal', NORMAL_HOLES_COUNT)}>Normal</button>
                        <button class="bg-[#2c2c2e] w-32" type="button" on:click={() => setDifficulty('Hard', HARD_HOLES_COUNT)}>Hard</button>
                        <button class="bg-[#2c2c2e] w-32" type="button" on:click={() => setDifficulty('Extreme', EXTREME_HOLES_COUNT)}>Extreme</button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

