<script lang="ts">
    import { Text, Sprite, Container } from 'pixi-svelte';
    import Matter from 'matter-js'
    import { world } from "$lib/utils/Engine";
    import { level } from '$lib/utils/stores';

    export let winLevel: number
    export let x: number
    export let y: number
    export let size: number
    export let label: string

    const winHole = Matter.Bodies.circle(
        x,
        y,
        size,
        {
            label: label,
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: '#111417',
            }
        }
    );
    const winHoleCenter = Matter.Bodies.circle(
        x,
        y,
        size/6,
        {
            label: `${label}_center`,
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: 'green',
            },
        }
    )
    Matter.Composite.add($world, [winHole, winHoleCenter])

    $: winHoleSprite = $level != winLevel ? "winholeinactive" : "winhole"

</script>

<Container
    x={x}
    y={y}
    scale={size/18}
    pivot={{ x: size, y: 0}}
>
    <Text
        y={-7}
        x={20}
        value={String(winLevel)}
        style={{
            fill: $level != winLevel ? "#1c1c1c" : "#53DB11",
            fontWeight: "800",
            fontSize: 13
        }}
    />
    <Sprite 
        key={winHoleSprite}
    />
</Container>
