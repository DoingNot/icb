export interface HoleInfo {
    HoleIndex: number,
    HoleX: number,
    HoleY: number,
}

export interface LoseHoleConfig {
    index: number,
    x: number,
    y: number,
    size: number,
}

export interface WinHoleConfig {
    winLevel: number,
    x: number,
    y: number,
    size: number,
}

export interface GameLevel {
    loseHoles: LoseHoleConfig[]
    winHoles: WinHoleConfig[]
}
