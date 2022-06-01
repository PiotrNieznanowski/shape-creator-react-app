// @ts-nocheck
import { fabric } from "fabric";

import { Arrow, Video, Line, Cube, Svg } from './objects';
import { FabricObject } from './utils';


export interface ObjectSchema {
	create: (...option: any) => fabric.Object;
}

export interface CanvasObjectSchema {
	[key: string]: ObjectSchema;
}

export const createCanvasObject = (objectSchema: CanvasObjectSchema) => objectSchema;

const CanvasObject: CanvasObjectSchema = {
	group: {
		create: ({ objects, ...option }: { objects: FabricObject[] }) => new fabric.Group(objects, option),
	},
	triangle: {
		create: (option: any) => new fabric.Triangle(option),
	},
	circle: {
		create: (option: any) => new fabric.Circle(option),
	},
	rect: {
		create: (option: any) => new fabric.Rect(option),
	},
	cube: {
		create: (option: any) => new Cube(option),
	},
	image: {
		create: ({ element = new Image(), ...option }) =>
			new fabric.Image(element, {
				...option,
				crossOrigin: 'anonymous',
			}),
	},
	polygon: {
		create: ({ points, ...option }: { points: any }) =>
			new fabric.Polygon(points, {
				...option,
				perPixelTargetFind: true,
			}),
	},
	line: {
		create: ({ points, ...option }: { points: any }) => new Line(points, option),
	},
	polyline: {
		create: ({ points, ...option }: { points: any }) => new fabric.Polyline(points, option),
	},
	svg: {
		create: (option: any) => new Svg(option),
	},
};

export default CanvasObject;
