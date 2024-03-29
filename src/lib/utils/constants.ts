import ball from '../assets/ball.png'
import bar from '../assets/bar.png'
import barBlock from '../assets/barblock.png'
import loseHole from '../assets/losehole.png'
import winHole from '../assets/winhole.png'
import winHoleInactive from '../assets/winholeinactive.png'
import { getGameDimensions, getIsMobile } from './utils'

const { width, height } = getGameDimensions()
const isMobile = getIsMobile()
const mobileRatio = isMobile ? 0.75 : 0.9

export const GAME_WIDTH = width
export const GAME_HEIGHT = height
export const MIN_HOLE_POSITION_X = isMobile ? 30 : 40
export const MAX_HOLE_POSITION_X = GAME_WIDTH - MIN_HOLE_POSITION_X
export const MAX_HOLE_POSITION_Y = GAME_HEIGHT - 220
export const MIN_HOLE_POSITION_Y = 80
export const MIN_LOSE_HOLE_SIZE = 24 * mobileRatio
export const MAX_LOSE_HOLE_SIZE = 32 * mobileRatio
export const WIN_HOLES_COUNT = 10

export const EASY_HOLES_COUNT = 30
export const NORMAL_HOLES_COUNT = 50
export const HARD_HOLES_COUNT = 70
export const EXTREME_HOLES_COUNT = 90

export const BACKGROUND_COLOR = '#D19E11'

export const DEFAULT_KEY_LEFT_UP = 'w'
export const DEFAULT_KEY_LEFT_DOWN = 's'
export const DEFAULT_KEY_RIGHT_UP = 'o'
export const DEFAULT_KEY_RIGHT_DOWN = 'l'

export const TWEEN_DURATION = 5
export const MOVE_AMOUNT = 5

export const BAR_STARTING_Y = GAME_HEIGHT - 100
export const BAR_MAX_SKEW = 200
export const BAR_WIDTH = GAME_WIDTH * 0.98
export const BAR_WIDTH_PIXI = BAR_WIDTH / 326
export const BAR_HEIGHT = 8
export const BLOCK_OFFSET = 13
export const BAR_COLOR = '#BFBCB3'
export const BAR_STROKE_COLOR = '#464542'
export const BAR_LINE_WIDTH = 3
export const BAR_DROPSHADOW_OPTIONS = {
    'alpha': 0.65,
    'blur': 2,
    'color': 0x1A160A,
    'offset': { x: 0, y: 10 },
    'quality':5 
}

export const BALL_SIZE = 18 * mobileRatio
export const BALL_SIZE_PIXI = BALL_SIZE / 104
export const BALL_STARTING_X = GAME_WIDTH / 2
export const BALL_STARTING_Y = GAME_HEIGHT - 180
export const BALL_COLOR = '#BFBCB3'
export const BALL_STROKE_COLOR = '#464542'
export const BALL_LINE_WIDTH = 3
export const BALL_DROPSHADOW_OPTIONS = {
    'alpha': 0.35,
    'color': 0x1A160A,
    'offset': { x: 0, y: 6 },
    'quality': 5,
    'blur': 1
}

export const ASSETS_DATA = [
    { alias: 'ball', src: ball },
    { alias: 'barBody', src: bar },
    { alias: 'barBlock', src: barBlock },
    { alias: 'loseHole', src: loseHole },
    { alias: 'winHole', src: winHole },
    { alias: 'winHoleInactive', src: winHoleInactive }
]
