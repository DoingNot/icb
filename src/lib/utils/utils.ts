export const DEVICE_RATIO = (window && window.devicePixelRatio) || 1;

export function getIsMobile() {
    return window.innerWidth < 680
}

export function getGameDimensions(): {width: number; height: number} {
    const isMobile = getIsMobile()
    const height = window.innerHeight * 0.95

    if(isMobile) {
        return {
            width: window.innerWidth * 0.95,
            height: window.innerHeight * 0.90,
        }
    }

    return {
        width: window.innerHeight / 1.5,
        height: height
    }
}
