import { createAsset } from 'pixi-svelte';
import ballSprite from './ball.png';
import barSprite from './bar.png';
import barblockSprite from './barblock.png';
import loseholeSprite from './losehole.png';
import winholeSprite from './winhole.png';
import winholeinactiveSprite from './winholeinactive.png';

const ball = createAsset({ img: ballSprite });
const bar = createAsset({ img: barSprite });
const barblock = createAsset({ img: barblockSprite });
const losehole = createAsset({ img: loseholeSprite });
const winhole = createAsset({ img: winholeSprite });
const winholeinactive = createAsset({ img: winholeinactiveSprite });

export default {
    ball,
    bar,
    barblock,
    losehole,
    winhole,
    winholeinactive
}
