import type { GameLevel, LoseHoleConfig, WinHoleConfig } from "./types";
import { MIN_HOLE_POSITION_Y, MIN_HOLE_POSITION_X, MAX_HOLE_POSITION_X, MAX_HOLE_POSITION_Y, WIN_HOLES_COUNT, MAX_LOSE_HOLE_SIZE, MIN_LOSE_HOLE_SIZE } from "./constants";

function getRandomPosition(
    existingHoles: (LoseHoleConfig | WinHoleConfig)[],
    size: number,
    level?: number
): { x: number; y: number } {
    let x: number;
    let y: number;
    let overlaps;

    do {
        if(level) {
            const ratio = level / (WIN_HOLES_COUNT - 1);
            const tempY = MAX_HOLE_POSITION_Y - (MAX_HOLE_POSITION_Y - MIN_HOLE_POSITION_Y) * ratio;
            y = Math.floor(tempY - Math.random() * (20) + 50);
            x = Math.floor(Math.random() * (MAX_HOLE_POSITION_X - MIN_HOLE_POSITION_X)) + MIN_HOLE_POSITION_X;
        } else {
            y = Math.floor(Math.random() * ((MAX_HOLE_POSITION_Y) - (MIN_HOLE_POSITION_Y/25))) + 10;
            x = Math.floor((Math.random() * (MAX_HOLE_POSITION_X - (MIN_HOLE_POSITION_X/2))) + MIN_HOLE_POSITION_X/2);
        }

        overlaps = existingHoles.some((hole) => {
            const dx = hole.x - x;
            const dy = hole.y - y;
            const distanceSquared = dx * dx + dy * dy;

            const maxDistance = (hole.size + size) * (hole.size + size)
            if(distanceSquared <= maxDistance) {
                if(distanceSquared < size * 150) {
                    return true;
                }
            }
            return false;
        })
    } while (overlaps);

    return { x, y };
}

function generateWinHoles(): WinHoleConfig[] {
    const winHoles: WinHoleConfig[] = [];

    for(let level = 1; level<= WIN_HOLES_COUNT; level++) {
        const size = 28 - (level - 1);
        const { x, y } = getRandomPosition(winHoles, size, level);

        winHoles.push({ x, y, size, winLevel: level})
    }

    return winHoles;
}

function generateLoseHoles(winHoles: WinHoleConfig[], numHoles: number): LoseHoleConfig[] {
    const loseHoles: LoseHoleConfig[] = [];
    const allHoles: (LoseHoleConfig | WinHoleConfig)[] = [...winHoles]

    for (let index = 0; index < numHoles; index++) {
        const size = Math.floor(Math.random() * (MAX_LOSE_HOLE_SIZE - MIN_LOSE_HOLE_SIZE + 1) + MIN_LOSE_HOLE_SIZE);
        const { x, y } = getRandomPosition(allHoles, size);
        const loseHole: LoseHoleConfig = { index, x, y, size };
        loseHoles.push(loseHole);
        allHoles.push(loseHole);
    }

  return loseHoles;
}

export function generateLevel(numHoles: number): GameLevel {
    if(numHoles === 0) return {
        loseHoles: [],
        winHoles: []
    }

    const winHoles = generateWinHoles();
    const loseHoles = generateLoseHoles(winHoles, numHoles);

    return {
        loseHoles,
        winHoles
    };
}
