import type { PointValue, Sizes } from "./types";

export const getPointValue = (value: PointValue, defaultValue?: number) => {
	const finalDefaultValue = defaultValue === undefined ? 0 : defaultValue;
	if (typeof value === 'number') return [value, value];
	return [value?.x || finalDefaultValue, value?.y || finalDefaultValue];
};

export const anchorToPivot = ({ anchor, sizes }: { anchor: PointValue; sizes: Sizes }) => {
	const { width, height } = sizes;
	const anchorValue = getPointValue(anchor);
	return { x: width * anchorValue[0], y: height * anchorValue[1] };
};
