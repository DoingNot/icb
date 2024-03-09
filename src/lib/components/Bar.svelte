<script lang="ts">
    import Matter from 'matter-js';
    import * as PIXI from 'pixi.js';
    import { DropShadowFilter } from '@pixi/filter-drop-shadow';
    import { pixiApplication } from '$lib/utils/App';
    import { tweened } from "svelte/motion";
    import { onMount } from "svelte";
    import { world } from '$lib/utils/Engine';
    import { TWEEN_DURATION, BAR_WIDTH, BAR_HEIGHT, BLOCK_OFFSET, BAR_COLOR, KEY_LEFT_UP, KEY_LEFT_DOWN, KEY_RIGHT_UP, KEY_RIGHT_DOWN, GAME_WIDTH, GAME_HEIGHT, BAR_STROKE_COLOR, BAR_LINE_WIDTH, BAR_DROPSHADOW_OPTIONS } from '$lib/utils/constants';
    import barImage from '../assets/bar.png';
    import barBlockImage from '../assets/barblock.png';

    const leftY = tweened(GAME_HEIGHT - 100, {
        duration: TWEEN_DURATION,
    });

    const rightY = tweened(GAME_HEIGHT - 100, {
        duration: TWEEN_DURATION,
    });

    $: barY = (($leftY + $rightY) / 2);
    const barX = GAME_WIDTH / 2;

    const barLeftX = barX - BAR_WIDTH / 2 + BLOCK_OFFSET;
    $: barLeftY = $leftY - BLOCK_OFFSET / 8 + ($rightY - $leftY) / 20 - 23

    const barRightX = barX + BAR_WIDTH / 2 - BLOCK_OFFSET;
    $: barRightY = $rightY - BLOCK_OFFSET / 8 - ($rightY - $leftY) / 20 - 23;

    let increaseLeftTimeoutId: number | undefined = undefined;
    let decreaseLeftTimeoutId: number | undefined = undefined;
    let increaseRightTimeoutId: number | undefined = undefined;
    let decreaseRightTimeoutId: number | undefined = undefined;

    const updateBody = () => {
        Matter.Body.setPosition(barBody, {
            x: barX,
            y: barY
        });
        Matter.Body.setAngle(barBody, barRotation);

        barBodySprite?.position.set(barX, barY)
        barBodySprite.rotation = barRotation

        Matter.Body.setPosition(barLeft, {
            x: barLeftX,
            y: barLeftY
        })

        barLeftSprite?.position.set(barLeftX, barLeftY)

        Matter.Body.setPosition(barRight, {
            x: barRightX,
            y: barRightY
        })

        barRightSprite?.position.set(barRightX, barRightY)
    }

    const increaseLeftY = async () => {
        if($rightY - $leftY > 150 || $leftY < 100) {
            return
        }
        leftY.set($leftY - 3);
        if (increaseLeftTimeoutId !== undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
        }
        updateBody()
    };

    const decreaseLeftY = async () => {
        if($leftY - $rightY > 150 || $leftY > GAME_HEIGHT - 80) {
            return
        }
        leftY.set($leftY + 3);
        if (decreaseLeftTimeoutId !== undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
        }
        updateBody()
    };

    const increaseRightY = async () => {
        if($leftY - $rightY > 150 || $rightY < 100) {
            return
        }
        rightY.set($rightY - 3);
        if (increaseRightTimeoutId !== undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
        }
        updateBody()
    };

    const decreaseRightY = async () => {
        if($rightY - $leftY > 150 || $rightY > GAME_HEIGHT - 80) {
            return
        }
        rightY.set($rightY + 3);
        if (decreaseRightTimeoutId !== undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
        }
        updateBody()
    };

    const keyDownHandler = async (event: KeyboardEvent) => {
        if (event.key === KEY_LEFT_UP && increaseLeftTimeoutId === undefined) {
            increaseLeftTimeoutId = setTimeout(increaseLeftY, 0);
            await increaseLeftY();
        }
        if (event.key === KEY_LEFT_DOWN && decreaseLeftTimeoutId === undefined) {
            decreaseLeftTimeoutId = setTimeout(decreaseLeftY, 0);
            await decreaseLeftY();
        }
        if (event.key === KEY_RIGHT_UP && increaseRightTimeoutId === undefined) {
            increaseRightTimeoutId = setTimeout(increaseRightY, 0);
            await increaseRightY();
        }
        if (event.key === KEY_RIGHT_DOWN && decreaseRightTimeoutId === undefined) {
            decreaseRightTimeoutId = setTimeout(decreaseRightY, 0);
            await decreaseRightY();
        }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.key === KEY_LEFT_UP) {
            clearTimeout(increaseLeftTimeoutId);
            increaseLeftTimeoutId = undefined;
        }
        if (event.key === KEY_LEFT_DOWN) {
            clearTimeout(decreaseLeftTimeoutId);
            decreaseLeftTimeoutId = undefined;
        }
        if (event.key === KEY_RIGHT_UP) {
            clearTimeout(increaseRightTimeoutId);
            increaseRightTimeoutId = undefined;
        }
        if (event.key === KEY_RIGHT_DOWN) {
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
            BAR_HEIGHT,
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

        PIXI.Assets.add({ alias: 'barBody', src: barImage });
        PIXI.Assets.add({ alias: 'barBlock', src: barBlockImage });

        PIXI.Assets.load(['barBody', 'barBlock']).then((r) => {

            barBodySprite = PIXI.Sprite.from(r.barBody);
            barBodySprite.anchor.set(0.5)
            barBodySprite.scale = { x: 1.2, y: 0.6 }

            barLeftSprite = PIXI.Sprite.from(r.barBlock);
            barLeftSprite.anchor.set(0.5)

            barRightSprite = PIXI.Sprite.from(r.barBlock);
            barRightSprite.anchor.set(0.5)

            const barContainer = new PIXI.Container();
            barContainer.addChild(barBodySprite);
            barContainer.addChild(barLeftSprite);
            barContainer.addChild(barRightSprite);
            barContainer.filters = [new DropShadowFilter(BAR_DROPSHADOW_OPTIONS)];

            updateBody()
            $pixiApplication.stage.addChild(barContainer);
        })

        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
            clearTimeout(increaseLeftTimeoutId);
            clearTimeout(decreaseLeftTimeoutId);
            clearTimeout(increaseRightTimeoutId);
            clearTimeout(decreaseRightTimeoutId);
        };
    });

</script>
