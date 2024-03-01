<script lang="ts">
	import * as PIXI from 'pixi.js';

	import Graphics from './Graphics.svelte';
  import type { PointValue } from '$lib/utils/graphics/types'
  import { anchorToPivot } from '$lib/utils/graphics/utils'

	export let rotation = 0;
	export let skew: PointValue = 0;
	export let scale: PointValue = 1;
	export let x = 0;
	export let y = 0;
	export let alpha = 1;
	export let zIndex = 1;
	export let visible = true;
	export let isMask: boolean | 'unset' = 'unset';
	export let eventMode: 'none' | 'passive' | 'auto' | 'static' | 'dynamic' = 'none';
	export let cursor = 'pointer';
	export let blendMode: number = PIXI.BLEND_MODES.NORMAL;

	export let anchor: PointValue = 0;
	export let width = 50;
	export let height = 50;
	export let backgroundColor = 0xffffff;
	export let backgroundAlpha = 1;
	export let borderColor = 0x000000;
	export let borderWidth = 0;
	export let borderRadius = 0;
	export let borderAlpha = 1;
</script>

<Graphics
	{rotation}
	{skew}
	{scale}
	{x}
	{y}
	{alpha}
	{zIndex}
	{visible}
	{isMask}
	{blendMode}
	{eventMode}
	{cursor}
	pivot={anchorToPivot({ anchor, sizes: { width, height } })}
	on:click
	on:hoverOn
	on:hoverOff
	on:pointerDown
	on:pointerUp
	draw={(graphics) => {
		graphics.lineStyle(borderWidth, borderColor, borderAlpha);
		graphics.beginFill(backgroundColor, backgroundAlpha);
		graphics.drawRoundedRect(0, 0, width, height, borderRadius);
		graphics.endFill();
	}}
/>
