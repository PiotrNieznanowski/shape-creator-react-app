// @ts-nocheck
import { fabric } from 'fabric';
import { v4 } from 'uuid';

import Handler from './Handler';
import { FabricEvent, FabricObject } from '../utils';
import { Arrow, Line } from '../objects';

class DrawingHandler {
	handler: Handler;
	constructor(handler: Handler) {
		this.handler = handler;
	}

	polygon = {
		init: () => {
			this.handler.interactionHandler.drawing('polygon');
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
		},
		finish: () => {
			this.handler.pointArray.forEach(point => {
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			this.handler.canvas.remove(this.handler.activeShape);
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.canvas.renderAll();
			this.handler.interactionHandler.selection();
		},
		addPoint: (opt: FabricEvent) => {
			const { e, absolutePointer } = opt;
			const { x, y } = absolutePointer;
			const circle = new fabric.Circle({
				radius: 2,
				fill: 'black',
				stroke: 'red',
				strokeWidth: 2,
				left: x,
				top: y,
				selectable: false,
				hasBorders: false,
				hasControls: false,
				originX: 'center',
				originY: 'center',
				hoverCursor: 'pointer',
			}) as FabricObject<fabric.Circle>;
			circle.set({
				id: v4(),
			});
			if (!this.handler.pointArray.length) {
				circle.set({
					fill: 'black',
				});
			}
			const points = [x, y, x, y];
			const line = new fabric.Line(points, {
				strokeWidth: 2,
				fill: 'transparent',
				stroke: '#999999',
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
			}) as FabricObject<fabric.Line>;
			line.set({
				class: 'line',
			});
			if (this.handler.activeShape) {
				const position = this.handler.canvas.getPointer(e);
				const activeShapePoints = this.handler.activeShape.get('points') as Array<{ x: number; y: number }>;
				activeShapePoints.push({
					x: position.x,
					y: position.y,
				});
				const polygon = new fabric.Polygon(activeShapePoints, {
					stroke: '#333333',
					strokeWidth: 1,
					fill: '#cccccc',
					opacity: 0.5,
					selectable: false,
					hasBorders: false,
					hasControls: false,
					evented: false,
				});
				this.handler.canvas.remove(this.handler.activeShape);
				this.handler.canvas.add(polygon);
				this.handler.activeShape = polygon;
				this.handler.canvas.renderAll();
			} else {
				const polyPoint = [{ x, y }];
				const polygon = new fabric.Polygon(polyPoint, {
					stroke: '#333333',
					strokeWidth: 1,
					fill: '#cccccc',
					opacity: 0.1,
					selectable: false,
					hasBorders: false,
					hasControls: false,
					evented: false,
				});
				this.handler.activeShape = polygon;
				this.handler.canvas.add(polygon);
			}
			this.handler.activeLine = line;
			this.handler.pointArray.push(circle);
			this.handler.lineArray.push(line);
			this.handler.canvas.add(line);
			this.handler.canvas.add(circle);
		},
		generate: (pointArray: FabricObject<fabric.Circle>[]) => {
			const points = [] as any[];
			const id = v4();
			pointArray.forEach(point => {
				points.push({
					x: point.left,
					y: point.top,
				});
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeShape).remove(this.handler.activeLine);
			const option = {
				id,
				points,
				type: 'polygon',
				stroke: 'rgba(0, 0, 0, 1)',
				strokeWidth: 1,
				fill: 'rgba(0, 0, 0, 0.25)',
				opacity: 1,
				objectCaching: !this.handler.editable,
				name: 'New polygon',
				superType: 'drawing',
			};
			this.handler.add(option, false);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.interactionHandler.selection();
		},
	};

	polyline = {
		init: () => {
			this.handler.interactionHandler.drawing('polyline');
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
		},
		finish: () => {
			this.handler.pointArray.forEach(point => {
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			this.handler.canvas.remove(this.handler.activeShape);
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.canvas.renderAll();
			this.handler.interactionHandler.selection();
		},
		addPoint: (opt: FabricEvent) => {
			const { e, absolutePointer } = opt;
			const { x, y } = absolutePointer;
			const circle = new fabric.Circle({
				radius: 2,
				fill: 'black',
				stroke: 'red',
				strokeWidth: 2,
				left: x,
				top: y,
				selectable: false,
				hasBorders: false,
				hasControls: false,
				originX: 'center',
				originY: 'center',
				hoverCursor: 'pointer',
			}) as FabricObject<fabric.Circle>;
			circle.set({
				id: v4(),
			});
			if (!this.handler.pointArray.length) {
				circle.set({
					fill: 'black',
				});
			}
			const points = [x, y, x, y];
			const line = new fabric.Line(points, {
				strokeWidth: 1,
				fill: 'red',
				stroke: 'red',
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
			}) as FabricObject<fabric.Line>;
			line.set({
				class: 'line',
			});

			this.handler.activeLine = line;
			this.handler.pointArray.push(circle);
			this.handler.lineArray.push(line);
			this.handler.canvas.add(line);
			this.handler.canvas.add(circle);
		},
		generate: (pointArray: FabricObject<fabric.Circle>[]) => {
			const points = [] as any[];
			const id = v4();
			pointArray.forEach(point => {
				points.push({
					x: point.left,
					y: point.top,
				});
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeShape).remove(this.handler.activeLine);
			const option = {
				id,
				points,
				type: 'polyline',
				stroke: 'silver',
				strokeWidth: 1,
				fill: 'transparent',
				opacity: 1,
				objectCaching: !this.handler.editable,
				name: 'New polyline',
				superType: 'drawing',
			};
			this.handler.add(option, false);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.interactionHandler.selection();
		},
	};

	// orthogonal = {};

	// curve = {};
}

export default DrawingHandler;
