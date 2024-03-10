<script lang="ts">
    import Matter from 'matter-js'
    import { Engine, engine } from '$lib/utils/Engine';
    import { lives, reset, level, win } from '$lib/utils/stores';

    Engine()
    Matter.Engine.update($engine, 1000 / 60);

    Matter.Events.on($engine, 'collisionStart', (event) => {
        for(const pair of event.pairs) {
            const isLoseHole = (pair.bodyA.label === 'Ball' && ['loseHole', 'center'].every((s) => pair.bodyB.label.includes(s))) ||
                               (pair.bodyB.label === 'Ball' && ['loseHole', 'center'].every((s) => pair.bodyA.label.includes(s)))
            const isWinHole =  (pair.bodyA.label === 'Ball' && ['winHole', 'center'].every((s) => pair.bodyB.label.includes(s))) ||
                               (pair.bodyB.label === 'Ball' && ['winHole', 'center'].every((s) => pair.bodyA.label.includes(s)))

            if(isLoseHole) {
                const loseHole = [pair.bodyA, pair.bodyB].find((v) => ['loseHole', 'center'].every((s) => v.label.includes(s))) 
                lives.set($lives - 1)
                reset.set({
                    HoleIndex: Number(loseHole!.label.split('_')[1]) - 1,
                    HoleX: loseHole!.position.x,
                    HoleY: loseHole!.position.y 
                })
            } else if(isWinHole) {
                const winHole = [pair.bodyA, pair.bodyB].find((v) => ['winHole', 'center'].every((s) => v.label.includes(s))) 
                const winHoleIndex = Number(winHole!.label.split('_')[1])
                if($level != winHoleIndex) {
                    lives.set($lives - 1)
                    reset.set({
                        HoleIndex: Number(winHole!.label.split('_')[1]) - 1,
                        HoleX: winHole!.position.x,
                        HoleY: winHole!.position.y 
                    })
                    return
                }
                level.set(winHoleIndex + 1)
                win.set({
                    HoleIndex: winHoleIndex,
                    HoleX: winHole!.position.x,
                    HoleY: winHole!.position.y
                })
            }
        }
    });
</script>

<slot />
