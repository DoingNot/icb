<script lang="ts">
    import Matter from 'matter-js';
    import * as PIXI from 'pixi.js';
    import { pixiApplication } from '$lib/utils/game/App';
    import { tweened } from "svelte/motion";
    import { onMount } from "svelte";
    import { world } from '$lib/utils/game/Engine';
    import { TWEEN_DURATION, BAR_WIDTH, BAR_HEIGHT, BLOCK_OFFSET, BAR_COLOR, KEY_LEFT_UP, KEY_LEFT_DOWN, KEY_RIGHT_UP, KEY_RIGHT_DOWN, GAME_WIDTH, GAME_HEIGHT, BAR_STROKE_COLOR, BAR_LINE_WIDTH } from './constants'
    import barImage from '../../assets/bar.png'


    const leftY = tweened(GAME_HEIGHT - 100, {
        duration: TWEEN_DURATION,
    });

    const rightY = tweened(GAME_HEIGHT - 100, {
        duration: TWEEN_DURATION,
    });

    let increaseLeftTimeoutId: number | undefined = undefined;
    let decreaseLeftTimeoutId: number | undefined = undefined;
    let increaseRightTimeoutId: number | undefined = undefined;
    let decreaseRightTimeoutId: number | undefined = undefined;

    const updateBody = () => {
        Matter.Body.setPosition(barBody, {
            x: GAME_WIDTH / 2,
            y: ($leftY + $rightY) / 2,
        });
        Matter.Body.setAngle(barBody, barRotation);

        barBodySprite.position.set(GAME_WIDTH / 2, ($leftY + $rightY) / 2)
        barBodySprite.rotation = barRotation

        Matter.Body.setPosition(barLeft, {
            x: GAME_WIDTH / 2 - BAR_WIDTH / 2 + BLOCK_OFFSET,
            y: $leftY - BLOCK_OFFSET / 2 + ($rightY - $leftY) / 13
        })
        Matter.Body.setPosition(barRight, {
            x: GAME_WIDTH / 2 + BAR_WIDTH / 2 - BLOCK_OFFSET,
            y: $rightY - BLOCK_OFFSET / 2 - ($rightY - $leftY) / 13
        })
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
    let barLeftRect: PIXI.Graphics
    let barRightRect: PIXI.Graphics

    onMount(() => {
        barBody = Matter.Bodies.rectangle(
            GAME_WIDTH / 2,
            ($leftY + $rightY) / 2,
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
            GAME_WIDTH / 2 - BAR_WIDTH / 2 + BLOCK_OFFSET,
            $leftY - BLOCK_OFFSET / 2 + ($rightY - $leftY) / 13,
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
            GAME_WIDTH / 2 + BAR_WIDTH / 2 - BLOCK_OFFSET,
            $rightY - BLOCK_OFFSET / 2 - ($rightY - $leftY) / 13,
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

        PIXI.Assets.load(barImage).then((r) => {
            barBodySprite = PIXI.Sprite.from(r);
            barBodySprite.anchor.set(0.5)
            barBodySprite.scale = { x: 1.1, y: 0.6 }
            updateBody()
            $pixiApplication.stage.addChild(barBodySprite)
        })

        barLeftRect = new PIXI.Graphics()
            .beginFill(0xFFFF00)
            .drawRect(GAME_WIDTH / 2 - BAR_WIDTH / 2 + BLOCK_OFFSET, $leftY - BLOCK_OFFSET / 2 + ($rightY - $leftY) / 13, BAR_WIDTH / 40, BAR_HEIGHT * 5)
            .endFill();

        barLeftRect.pivot.set(BAR_WIDTH/2, BAR_HEIGHT/2)

        $pixiApplication.stage.addChild(barLeftRect)

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
