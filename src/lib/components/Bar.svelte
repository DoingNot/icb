<script lang="ts">
    import { Sprite } from 'pixi-svelte';
    import Matter from 'matter-js';
    import * as PIXI from 'pixi.js';
    import { DropShadowFilter } from '@pixi/filter-drop-shadow';

    import { tweened } from "svelte/motion";
    import { onMount } from "svelte";

    import { pixiApplication, loadedAssets } from '$lib/utils/App';
    import { world } from '$lib/utils/Engine';
    import { TWEEN_DURATION, BAR_WIDTH, BAR_HEIGHT, BLOCK_OFFSET, BAR_COLOR, GAME_WIDTH, GAME_HEIGHT, BAR_STROKE_COLOR, BAR_LINE_WIDTH, BAR_DROPSHADOW_OPTIONS, BAR_STARTING_Y, BAR_MAX_SKEW, BAR_WIDTH_PIXI, MOVE_AMOUNT, BAR_HEIGHT_PIXI } from '$lib/utils/constants';
    import { reset, lives, win, leftUpKey, leftDownKey, rightUpKey, rightDownKey, difficulty } from '$lib/utils/stores';
    import { getIsMobile } from '$lib/utils/utils';

    const isMobile = getIsMobile();

    let movementAmountModifier = 1

    const leftY = tweened(BAR_STARTING_Y, {
        duration: () => ($reset || $win ? 500 : TWEEN_DURATION),
    });

    const rightY = tweened(BAR_STARTING_Y, {
        duration: () => ($reset || $win ? 500 : TWEEN_DURATION),
    });

    $: barY = (($leftY + $rightY) / 2);
    const barX = GAME_WIDTH / 2;

    const barLeftX = BLOCK_OFFSET;
    $: barLeftY = $leftY - ($rightY - $leftY) / 95 - 23

    const barRightX = GAME_WIDTH - BLOCK_OFFSET;
    $: barRightY = $rightY - ($rightY - $leftY) / 95 - 23;

    let increaseLeftTimeoutId: number | undefined = undefined;
    let decreaseLeftTimeoutId: number | undefined = undefined;
    let increaseRightTimeoutId: number | undefined = undefined;
    let decreaseRightTimeoutId: number | undefined = undefined;

    let barRotation = 0;

    $: {
        barRotation = Math.atan2(BAR_WIDTH, $leftY - $rightY) - Math.PI/2;

        if(barBody) {
            Matter.Body.setPosition(barBody, {
                x: barX,
                y: barY
            });
            Matter.Body.setAngle(barBody, barRotation);
        }

        if(barLeft) {
            Matter.Body.setPosition(barLeft, {
                x: barLeftX,
                y: barLeftY
            })
        }

        // barLeftSprite?.position.set(barLeftX, barLeftY - 6)

        if(barRight) {
            Matter.Body.setPosition(barRight, {
                x: barRightX,
                y: barRightY
            })
        }

        // barRightSprite?.position.set(barRightX, barRightY - 6)
    }

    const increaseLeftY = async () => {
        if($rightY - $leftY > BAR_MAX_SKEW || $leftY < 20 || $reset || $win || $lives < 1) {
            return
        }
        leftY.set($leftY - (MOVE_AMOUNT * movementAmountModifier)); 
        if (increaseLeftTimeoutId !== undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
        }
    };

    const decreaseLeftY = async () => {
        if($leftY - $rightY > BAR_MAX_SKEW || $leftY > GAME_HEIGHT - 80 || $reset || $win || $lives < 1) {
            return
        }
        leftY.set($leftY + (MOVE_AMOUNT * movementAmountModifier)); 
        if (decreaseLeftTimeoutId !== undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
        }
    };

    const increaseRightY = async () => {
        if($leftY - $rightY > BAR_MAX_SKEW || $rightY < 20 || $reset || $win || $lives < 1) {
            return
        }
        rightY.set($rightY - (MOVE_AMOUNT * movementAmountModifier)); 
        if (increaseRightTimeoutId !== undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
        }
    };

    const decreaseRightY = async () => {
        if($rightY - $leftY > BAR_MAX_SKEW || $rightY > GAME_HEIGHT - 80 || $reset || $win || $lives < 1) {
            return
        }
        rightY.set($rightY + (MOVE_AMOUNT * movementAmountModifier));
        if (decreaseRightTimeoutId !== undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
        }
    };

    const keyDownHandler = async (event: KeyboardEvent) => {
        movementAmountModifier = 0.5
        if (event.key === $leftUpKey && increaseLeftTimeoutId === undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
            await increaseLeftY();
        }
        if (event.key === $leftDownKey && decreaseLeftTimeoutId === undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
            await decreaseLeftY();
        }
        if (event.key === $rightUpKey && increaseRightTimeoutId === undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
            await increaseRightY();
        }
        if (event.key === $rightDownKey && decreaseRightTimeoutId === undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
            await decreaseRightY();
        }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key === $leftUpKey) {
            clearTimeout(increaseLeftTimeoutId);
            increaseLeftTimeoutId = undefined;
        }
        if (event.key === $leftDownKey) {
            clearTimeout(decreaseLeftTimeoutId);
            decreaseLeftTimeoutId = undefined;
        }
        if (event.key === $rightUpKey) {
            clearTimeout(increaseRightTimeoutId);
            increaseRightTimeoutId = undefined;
        }
        if (event.key === $rightDownKey) {
            clearTimeout(decreaseRightTimeoutId);
            decreaseRightTimeoutId = undefined;
        }
    };

    const touchDownHandler = async (key: string) => {
        movementAmountModifier = 0.6
        if(key === 'leftUp' && increaseLeftTimeoutId === undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
            await increaseLeftY();
        }
        if (key === 'leftDown'&& decreaseLeftTimeoutId === undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
            await decreaseLeftY();
        }
        if (key === 'rightUp' && increaseRightTimeoutId === undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
            await increaseRightY();
        }
        if (key === 'rightDown' && decreaseRightTimeoutId === undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
            await decreaseRightY();
        }
    };

    const touchUpHandler = async (key: string) => {
        if (key === 'leftUp') {
            clearTimeout(increaseLeftTimeoutId);
            increaseLeftTimeoutId = undefined;
        }
        if (key === 'leftDown') {
            clearTimeout(decreaseLeftTimeoutId);
            decreaseLeftTimeoutId = undefined;
        }
        if (key === 'rightUp') {
            clearTimeout(increaseRightTimeoutId);
            increaseRightTimeoutId = undefined;
        }
        if (key === 'rightDown') {
            clearTimeout(decreaseRightTimeoutId);
            decreaseRightTimeoutId = undefined;
        }
    }
    
    

    let barBody: Matter.Body;
    let barLeft: Matter.Body;
    let barRight: Matter.Body;

    onMount(() => {
        barBody = Matter.Bodies.rectangle(
            barX,
            barY,
            BAR_WIDTH,
            BAR_HEIGHT * 3,
            {
                frictionAir: 0,
                isStatic: true,
                label: 'Bar',
                render: {
                    fillStyle: BAR_COLOR,
                    strokeStyle: BAR_STROKE_COLOR,
                    lineWidth: BAR_LINE_WIDTH
                }
            }
        );
        barLeft = Matter.Bodies.rectangle(
            barLeftX,
            barLeftY,
            BAR_WIDTH / 40,
            BAR_HEIGHT * 10,
            {
                isStatic: true,
                label: 'BarLeft',
                render: {
                    fillStyle: BAR_COLOR,
                    strokeStyle: BAR_STROKE_COLOR,
                    lineWidth: BAR_LINE_WIDTH
                }
            }
        );
        barRight = Matter.Bodies.rectangle(
            barRightX,
            barRightY,
            BAR_WIDTH / 40,
            BAR_HEIGHT * 10,
            {
                isStatic: true,
                label: 'BarLeft',
                render: {
                    fillStyle: BAR_COLOR,
                    strokeStyle: BAR_STROKE_COLOR,
                    lineWidth: BAR_LINE_WIDTH
                }
            }
        );

        Matter.World.add($world, [barLeft, barRight, barBody]);

        // barBodySprite.scale = { x: BAR_WIDTH_PIXI / 4, y: 0.6 / 4 };
        //
        // barLeftSprite = PIXI.Sprite.from(r.barBlock);
        // barLeftSprite.anchor.set(0.5);
        // barLeftSprite.scale = { x : 0.25, y: 0.25 }
        //
        // barRightSprite = PIXI.Sprite.from(r.barBlock);
        // barRightSprite.anchor.set(0.5)
        // barRightSprite.scale = { x : 0.25, y: 0.25 }
        //
        // const barContainer = new PIXI.Container();
        // barContainer.addChild(barBodySprite);
        // barContainer.addChild(barLeftSprite);
        // barContainer.addChild(barRightSprite);
        // barContainer.filters = [new DropShadowFilter(BAR_DROPSHADOW_OPTIONS)];
        // barContainer.zIndex = 999
        //
        // update()
        // $pixiApplication.stage.addChild(barContainer);

        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        // window.addEventListener('touchstart', (event) => { event.preventDefault(); }, { passive: false });
        window.addEventListener('touchmove', (event) => { event.preventDefault(); }, { passive: false });
        // window.addEventListener('touchend', (event) => { event.preventDefault(); }, { passive: false });
        window.addEventListener('dragstart', (event) => { event.preventDefault(); }, { passive: false });
        window.addEventListener('drag', (event) => { event.preventDefault(); }, { passive: false });

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
            clearTimeout(increaseLeftTimeoutId);
            clearTimeout(decreaseLeftTimeoutId);
            clearTimeout(increaseRightTimeoutId);
            clearTimeout(decreaseRightTimeoutId);
        };

    });

    $: if($reset || $win || !$difficulty) {
        leftY.set(BAR_STARTING_Y)
        rightY.set(BAR_STARTING_Y)
    }

</script>

<Sprite 
    key="bar"
    x={barX}
    y={barY + 38}
    anchor={0.5}
    width={BAR_WIDTH_PIXI}
    height={BAR_HEIGHT_PIXI}
    rotation={barRotation}
/>
<Sprite
    key="barblock"
    x={barLeftX}
    y={barLeftY}
/>
<Sprite
    key="barblock"
    x={barRightX}
    y={barRightY}
/>

{#if isMobile}
    <div class="absolute flex flex-row p-4 w-screen bottom-8 justify-between">
        <div class="flex flex-col h-full gap-2">
            <div class="flex justify-center content-center items-center w-24 h-16 bg-black/30 border border-black/30 z-40 left-0 bottom-28 rounded-md" 
                on:touchstart={() => touchDownHandler('leftUp')}
                on:dragenter={() => touchDownHandler('leftUp')}
                on:touchend={() => touchUpHandler('leftUp')}
                on:dragleave={() => touchUpHandler('leftUp')}
            >
                <div class="w-0 h-0 
                border-l-[15px] border-l-transparent
                border-b-[25px] border-b-black/50
                border-r-[15px] border-r-transparent">
                </div>
            </div>
            <div class="flex justify-center content-center items-center w-24 h-16 bg-black/30 border border-black/30 z-40 left-0 bottom-28 rounded-md" 
                on:touchstart={() => touchDownHandler('leftDown')}
                on:dragenter={() => touchDownHandler('leftDown')}
                on:touchend={() => touchUpHandler('leftDown')}
                on:dragleave={() => touchUpHandler('leftDown')}
            >
                <div class="w-0 h-0 
                border-l-[15px] border-l-transparent
                border-t-[25px] border-t-black/50
                border-r-[15px] border-r-transparent">
                </div>
            </div>
        </div>
        <div class="flex flex-col h-full gap-2">
            <div class="flex justify-center content-center items-center w-24 h-16 bg-black/30 border border-black/30 z-40 left-0 bottom-28 rounded-md" 
                on:touchstart={() => touchDownHandler('rightUp')}
                on:dragenter={() => touchDownHandler('rightUp')}
                on:touchend={() => touchUpHandler('rightUp')}
                on:dragleave={() => touchUpHandler('rightUp')}
            >
                <div class="w-0 h-0 
                border-l-[15px] border-l-transparent
                border-b-[25px] border-b-black/50
                border-r-[15px] border-r-transparent">
                </div>
            </div>
            <div class="flex justify-center content-center items-center w-24 h-16 bg-black/30 border border-black/30 z-40 left-0 bottom-28 rounded-md" 
                on:touchstart={() => touchDownHandler('rightDown')}
                on:dragenter={() => touchDownHandler('rightDown')}
                on:touchend={() => touchUpHandler('rightDown')}
                on:dragleave={() => touchUpHandler('rightDown')}
            >
                <div class="w-0 h-0 
                border-l-[15px] border-l-transparent
                border-t-[25px] border-t-black/50
                border-r-[15px] border-r-transparent">
                </div>
            </div>
        </div>
    </div>
{/if}
