<script lang="ts">
    import { blur } from 'svelte/transition';
    import heart from '../assets/heart.png'
    import greyheart from '../assets/greyheart.png'
    import { lives, lostLives, level, difficulty, holesContainer, gameWon, leftUpKey, leftDownKey, rightUpKey, rightDownKey } from "$lib/utils/stores";
    import { DEFAULT_KEY_LEFT_DOWN, DEFAULT_KEY_LEFT_UP, DEFAULT_KEY_RIGHT_DOWN, DEFAULT_KEY_RIGHT_UP, EASY_HOLES_COUNT, EXTREME_HOLES_COUNT, GAME_HEIGHT, GAME_WIDTH, HARD_HOLES_COUNT, NORMAL_HOLES_COUNT, WIN_HOLES_COUNT } from '$lib/utils/constants';
    import { loaded } from '$lib/utils/App';
    import { world } from '$lib/utils/Engine';
    import Matter from 'matter-js';

    let leftUpInput: string;
    let leftDownInput: string;
    let rightUpInput: string;
    let rightDownInput: string;

    $: if(leftUpInput) {
        if([$leftDownKey, $rightUpKey, $rightDownKey].includes(leftUpInput)) leftUpInput = ''
        leftUpInput = leftUpInput.replace(/[^a-z0-9]/g, '')
        leftUpKey.set(leftUpInput)
    }

    $: if(leftDownInput) {
        if([$leftUpKey, $rightUpKey, $rightDownKey].includes(leftDownInput)) leftDownInput = ''
        leftDownInput = leftDownInput.replace(/[^a-z0-9]/g, '')
        leftDownKey.set(leftDownInput)
    }

    $: if(rightUpInput) {
        if([$rightDownKey, $leftUpKey, $leftDownKey].includes(rightUpInput)) rightUpInput = ''
        rightUpInput = rightUpInput.replace(/[^a-z0-9]/g, '')
        rightUpKey.set(rightUpInput)
    }

    $: if(rightDownInput) {
        if([$leftDownKey, $rightUpKey, $leftUpKey].includes(rightDownInput)) rightDownInput = ''
        rightDownInput = rightDownInput.replace(/[^a-z0-9]/g, '')
        rightDownKey.set(rightDownInput)
    }

    $: showRestartScreen = $lives < 1
    let showOptions = true
    let difficultyText: string;

    const restartGame = () => {
        level.set(1)
        lives.set(3)
    }

    const resetBoard = () => {
        if(!$leftUpKey) leftUpKey.set(DEFAULT_KEY_LEFT_UP)
        if(!$leftDownKey) leftDownKey.set(DEFAULT_KEY_LEFT_DOWN)
        if(!$rightUpKey) rightUpKey.set(DEFAULT_KEY_RIGHT_UP)
        if(!$rightDownKey) rightDownKey.set(DEFAULT_KEY_RIGHT_DOWN)

        level.set(1)
        lives.set(3)
        difficulty.set(0)
        $holesContainer.removeChildren();
        Matter.Composite.remove($world, $world.bodies.filter((body: Matter.Body) => body.label.split('_').some((v: string) => ['loseHole', 'winHole'].includes(v))))
    }
    
    const setDifficulty = (difficultyName: string, numHoles: number) => {
        resetBoard()
        difficultyText = difficultyName;
        setTimeout(() => difficulty.set(numHoles), 1);
        gameWon.set(false)
        showOptions = false
    }

    $: if($level === WIN_HOLES_COUNT + 1) {
        gameWon.set(true)
        showOptions = true
        resetBoard()
    }

</script>

{#if $loaded}
    <div class="absolute w-full h-full flex justify-center items-center overflow-hidden">
        <div class={`w-[${GAME_WIDTH}px] h-${GAME_HEIGHT}px justify-center flex items-center`}>
            <div class="bottom-4 sm:bottom-12 flex absolute flex-row sm:flex-col gap-2 sm:gap-1 justify-center items-center select-none">
                <h1 class="h1 text-sm sm:text-md text-slate-300 md:text-gray-900 font-bold text-center cursor-default hover:cursor-pointer" on:click={() => showOptions = true}>Level: {$level} | Difficulty: {difficultyText ?? 'hi :)'}</h1>
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
                <div class="absolute w-full h-full bg-gray-950/50 backdrop-blur-sm z-40" transition:blur={{ delay: 100, duration: 450 }}/>
                <div class="flex flex-col justify-between absolute bg-[#1b1b1c] rounded-xl p-8 align-center w-[280px] h-[180px] z-50" transition:blur={{ delay: 200, duration: 450 }}>
                    <h1 class="h1 font-bold text-2xl text-slate-200 text-center">Game Over</h1>
                    <button class="bg-[#2c2c2e]" type="button" on:click={restartGame}>Restart</button>
                </div>
            {/if}

            {#if showOptions}
                <div class="absolute w-full h-full bg-gray-950/50 backdrop-blur-sm z-40 overflow-hidden" on:click={() => showOptions = false} transition:blur={{ delay: 20, duration: 250 }}/>
                <div class="flex flex-col absolute w-full h-full gap-4 overflow-hidden justify-center items-center">
                    <div class="flex flex-col justify-center gap-4 bg-[#1b1b1c] rounded-xl p-4 md:p-8 align-center w-3/4 md:w-[500px] z-50" transition:blur={{ delay: 20, duration: 150 }}>
                        <h1 class="h1 font-bold text-2xl text-slate-200 text-center">{$gameWon ? 'You Won! Play Again?' : 'Difficulty'}</h1>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => setDifficulty('Easy', EASY_HOLES_COUNT)}>Easy</button>
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => setDifficulty('Normal', NORMAL_HOLES_COUNT)}>Normal</button>
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => setDifficulty('Hard', HARD_HOLES_COUNT)}>Hard</button>
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => setDifficulty('Extreme', EXTREME_HOLES_COUNT)}>Extreme</button>
                        </div>
                    </div>
                    <div class="flex flex-col justify-center bg-[#1b1b1c] rounded-xl p-4 md:p-8 align-center w-3/4 md:w-[500px] gap-4 z-50" transition:blur={{ delay: 20, duration: 150 }}>
                        <h1 class="h1 font-bold text-2xl text-slate-200 text-center">Options</h1>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => {leftUpKey.set(''); leftUpInput=''}}>
                                <div class="flex flex-col h-full justify-center">
                                    <p class="text-xs text-slate-300">Left Up</p>
                                    {#if $leftUpKey}
                                        <p>{$leftUpKey}</p>
                                    {:else}
                                        <input class="peer flex h-6 w-full justify-center bg-transparent pt-4 pb-1.5 font-sans text-center text-sm font-normal text-blue-gray-700 outline outline-0 transition-all" type="text" bind:value={leftUpInput} autofocus/>
                                    {/if}
                                </div>
                            </button>
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => {leftDownKey.set(''); leftDownInput=''}}>
                                <div class="flex flex-col h-full justify-center">
                                    <p class="text-xs text-slate-300">Left Down</p>
                                    {#if $leftDownKey}
                                        <p>{$leftDownKey}</p>
                                    {:else}
                                        <input class="peer flex h-6 w-full justify-center bg-transparent pt-4 pb-1.5 font-sans text-center text-sm font-normal text-blue-gray-700 outline outline-0 transition-all" type="text" bind:value={leftDownInput} autofocus/>
                                    {/if}
                                </div>
                            </button>
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => {rightUpKey.set(''); rightUpInput=''}}>
                                <div class="flex flex-col h-full justify-center">
                                    <p class="text-xs text-slate-300">Right Up</p>
                                    {#if $rightUpKey}
                                        <p>{$rightUpKey}</p>
                                    {:else}
                                        <input class="peer flex h-6 w-full justify-center bg-transparent pt-4 pb-1.5 font-sans text-center text-sm font-normal text-blue-gray-700 outline outline-0 transition-all" type="text" bind:value={rightUpInput} autofocus/>
                                    {/if}
                                </div>
                            </button>
                            <button class="bg-[#2c2c2e]" type="button" on:click={() => {rightDownKey.set(''); rightDownInput=''}}>
                                <div class="flex flex-col h-full justify-center">
                                    <p class="text-xs text-slate-300">Right Down</p>
                                    {#if $rightDownKey}
                                        <p>{$rightDownKey}</p>
                                    {:else}
                                        <input class="peer flex h-6 w-full justify-center bg-transparent pt-4 pb-1.5 font-sans text-center text-sm font-normal text-blue-gray-700 outline outline-0 transition-all" type="text" bind:value={rightDownInput} autofocus/>
                                    {/if}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}

