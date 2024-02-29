<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { pixiApplication } from '$lib/utils/game/createApp';
  import type { PointValue } from '$lib/utils/graphics/types'
  import { getPointValue } from '$lib/utils/graphics/utils'
	import * as PIXI from 'pixi.js';

	export let rotation: number = 0;
	export let skew: PointValue = 0;
	export let scale: PointValue = 1;
	export let pivot: PointValue = 0;
	export let x: number = 0;
	export let y: number = 0;
	export let alpha: number = 1;
	export let zIndex: number = 1;
	export let visible = true;
	export let isMask: boolean | 'unset' = 'unset';
	export let draw: (graphics: PIXI.Graphics) => void;
	export let cursor: 'pointer'
	export let blendMode: number = PIXI.BLEND_MODES.NORMAL;
	
	export let eventMode: 'none' | 'passive' | 'auto' | 'static' | 'dynamic' = 'none';
	// https://pixijs.download/dev/docs/PIXI.Graphics.html#eventMode
	// 'none': Ignores all interaction events, even on its children.
	// 'passive': Does not emit events and ignores all hit testing on itself and non-interactive children. Interactive children will still emit events.
	// 'auto': Does not emit events and but is hit tested if parent is interactive. Same as interactive = false in v7
	// 'static': Emit events and is hit tested. Same as interaction = true in v7
	// 'dynamic': Emits events and is hit tested but will also receive mock interaction events fired from a ticker to allow for interaction when the mouse isn't moving

	const graphics = new PIXI.Graphics();
	const dispatch = createEventDispatcher<{
		click: void;
		hoverOn: void;
		hoverOff: void;
		pointerDown: void;
		pointerUp: void;
	}>();
	const click = () => dispatch('click');
	const hoverOn = () => dispatch('hoverOn');
	const hoverOff = () => dispatch('hoverOff');
	const pointerDown = () => dispatch('pointerDown');
	const pointerUp = () => dispatch('pointerUp');

	$: graphics.x = x;
	$: graphics.y = y;
	$: graphics.alpha = alpha;
	$: graphics.zIndex = zIndex;
	$: graphics.visible = visible;
	$: graphics.scale.set(...getPointValue(scale, 1));
	$: graphics.pivot.set(...getPointValue(pivot));
	$: graphics.skew.set(...getPointValue(skew));
	$: graphics.rotation = rotation;
	$: graphics.eventMode = eventMode;
	$: graphics.cursor = cursor;
	$: graphics.blendMode = blendMode;

	graphics.on('pointerover', hoverOn).on('pointerout', hoverOff);
	graphics.on('pointerdown', pointerDown).on('pointerup', () => {
		pointerUp();
		click();
	});

	$: if (draw) {
		graphics.clear();
		draw(graphics);
	}

	$pixiApplication.stage.addChild(graphics);
</script>
