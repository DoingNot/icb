<script lang="ts">
    import Matter from 'matter-js';
    import * as PIXI from 'pixi.js';
    import { DropShadowFilter } from '@pixi/filter-drop-shadow';

    import { tweened } from "svelte/motion";
    import { onMount } from "svelte";

    import { pixiApplication, loadedAssets } from '$lib/utils/App';
    import { world } from '$lib/utils/Engine';
    import { TWEEN_DURATION, BAR_WIDTH, BAR_HEIGHT, BLOCK_OFFSET, BAR_COLOR, GAME_WIDTH, GAME_HEIGHT, BAR_STROKE_COLOR, BAR_LINE_WIDTH, BAR_DROPSHADOW_OPTIONS, BAR_STARTING_Y, BAR_MAX_SKEW } from '$lib/utils/constants';
    import { reset, lives, win, leftUpKey, leftDownKey, rightUpKey, rightDownKey, difficulty } from '$lib/utils/stores';

    const leftY = tweened(BAR_STARTING_Y, {
        duration: () => ($reset || $win ? 500 : TWEEN_DURATION),
    });

    const rightY = tweened(BAR_STARTING_Y, {
        duration: () => ($reset || $win ? 500 : TWEEN_DURATION),
    });

    $: barY = (($leftY + $rightY) / 2);
    const barX = GAME_WIDTH / 2;

    const barLeftX = barX - BAR_WIDTH / 2 + BLOCK_OFFSET;
    $: barLeftY = $leftY - BLOCK_OFFSET / 8 + ($rightY - $leftY) / 20 - 22

    const barRightX = barX + BAR_WIDTH / 2 - BLOCK_OFFSET;
    $: barRightY = $rightY - BLOCK_OFFSET / 8 - ($rightY - $leftY) / 20 - 22;

    let increaseLeftTimeoutId: number | undefined = undefined;
    let decreaseLeftTimeoutId: number | undefined = undefined;
    let increaseRightTimeoutId: number | undefined = undefined;
    let decreaseRightTimeoutId: number | undefined = undefined;

    const update = () => {
        Matter.Body.setPosition(barBody, {
            x: barX,
            y: barY
        });
        Matter.Body.setAngle(barBody, barRotation);

        if(barBodySprite) {
            barBodySprite?.position.set(barX, barY - 6)
            barBodySprite.rotation = barRotation
        }

        Matter.Body.setPosition(barLeft, {
            x: barLeftX,
            y: barLeftY
        })

        barLeftSprite?.position.set(barLeftX, barLeftY - 6)

        Matter.Body.setPosition(barRight, {
            x: barRightX,
            y: barRightY
        })

        barRightSprite?.position.set(barRightX, barRightY - 6)
    }

    const increaseLeftY = async () => {
        if($rightY - $leftY > BAR_MAX_SKEW || $leftY < 20 || $reset || $win || $lives < 1) {
            return
        }
        leftY.set($leftY - 3);
        if (increaseLeftTimeoutId !== undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
        }
    };

    const decreaseLeftY = async () => {
        if($leftY - $rightY > BAR_MAX_SKEW || $leftY > GAME_HEIGHT - 80 || $reset || $win || $lives < 1) {
            return
        }
        leftY.set($leftY + 3);
        if (decreaseLeftTimeoutId !== undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
        }
    };

    const increaseRightY = async () => {
        if($leftY - $rightY > BAR_MAX_SKEW || $rightY < 20 || $reset || $win || $lives < 1) {
            return
        }
        rightY.set($rightY - 3);
        if (increaseRightTimeoutId !== undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
        }
    };

    const decreaseRightY = async () => {
        if($rightY - $leftY > BAR_MAX_SKEW || $rightY > GAME_HEIGHT - 80 || $reset || $win || $lives < 1) {
            return
        }
        rightY.set($rightY + 3);
        if (decreaseRightTimeoutId !== undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
        }
    };

    const keyDownHandler = async (event: KeyboardEvent) => {
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

    $: barRotation = Math.atan2(BAR_WIDTH, $leftY - $rightY) - Math.PI/2;

    let barBody: Matter.Body;
    let barLeft: Matter.Body;
    let barRight: Matter.Body;
    let barBodySprite: PIXI.Sprite
    let barLeftSprite: PIXI.Sprite
    let barRightSprite: PIXI.Sprite

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
            BAR_HEIGHT * 5,
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
            BAR_HEIGHT * 5,
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

        const r = $loadedAssets

        barBodySprite = PIXI.Sprite.from(r.barBody);
        barBodySprite.anchor.set(0.5)
        barBodySprite.scale = { x: 1.8, y: 0.6 }

        barLeftSprite = PIXI.Sprite.from(r.barBlock);
        barLeftSprite.anchor.set(0.5)

        barRightSprite = PIXI.Sprite.from(r.barBlock);
        barRightSprite.anchor.set(0.5)

        const barContainer = new PIXI.Container();
        barContainer.addChild(barBodySprite);
        barContainer.addChild(barLeftSprite);
        barContainer.addChild(barRightSprite);
        barContainer.filters = [new DropShadowFilter(BAR_DROPSHADOW_OPTIONS)];
        barContainer.zIndex = 999

        update()
        $pixiApplication.stage.addChild(barContainer);

        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);

        const updateLoop = setInterval(update, 1000 / 60)

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
            clearTimeout(increaseLeftTimeoutId);
            clearTimeout(decreaseLeftTimeoutId);
            clearTimeout(increaseRightTimeoutId);
            clearTimeout(decreaseRightTimeoutId);
            clearInterval(updateLoop)
        };

    });

    $: if($reset || $win || !$difficulty) {
        leftY.set(BAR_STARTING_Y)
        rightY.set(BAR_STARTING_Y)
    }

</script>
