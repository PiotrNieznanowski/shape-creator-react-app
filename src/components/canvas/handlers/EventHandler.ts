// @ts-nocheck
import { fabric } from 'fabric';
import Handler from './Handler';
import { FabricObject, FabricEvent } from '../utils';

class EventHandler {
	handler: Handler;
	keyCode: number;
	panning: boolean;

	constructor(handler: Handler) {
		this.handler = handler;
		this.initialize();
	}

	public initialize() {
		if (this.handler.editable) {
			this.handler.canvas.on({
				'object:modified': this.modified,
				'object:scaled': this.scaled,
				'object:moving': this.moving,
				'object:scaling': this.scaling,
				'object:rotating': this.rotating,
				'object:rotated': this.rotated,
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:up': this.mouseup,
				'selection:cleared': this.selectionDelete,
				'selection:created': this.selection,
				'selection:updated': this.selection,
				"mouse:dblclick": this.dbClick
			});
		} else {
			this.handler.canvas.on({
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:out': this.mouseout,
				'mouse:up': this.mouseup,
			});
		}
		this.handler.canvas.wrapperEl.tabIndex = 1000;
		this.handler.canvas.wrapperEl.addEventListener('keydown', this.keydown, false);
		this.handler.canvas.wrapperEl.addEventListener('keyup', this.keyup, false);

		if (this.handler.keyEvent.clipboard) {
			document.addEventListener('paste', this.paste, false);
		}
	}

	public dbClick = (opt: FabricEvent) => {

		if (this.handler.interactionMode === 'polyline') {
			this.handler.drawingHandler.polyline.generate(this.handler.pointArray);
		}
	};

	public destroy = () => {
		if (this.handler.editable) {
			this.handler.canvas.off({
				'object:modified': this.modified,
				'object:moving': this.moving,
				'object:rotating': this.rotating,
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:up': this.mouseup,
				'selection:cleared': this.selectionDelete,
				'selection:created': this.selection,
				'selection:updated': this.selection,
			});
		} else {
			this.handler.canvas.off({
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:out': this.mouseout,
				'mouse:up': this.mouseup,
			});
			this.handler.getObjects().forEach(object => {
				object.off('mousedown', this.handler.eventHandler.object.mousedown);

			});
		}
		this.handler.canvas.wrapperEl.removeEventListener('keydown', this.keydown);
		this.handler.canvas.wrapperEl.removeEventListener('keyup', this.keyup);

		if (this.handler.keyEvent.clipboard) {
			this.handler.canvas.wrapperEl.removeEventListener('paste', this.paste);
		}
	};

	public object = {

		mousedown: (opt: FabricEvent) => {
			const { target } = opt;
			if (target && target.link && target.link.enabled) {
				const { onClick } = this.handler;
				if (onClick) {
					onClick(this.handler.canvas, target);
				}
			}
		},

		mousedblclick: (opt: FabricEvent) => {
			return
		},
	};


	public modified = (opt: FabricEvent) => {
		const { target } = opt;
		if (!target) {
			return;
		}
		if (target.type === 'circle' && target.parentId) {
			return;
		}

	};


	public moving = (opt: FabricEvent) => {
		const { target } = opt as any;

		if (this.handler.interactionMode === 'crop') {
			return
		} else {
			if (this.handler.editable && this.handler.guidelineOption.enabled) {
				this.handler.guidelineHandler.movingGuidelines(target);
			}
			if (target.type === 'activeSelection') {
				const activeSelection = target as fabric.ActiveSelection;
				activeSelection.getObjects().forEach((obj: any) => {
					const left = target.left + obj.left + target.width / 2;
					const top = target.top + obj.top + target.height / 2;

				});
				return;
			}

		}
	};

	public scaling = (opt: FabricEvent) => {
		const { target } = opt as any;

		if (this.handler.editable && this.handler.guidelineOption.enabled) {
			this.handler.guidelineHandler.movingGuidelines(target);
		}

	};


	public scaled = (_opt: FabricEvent) => {
		if (this.handler.editable && this.handler.guidelineOption.enabled) {
			this.handler.guidelineHandler.movingGuidelines(target);
		}
		if (!this.handler.transactionHandler.active) {
			this.handler.transactionHandler.save('scaled');
		}
	};


	public rotating = (opt: FabricEvent) => {
		const { target } = opt as any;
		if (this.handler.editable && this.handler.guidelineOption.enabled) {
			this.handler.guidelineHandler.movingGuidelines(target);
		}
	};


	public rotated = (_opt: FabricEvent) => {
		if (this.handler.editable && this.handler.guidelineOption.enabled) {
			this.handler.guidelineHandler.movingGuidelines(target);
		}
		if (!this.handler.transactionHandler.active) {
			this.handler.transactionHandler.save('rotated');
		}
	};


	public arrowmoving = (e: KeyboardEvent) => {
		const activeObject = this.handler.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return false;
		}
		if (activeObject.id === 'workarea') {
			return false;
		}
		if (e.keyCode === 38) {
			activeObject.set('top', activeObject.top - 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		} else if (e.keyCode === 40) {
			activeObject.set('top', activeObject.top + 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		} else if (e.keyCode === 37) {
			activeObject.set('left', activeObject.left - 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		} else if (e.keyCode === 39) {
			activeObject.set('left', activeObject.left + 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		}

		return true;
	};

	public mousedown = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		const { editable } = this.handler;
		if (event.e.altKey && editable && !this.handler.interactionHandler.isDrawingMode()) {
			this.handler.interactionHandler.grab();
			this.panning = true;
			return;
		}
		if (this.handler.interactionMode === 'grab') {
			this.panning = true;
			return;
		}
		const { target } = event;
		if (editable) {
			if (this.handler.prevTarget && this.handler.prevTarget.superType === 'link') {
				this.handler.prevTarget.set({
					stroke: this.handler.prevTarget.originStroke,
				});
			}


			this.handler.guidelineHandler.viewportTransform = this.handler.canvas.viewportTransform;
			this.handler.guidelineHandler.zoom = this.handler.canvas.getZoom();
		
			if (this.handler.interactionMode === 'polygon') {
				if (target && this.handler.pointArray.length && target.id === this.handler.pointArray[0].id) {
					this.handler.drawingHandler.polygon.generate(this.handler.pointArray);
				} else {
					this.handler.drawingHandler.polygon.addPoint(event);
				}
			}  else if (this.handler.interactionMode === 'polyline') {

				this.handler.drawingHandler.polyline.addPoint(event);

			}
		}
	};

	public mousemove = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		if (this.handler.interactionMode === 'grab' && this.panning) {
			this.handler.interactionHandler.moving(event.e);
			this.handler.canvas.requestRenderAll();
		}
		if (!this.handler.editable && event.target) {
			if (event.target.superType === 'element') {
				return;
			}

		}
		if (this.handler.interactionMode === 'polygon') {
			if (this.handler.activeLine && this.handler.activeLine.class === 'line') {
				const pointer = this.handler.canvas.getPointer(event.e);
				this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
				const points = this.handler.activeShape.get('points');
				points[this.handler.pointArray.length] = {
					x: pointer.x,
					y: pointer.y,
				};
				this.handler.activeShape.set({
					points,
				});
				this.handler.canvas.requestRenderAll();
			}
		}  else if (this.handler.interactionMode === 'polyline') {
			if (this.handler.activeLine && this.handler.activeLine.class === 'line') {
				const pointer = this.handler.canvas.getPointer(event.e);
				this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
			}
			this.handler.canvas.requestRenderAll();
		}

		return;
	};


	public mouseup = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		if (this.handler.interactionMode === 'grab') {
			this.panning = false;
			return;
		}

		const { target, e } = event;
		// if (this.handler.interactionMode === 'selection') {
		// 	if (target && e.shiftKey && target.superType === 'node') {
		// 		const node = target as NodeObject;
		// 		this.handler.canvas.discardActiveObject();
		// 		const nodes = [] as NodeObject[];
		// 		this.handler.nodeHandler.getNodePath(node, nodes);
		// 		const activeSelection = new fabric.ActiveSelection(nodes, {
		// 			canvas: this.handler.canvas,
		// 			...this.handler.activeSelectionOption,
		// 		});
		// 		this.handler.canvas.setActiveObject(activeSelection);
		// 		this.handler.canvas.requestRenderAll();
		// 	}
		// }
		if (this.handler.editable && this.handler.guidelineOption.enabled) {
			this.handler.guidelineHandler.verticalLines.length = 0;
			this.handler.guidelineHandler.horizontalLines.length = 0;
		}
		this.handler.canvas.renderAll();
	};

	public mouseout = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		if (!event.target) {

		}
	};

	// TO DO BETTER

	public selection = (opt: FabricEvent) => {
		const { onSelect } = this.handler;
		const target = opt.selected[0]

		if (target) {
			this.selectionDelete()
		}

		if (onSelect) {
			onSelect(target);
		}
	};
	public selectionDelete = (opt: FabricEvent) => {
		const { onSelect } = this.handler;

		if (onSelect) {

			onSelect(null);
		}
	};


	public resize = (nextWidth: number, nextHeight: number) => {
		this.handler.canvas.setWidth(nextWidth).setHeight(nextHeight);
		this.handler.canvas.setBackgroundColor(
			this.handler.canvasOption.backgroundColor,
			this.handler.canvas.renderAll.bind(this.handler.canvas),
		);
		if (!this.handler.workarea) {
			return;
		}
		const diffWidth = nextWidth / 2 - this.handler.width / 2;
		const diffHeight = nextHeight / 2 - this.handler.height / 2;
		this.handler.width = nextWidth;
		this.handler.height = nextHeight;
		if (this.handler.workarea.layout === 'fixed') {
			this.handler.canvas.centerObject(this.handler.workarea);
			this.handler.workarea.setCoords();
			if (this.handler.gridOption.enabled) {
				return;
			}
			this.handler.canvas.getObjects().forEach((obj: FabricObject) => {
				if (obj.id !== 'workarea') {
					const left = obj.left + diffWidth;
					const top = obj.top + diffHeight;
					obj.set({
						left,
						top,
					});
					obj.setCoords();

				}
			});
			this.handler.canvas.requestRenderAll();
			return;
		}

		const scaleX = nextWidth / this.handler.workarea.width;
		const scaleY = nextHeight / this.handler.workarea.height;
		const diffScaleX = nextWidth / (this.handler.workarea.width * this.handler.workarea.scaleX);
		const diffScaleY = nextHeight / (this.handler.workarea.height * this.handler.workarea.scaleY);
		this.handler.workarea.set({
			scaleX,
			scaleY,
		});
		this.handler.canvas.getObjects().forEach((obj: any) => {
			const { id } = obj;
			if (obj.id !== 'workarea') {
				const left = obj.left * diffScaleX;
				const top = obj.top * diffScaleY;
				const newScaleX = obj.scaleX * diffScaleX;
				const newScaleY = obj.scaleY * diffScaleY;
				obj.set({
					scaleX: newScaleX,
					scaleY: newScaleY,
					left,
					top,
				});
				obj.setCoords();

			}
		});
		this.handler.canvas.renderAll();
	};


	public paste = (e: ClipboardEvent) => {
		if (this.handler.canvas.wrapperEl !== document.activeElement) {
			return false;
		}
		if (e.preventDefault) {
			e.preventDefault();
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		const clipboardData = e.clipboardData;
		if (clipboardData.types.length) {
			clipboardData.types.forEach((clipboardType: string) => {
				if (clipboardType === 'text/plain') {
					const textPlain = clipboardData.getData('text/plain');
					try {
						const objects = JSON.parse(textPlain);
						const {
							gridOption: { grid = 10 },
							isCut,
						} = this.handler;
						const padding = isCut ? 0 : grid;
						if (objects && Array.isArray(objects)) {
							const filteredObjects = objects.filter(obj => obj !== null);
							if (filteredObjects.length === 1) {
								const obj = filteredObjects[0];
								if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
									return;
								}
								obj.left = obj.properties.left + padding;
								obj.top = obj.properties.top + padding;
								const createdObj = this.handler.add(obj, false, true);
								this.handler.canvas.setActiveObject(createdObj as FabricObject);
								this.handler.canvas.requestRenderAll();
							} else {
								const nodes = [] as any[];
								const targets = [] as any[];
								objects.forEach(obj => {
									if (!obj) {
										return;
									}
									if (obj.superType === 'link') {
										obj.fromNodeId = nodes[obj.fromNodeIndex].id;
										obj.toNodeId = nodes[obj.toNodeIndex].id;
									} else {
										obj.left = obj.properties.left + padding;
										obj.top = obj.properties.top + padding;
									}
									const createdObj = this.handler.add(obj, false, true);
									if (obj.superType === 'node') {
										nodes.push(createdObj);
									} else {
										targets.push(createdObj);
									}
								});
								const activeSelection = new fabric.ActiveSelection(nodes.length ? nodes : targets, {
									canvas: this.handler.canvas,
									...this.handler.activeSelectionOption,
								});
								this.handler.canvas.setActiveObject(activeSelection);
								this.handler.canvas.requestRenderAll();
							}
							if (!this.handler.transactionHandler.active) {
								this.handler.transactionHandler.save('paste');
							}
							this.handler.isCut = false;
							this.handler.copy();
						}
					} catch (error) {
						console.error(error);
						// const item = {
						//     id: uuv4id(),
						//     type: 'textbox',
						//     text: textPlain,
						// };
						// this.handler.add(item, true);
					}
				} else if (clipboardType === 'text/html') {
					// Todo ...
					// const textHtml = clipboardData.getData('text/html');
					// console.log(textHtml);
				} else if (clipboardType === 'Files') {
					// Array.from(clipboardData.files).forEach((file) => {
					//     const { type } = file;
					//     if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
					//         const item = {
					//             id: v4(),
					//             type: 'image',
					//             file,
					//             superType: 'image',
					//         };
					//         this.handler.add(item, true);
					//     } else {
					//         console.error('Not supported file type');
					//     }
					// });
				}
			});
		}
		return true;
	};


	public keydown = (e: KeyboardEvent) => {
		const { keyEvent, editable } = this.handler;
		if (!Object.keys(keyEvent).length) {
			return;
		}



		if (this.handler.canvas.wrapperEl !== document.activeElement) {
			return;
		}

		return;
	};

	public keyup = (e: KeyboardEvent) => {
		if (this.handler.interactionHandler.isDrawingMode()) {
			return;
		}

	};

}

export default EventHandler;
