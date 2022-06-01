// @ts-nocheck
import { fabric } from 'fabric';

import Handler from './Handler';
import { FabricObject, InteractionMode } from '../utils';

type IReturnType = { selectable?: boolean; evented?: boolean } | boolean;

class InteractionHandler {
	handler: Handler;

	constructor(handler: Handler) {
		this.handler = handler;
		if (this.handler.editable) {
			this.selection();
		}
	}


	public selection = (callback?: (obj: FabricObject) => IReturnType) => {
		if (this.handler.interactionMode === 'selection') {
			return;
		}
		this.handler.interactionMode = 'selection';
		if (typeof this.handler.canvasOption.selection === 'undefined') {
			this.handler.canvas.selection = true;
		} else {
			this.handler.canvas.selection = this.handler.canvasOption.selection;
		}
		this.handler.canvas.defaultCursor = 'default';

		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
		
				if (obj.superType === 'link' || obj.superType === 'port') {
					obj.selectable = false;
					obj.evented = true;
					obj.hoverCursor = 'pointer';
					return;
				}
				obj.hoverCursor = 'move';
				obj.selectable = true;
				obj.evented = true;
			}
		});
		this.handler.canvas.renderAll();
	};


	public grab = (callback?: (obj: FabricObject) => IReturnType) => {
		if (this.handler.interactionMode === 'grab') {
			return;
		}
		this.handler.interactionMode = 'grab';
		this.handler.canvas.selection = false;
		this.handler.canvas.defaultCursor = 'grab';
	
		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				obj.selectable = false;
				obj.evented = this.handler.editable ? false : true;
			}
		});
		this.handler.canvas.renderAll();
	};


	public drawing = (type?: InteractionMode, callback?: (obj: FabricObject) => IReturnType) => {
		if (this.isDrawingMode()) {
			return;
		}
		this.handler.interactionMode = type;
		this.handler.canvas.selection = false;
		this.handler.canvas.defaultCursor = 'pointer';
		// this.handler.workarea.hoverCursor = 'pointer';
		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				obj.selectable = false;
				obj.evented = this.handler.editable ? false : true;
			}
		});
		this.handler.canvas.renderAll();
	};

	public linking = (callback?: (obj: FabricObject) => IReturnType) => {
		if (this.isDrawingMode()) {
			return;
		}
		this.handler.interactionMode = 'link';
		this.handler.canvas.selection = false;
		this.handler.canvas.defaultCursor = 'default';

		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				if (obj.superType === 'node' || obj.superType === 'port') {
					obj.hoverCursor = 'pointer';
					obj.selectable = false;
					obj.evented = true;
					return;
				}
				obj.selectable = false;
				obj.evented = this.handler.editable ? false : true;
			}
		});
		this.handler.canvas.renderAll();
	};


	public moving = (e: MouseEvent) => {
		if (this.isDrawingMode()) {
			return;
		}
		const delta = new fabric.Point(e.movementX, e.movementY);
		this.handler.canvas.relativePan(delta);
		this.handler.canvas.requestRenderAll();
		this.handler.objects.forEach(obj => {
		
		});
	};

	public isDrawingMode = () => {
		return (
			this.handler.interactionMode === 'polyline' ||
			this.handler.interactionMode === 'polygon'
		);
	};


	private interactionCallback = (obj: FabricObject, callback?: (obj: FabricObject) => void) => {
		callback(obj);
	};
}

export default InteractionHandler;
