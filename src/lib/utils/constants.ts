import ball from '../assets/ball.png'
import bar from '../assets/bar.png'
import barBlock from '../assets/barblock.png'
import loseHole from '../assets/losehole.png'
import winHole from '../assets/winhole.png'
import winHoleInactive from '../assets/winholeinactive.png'

export const GAME_WIDTH = 620
export const GAME_HEIGHT = 900
export const MIN_HOLE_POSITION_X = 70
export const MAX_HOLE_POSITION_X = GAME_WIDTH - MIN_HOLE_POSITION_X
export const MAX_HOLE_POSITION_Y = GAME_HEIGHT - 220
export const MIN_HOLE_POSITION_Y = 80
export const MIN_LOSE_HOLE_SIZE = 24
export const MAX_LOSE_HOLE_SIZE = 32
export const WIN_HOLES_COUNT = 10

export const EASY_HOLES_COUNT = 15
export const NORMAL_HOLES_COUNT = 25
export const HARD_HOLES_COUNT = 40
export const EXTREME_HOLES_COUNT = 60

export const BACKGROUND_COLOR = '#D19E11'

export const KEY_LEFT_UP = 'w'
export const KEY_LEFT_DOWN = 's'
export const KEY_RIGHT_UP = 'o'
export const KEY_RIGHT_DOWN = 'l'

export const TWEEN_DURATION = 5

export const BAR_STARTING_Y = GAME_HEIGHT - 100
export const BAR_MAX_SKEW = 200
export const BAR_WIDTH = 580
export const BAR_HEIGHT = 8
export const BLOCK_OFFSET = 10
export const BAR_COLOR = '#BFBCB3'
export const BAR_STROKE_COLOR = '#464542'
export const BAR_LINE_WIDTH = 3
export const BAR_DROPSHADOW_OPTIONS = {
    'alpha': 0.65,
    'blur': 3,
    'color': 0x1A160A,
    'offset': { x: 0, y: 10 },
    'quality': 10
}

export const BALL_SIZE = 18
export const BALL_SIZE_PIXI = BALL_SIZE / 26
export const BALL_STARTING_X = GAME_WIDTH / 2
export const BALL_STARTING_Y = GAME_HEIGHT - 180
export const BALL_COLOR = '#BFBCB3'
export const BALL_STROKE_COLOR = '#464542'
export const BALL_LINE_WIDTH = 3
export const BALL_DROPSHADOW_OPTIONS = {
    'alpha': 0.65,
    'color': 0x1A160A,
    'offset': { x: 0, y: 9 },
    'quality': 10
}

export const ASSETS_DATA = [
    { alias: 'ball', src: ball },
    { alias: 'barBody', src: bar },
    { alias: 'barBlock', src: barBlock },
    { alias: 'loseHole', src: loseHole },
    { alias: 'winHole', src: winHole },
    { alias: 'winHoleInactive', src: winHoleInactive }
]
