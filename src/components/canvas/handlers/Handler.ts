// @ts-nocheck
import { fabric } from 'fabric';
import warning from 'warning';
import { v4 } from 'uuid';
import { union } from 'lodash';
import TransactionHandler from './TransactionHandler';
import GuidelineHandler from './GuidelineHandler';
import DrawingHandler from './DrawingHandler';
import EventHandler from './EventHandler';
import InteractionHandler from './InteractionHandler';
import {
	FabricObject,
	WorkareaObject,
	WorkareaOption,
	InteractionMode,
	CanvasOption,
	GridOption,
	GuidelineOption,
	KeyEvent,
	FabricObjectOption,
	FabricElement,
	FabricCanvas,
	FabricGroup,
	FabricObjects,
} from '../utils';
import CanvasObject from '../CanvasObject';
import { TransactionEvent } from './TransactionHandler';
import { defaults } from '../constants';
import { SvgOption } from '../objects/Svg';

export interface HandlerCallback {

	onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	onSelect?: (target: FabricObject) => void;
	onRemove?: (target: FabricObject) => void;
	onTransaction?: (transaction: TransactionEvent) => void;
}

export interface HandlerOption {
	/**
	 * Canvas id
	 * @type {string}
	 */
	id?: string;
	/**
	 * Canvas object
	 * @type {FabricCanvas}
	 */
	canvas?: FabricCanvas;
	/**
	 * Canvas parent element
	 * @type {HTMLDivElement}
	 */
	container?: HTMLDivElement;
	/**
	 * Canvas editable
	 * @type {boolean}
	 */
	editable?: boolean;
	/**
	 * Canvas interaction mode
	 * @type {InteractionMode}
	 */
	interactionMode?: InteractionMode;
	/**
	 * Persist properties for object
	 * @type {string[]}
	 */
	propertiesToInclude?: string[];
	/**
	 * Minimum zoom ratio
	 * @type {number}
	 */
	minZoom?: number;
	/**
	 * Maximum zoom ratio
	 * @type {number}
	 */
	maxZoom?: number;
	/**
	 * Workarea option
	 * @type {WorkareaOption}
	 */
	workareaOption?: WorkareaOption;
	/**
	 * Canvas option
	 * @type {CanvasOption}
	 */
	canvasOption?: CanvasOption;
	/**
	 * Grid option
	 * @type {GridOption}
	 */
	gridOption?: GridOption;
	/**
	 * Default option for Fabric Object
	 * @type {FabricObjectOption}
	 */
	objectOption?: FabricObjectOption;
	/**
	 * Guideline option
	 * @type {GuidelineOption}
	 */
	guidelineOption?: GuidelineOption;
	/**
	 * Whether to use zoom
	 * @type {boolean}
	 */
	zoomEnabled?: boolean;
	/**
	 * ActiveSelection option
	 * @type {Partial<FabricObjectOption<fabric.ActiveSelection>>}
	 */
	activeSelectionOption?: Partial<FabricObjectOption<fabric.ActiveSelection>>;
	/**
	 * Canvas width
	 * @type {number}
	 */
	width?: number;
	/**
	 * Canvas height
	 * @type {number}
	 */
	height?: number;
	/**
	 * Keyboard event in Canvas
	 * @type {KeyEvent}
	 */
	keyEvent?: KeyEvent;
	/**
	 * Append custom objects
	 * @type {{ [key: string]: any }}
	 */
	fabricObjects?: FabricObjects;
	[key: string]: any;
}

export type HandlerOptions = HandlerOption & HandlerCallback;


export class Handler implements HandlerOptions {
	public id: string;
	public canvas: FabricCanvas;
	public workarea: WorkareaObject;
	public container: HTMLDivElement;
	public editable: boolean;
	public interactionMode: InteractionMode;
	public minZoom: number;
	public maxZoom: number;
	public propertiesToInclude?: string[] = defaults.propertiesToInclude;
	public workareaOption?: WorkareaOption = defaults.workareaOption;
	public canvasOption?: CanvasOption = defaults.canvasOption;
	public gridOption?: GridOption = defaults.gridOption;
	public objectOption?: FabricObjectOption = defaults.objectOption;
	public guidelineOption?: GuidelineOption = defaults.guidelineOption;
	public keyEvent?: KeyEvent = defaults.keyEvent;
	public activeSelectionOption?: Partial<FabricObjectOption<fabric.ActiveSelection>> = defaults.activeSelectionOption;
	public fabricObjects?: FabricObjects = CanvasObject;
	public zoomEnabled?: boolean;
	public width?: number;
	public height?: number;


	public onZoom?: (zoomRatio: number) => void;
	public onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	public onSelect?: (target: FabricObject) => void;
	public onRemove?: (target: FabricObject) => void;
	public onTransaction?: (transaction: TransactionEvent) => void;


	public interactionHandler: InteractionHandler;
	public transactionHandler: TransactionHandler;
	public guidelineHandler: GuidelineHandler;
	public eventHandler: EventHandler;
	public drawingHandler: DrawingHandler;


	public objectMap: Record<string, FabricObject> = {};
	public objects: FabricObject[];
	public activeLine?: any;
	public activeShape?: any;
	public zoom = 1;
	public prevTarget?: FabricObject;
	public target?: FabricObject;
	public pointArray?: any[];
	public lineArray?: any[];
	public isCut = false;

	private isRequsetAnimFrame = false;
	private requestFrame: any;
	private clipboard: any;
	private updatePreview: Function;

	constructor(options: HandlerOptions) {
		this.initialize(options);
	}

	public initialize(options: HandlerOptions) {
		this.initOption(options);
		this.initCallback(options);
		this.initHandler();
	}

	public initOption = (options: HandlerOptions) => {
		this.id = options.id;
		this.canvas = options.canvas;
		this.container = options.container;
		this.editable = options.editable;
		this.interactionMode = options.interactionMode;
		this.minZoom = options.minZoom;
		this.maxZoom = options.maxZoom;
		this.zoomEnabled = options.zoomEnabled;
		this.width = options.width;
		this.height = options.height;
		this.objects = [];
		this.setPropertiesToInclude(options.propertiesToInclude);
		this.setWorkareaOption(options.workareaOption);
		this.setCanvasOption(options.canvasOption);
		this.setGridOption(options.gridOption);
		this.setObjectOption(options.objectOption);
		this.setFabricObjects(options.fabricObjects);
		this.setGuidelineOption(options.guidelineOption);
		this.setActiveSelectionOption(options.activeSelectionOption);
		this.setKeyEvent(options.keyEvent);
	};

	public initCallback = (options: HandlerOptions) => {

		this.onClick = options.onClick;
		this.onSelect = options.onSelect;
		this.onRemove = options.onRemove;
		this.onTransaction = options.onTransaction;
	};

	public initHandler = () => {

		this.interactionHandler = new InteractionHandler(this);
		this.transactionHandler = new TransactionHandler(this, this.updatePreview);
		this.guidelineHandler = new GuidelineHandler(this);
		this.eventHandler = new EventHandler(this);
		this.drawingHandler = new DrawingHandler(this);

	};

	public getObjects = (): FabricObject[] => {
		const objects = this.canvas.getObjects().filter((obj: FabricObject) => {
			if (obj.id === 'workarea') {
				return false;
			} else if (obj.id === 'grid') {
				return false;
			} else if (obj.superType === 'port') {
				return false;
			} else if (!obj.id) {
				return false;
			}
			return true;
		}) as FabricObject[];
		if (objects.length) {
			objects.forEach(obj => (this.objectMap[obj.id] = obj));
		} else {
			this.objectMap = {};
		}
		return objects;
	};

	public set = (key: keyof FabricObject, value: any) => {
		const activeObject = this.canvas.getActiveObject() as any;
		if (!activeObject) {
			return;
		}
		if (activeObject._objects && activeObject._objects.length > 0) {

			activeObject._objects.forEach((object: any) => {
				object.set(key, value);
				object.setCoords();

			});
		}
		else {
			activeObject.set(key, value);
			activeObject.setCoords();
		}
		this.canvas.requestRenderAll();
		const { id, superType, type, player, width, height } = activeObject as any;
		if (superType === 'element') {
			if (key === 'visible') {
				if (value) {
					activeObject.element.style.display = 'block';
				} else {
					activeObject.element.style.display = 'none';
				}
			}

			if (type === 'video' && player) {
				player.setPlayerSize(width, height);
			}
		}

	};

	public setByPartial = (obj: FabricObject, option: FabricObjectOption) => {
		if (!obj) {
			return;
		}

		obj.set(option);
		obj.setCoords();
		this.canvas.renderAll();

		// Adam: added to allow the canvas to be the right size for SVG export, but still be centered in container
		if (option.scaleX) {
			const canvasWidth = obj.workareaWidth * obj.scaleX;
			const canvasHeight = obj.workareaHeight * obj.scaleY;

			let canvasElement = document.getElementsByClassName("rde-canvas")[0] as HTMLElement;

			canvasElement.style.width = `${canvasWidth}px`;
			canvasElement.style.height = `${canvasHeight}px`;
			canvasElement.style.top = `calc(50% - ${Math.ceil(canvasHeight / 2)}px)`;
			canvasElement.style.left = `calc(50% - ${Math.ceil(canvasWidth / 2)}px)`;
		}

		const { id, superType, type, player, width, height } = obj as any;
		if (superType === 'element') {
			if ('visible' in option) {
				if (option.visible) {
					obj.element.style.display = 'block';
				} else {
					obj.element.style.display = 'none';
				}
			}

			if (type === 'video' && player) {
				player.setPlayerSize(width, height);
			}
		}
	};

	public setShadow = (option: fabric.IShadowOptions) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		activeObject.setShadow(option as fabric.Shadow);
		this.canvas.requestRenderAll();

	};

	public setVisible = (visible?: boolean) => {
		const activeObject = this.canvas.getActiveObject() as FabricElement;
		if (!activeObject) {
			return;
		}
		if (activeObject.superType === 'element') {
			if (visible) {
				activeObject.element.style.display = 'block';
			} else {
				activeObject.element.style.display = 'none';
			}
		}
		activeObject.set({
			visible,
		});
		this.canvas.renderAll();
	};

	public centerObject = (obj: FabricObject, centered?: boolean) => {
		if (centered) {
			this.canvas.centerObject(obj);
			obj.setCoords();
		} else {
			this.setByPartial(obj, {
				left:
					obj.left / this.canvas.getZoom() -
					obj.width / 2 -
					this.canvas.viewportTransform[4] / this.canvas.getZoom(),
				top:
					obj.top / this.canvas.getZoom() -
					obj.height / 2 -
					this.canvas.viewportTransform[5] / this.canvas.getZoom(),
			});
		}
	};

	public add = (obj: FabricObjectOption,
		centered = true,
		loaded = false,
		saveObj = false,
		onSvgLoaded = (loadResult: FabricObject) => { }
	) => {

		const { editable, gridOption, objectOption } = this;
		const option: any = {
			hasControls: editable,
			hasBorders: editable,
			selectable: editable,
			lockMovementX: !editable,
			lockMovementY: !editable,
			hoverCursor: !editable ? 'pointer' : 'move',
		};

		option.editable = editable;


		const newOption = Object.assign(
			{},
			objectOption,
			obj,
			{
				container: this.container.id,
				editable,
			},
			option,
		);


		let createdObj;
		// Create canvas object
		if (obj.type === 'image') {
			return
		} else if (obj.type === 'group') {
			const objects = this.addGroup(newOption, centered, loaded);
			const groupOption = Object.assign({}, newOption, { objects, name: 'New Group' });
			createdObj = this.fabricObjects[obj.type].create(groupOption);
		} else {

			const svgOption = newOption as SvgOption;

			if (svgOption) {
				newOption.onSvgLoaded = (loadResult: FabricObject) => {
					if (loadResult) { onSvgLoaded(loadResult) }
				}
			}

			let saveColor = svgOption.fill;
			let saveStroke = svgOption.stroke;

			createdObj = this.fabricObjects[obj.type].create(svgOption);



			if (obj.superType === 'drawing' && obj.type === 'line' && obj.name === "New line") {
				createdObj.stroke = "black";
			} else if (obj.name === "New shape" && saveObj === false) {
				createdObj.strokeWidth = 0;
			} else {
				createdObj.stroke = saveStroke
			}
		}

		this.canvas.add(createdObj);

		this.objects = this.getObjects();

		if (obj.superType !== 'drawing' && obj.superType !== 'link' && editable && !loaded && !obj.isEntireCanvasImport) {
			this.centerObject(createdObj, centered);
		}


		if (createdObj.superType === 'node') {
			createdObj.setShadow({
				color: createdObj.stroke,
			} as fabric.Shadow);
		}

		if (!this.transactionHandler.active && !loaded) {
			this.transactionHandler.save('add');
		}


		return createdObj;
	};

	public addGroup = (obj: FabricGroup, centered = true, loaded = false) => {
		return obj.objects.map(child => {
			return this.add(child, centered, loaded);
		});
	};

	public remove = (target?: FabricObject) => {
		const activeObject = target || (this.canvas.getActiveObject() as any);

		if (!activeObject) {
			return;
		}
		if (typeof activeObject.deletable !== 'undefined' && !activeObject.deletable) {
			return;
		}
		if (activeObject.type !== 'activeSelection') {
			this.canvas.discardActiveObject();


			this.canvas.remove(activeObject);
		} else {
			const { _objects: activeObjects } = activeObject;
			const existDeleted = activeObjects.some(
				(obj: any) => typeof obj.deletable !== 'undefined' && !obj.deletable,
			);
			if (existDeleted) {
				return;
			}
			this.canvas.discardActiveObject();
			activeObjects.forEach((obj: any) => {

				this.canvas.remove(obj);
			});
		}
		if (!this.transactionHandler.active) {
			this.transactionHandler.save('remove');
		}
		this.objects = this.getObjects();
		const { onRemove } = this;
		if (onRemove) {
			onRemove(activeObject);
		}
	};

	public addGrid = (dist: number = 0) => {

		if (Number(dist) === 0) {
			return
		}

		const longer = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight
		let canvasWidth = this.canvas.getWidth();
		let canvasHeight = this.canvas.getHeight();

		let distance = Number(dist);
		let vLine
		let hLine

		const lineDef = {
			fill: 'black',
			stroke: 'rgba(54, 48, 48, 0.072)',
			strokeWidth: 1,
			selectable: false,
			name: 'grid line',
			type: 'line',
			strokeLinejoin: "butt"
		}

	
		if (canvasWidth / 2 / distance < 1) {
			vLine = new fabric.Line([canvasWidth / 2, 0, canvasWidth / 2, canvasHeight], lineDef)
			hLine = new fabric.Line([0, canvasHeight / 2, canvasWidth, canvasHeight / 2], lineDef)

			this.canvas.sendBackwards(hLine)
			this.canvas.sendBackwards(vLine)

		} else {
			function toFixed(num, fixed) {
				var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
				return num.toString().match(re)[0];
			}
			const vNum = toFixed(canvasWidth / 2 / distance, 2) - (Math.ceil(canvasWidth / 2 / distance) - 1)
			console.log(vNum)
			const vLine1 = ((toFixed(vNum, 2) * 100).toFixed(0) / 100) * distance
			console.log(((toFixed(vNum, 2) * 100).toFixed(0) / 100) * distance)
			const hNum = toFixed(canvasHeight / 2 / distance, 2) - (Math.ceil(canvasHeight / 2 / distance) - 1)
			const hLine1 = ((toFixed(hNum, 2) * 100).toFixed(0) / 100) * distance

			for (let i = 0; i * distance < longer; i++) {
		

				vLine = new fabric.Line([i * distance + vLine1, 0, i * distance + vLine1, canvasHeight], lineDef)
				hLine = new fabric.Line([0, i * distance + hLine1, canvasWidth, i * distance + hLine1], lineDef)

				this.canvas.sendBackwards(hLine)
				this.canvas.sendBackwards(vLine)
			}
		}


	};

	public removeGrid = (target?: FabricObject) => {
		this.canvas.discardActiveObject();
		this.canvas.getObjects().forEach((obj: any) => {
			if (obj.name === 'grid line') {
				this.canvas.remove(obj)
			}
			this.canvas.renderAll();
		});

	};

	public removeById = (id: string) => {
		const findObject = this.findById(id);
		if (findObject) {
			this.remove(findObject);
		}
	};

	public removeOriginById = (id: string) => {
		const object = this.findOriginByIdWithIndex(id);
		if (object.index > 0) {
			this.objects.splice(object.index, 1);
		}
	};

	public duplicate = () => {
		const {

			propertiesToInclude,
			gridOption: { grid = 10 },
		} = this;
		const activeObject = this.canvas.getActiveObject() as FabricObject;

		if (!activeObject) {
			return;
		}
		if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
			return;
		}
		activeObject.clone((clonedObj: FabricObject) => {

			this.canvas.discardActiveObject();
			clonedObj.set({
				left: clonedObj.left + grid,
				top: clonedObj.top + grid,
				evented: true,
			});
			if (clonedObj.type === 'activeSelection') {
				const activeSelection = clonedObj as fabric.ActiveSelection;
				activeSelection.canvas = this.canvas;
				activeSelection.forEachObject((obj: any) => {
					obj.set('id', v4());
					this.canvas.add(obj);
					this.objects = this.getObjects();
					if (obj.dblclick) {
						obj.on('mousedblclick', this.eventHandler.object.mousedblclick);
					}
				});

				activeSelection.setCoords();
			} else {
				if (activeObject.id === clonedObj.id) {
					clonedObj.set('id', v4());
				}
				this.canvas.add(clonedObj);
				this.objects = this.getObjects();
				if (clonedObj.dblclick) {
					clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
				}

			}
			this.canvas.setActiveObject(clonedObj);

			this.canvas.requestRenderAll();
		}, propertiesToInclude);
	};

	public duplicateById = (id: string) => {
		const {

			propertiesToInclude,
			gridOption: { grid = 10 },
		} = this;
		const findObject = this.findById(id);
		if (findObject) {
			if (typeof findObject.cloneable !== 'undefined' && !findObject.cloneable) {
				return false;
			}
			findObject.clone((cloned: FabricObject) => {
				cloned.set({
					left: cloned.left + grid,
					top: cloned.top + grid,
					id: v4(),
					evented: true,
				});
				this.canvas.add(cloned);
				this.objects = this.getObjects();

				if (cloned.dblclick) {
					cloned.on('mousedblclick', this.eventHandler.object.mousedblclick);
				}
				this.canvas.setActiveObject(cloned);

				this.canvas.requestRenderAll();
			}, propertiesToInclude);
		}
		return true;
	};

	public cut = () => {
		this.copy();
		this.remove();
		this.isCut = true;
	};

	public copyToClipboard = (value: any) => {
		const textarea = document.createElement('textarea');
		document.body.appendChild(textarea);
		textarea.value = value;
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
		this.canvas.wrapperEl.focus();
	};

	public copy = () => {
		const { propertiesToInclude } = this;
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject && activeObject.superType === 'link') {
			return false;
		}
		if (activeObject) {
			if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
				return false;
			}
			if (activeObject.type === 'activeSelection') {
				const activeSelection = activeObject as fabric.ActiveSelection;
				if (activeSelection.getObjects().some((obj: any) => obj.superType === 'node')) {
					if (this.keyEvent.clipboard) {
						const links = [] as any[];
						const objects = activeSelection.getObjects().map((obj: any, index: number) => {
							if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
								return null;
							}
							if (obj.fromPort.length) {
								obj.fromPort.forEach((port: any) => {
									if (port.links.length) {
										port.links.forEach((link: any) => {
											const linkTarget = {
												fromNodeIndex: index,
												fromPortId: port.id,
												type: 'curvedLink',
												superType: 'link',
											} as any;
											const findIndex = activeSelection
												.getObjects()
												.findIndex((compObj: any) => compObj.id === link.toNode.id);
											if (findIndex >= 0) {
												linkTarget.toNodeIndex = findIndex;
												links.push(linkTarget);
											}
										});
									}
								});
							}
							return {
								name: obj.name,
								description: obj.description,
								superType: obj.superType,
								type: obj.type,
								nodeClazz: obj.nodeClazz,
								configuration: obj.configuration,
								properties: {
									left: activeObject.left + activeObject.width / 2 + obj.left || 0,
									top: activeObject.top + activeObject.height / 2 + obj.top || 0,
									iconName: obj.descriptor.icon,
								},
							};
						});
						this.copyToClipboard(JSON.stringify(objects.concat(links), null, '\t'));
						return true;
					}
					this.clipboard = activeObject;
					return true;
				}
			}
			activeObject.clone((cloned: FabricObject) => {
				if (this.keyEvent.clipboard) {
					if (cloned.superType === 'node') {
						const node = {
							name: cloned.name,
							description: cloned.description,
							superType: cloned.superType,
							type: cloned.type,
							nodeClazz: cloned.nodeClazz,
							configuration: cloned.configuration,
							properties: {
								left: cloned.left || 0,
								top: cloned.top || 0,
								iconName: cloned.descriptor.icon,
							},
						};
						const objects = [node];
						this.copyToClipboard(JSON.stringify(objects, null, '\t'));
					} else {
						this.copyToClipboard(JSON.stringify(cloned.toObject(propertiesToInclude), null, '\t'));
					}
				} else {
					this.clipboard = cloned;
				}
			}, propertiesToInclude);
		}
		return true;
	};

	public paste = () => {
		const {

			propertiesToInclude,
			gridOption: { grid = 10 },
			clipboard,
			isCut,
		} = this;
		const padding = isCut ? 0 : grid;
		if (!clipboard) {
			return false;
		}
		if (typeof clipboard.cloneable !== 'undefined' && !clipboard.cloneable) {
			return false;
		}
		this.isCut = false;
		if (clipboard.type === 'activeSelection') {

		}
		clipboard.clone((clonedObj: any) => {
			this.canvas.discardActiveObject();
			clonedObj.set({
				left: clonedObj.left + padding,
				top: clonedObj.top + padding,
				id: isCut ? clipboard.id : v4(),
				evented: true,
			});
			if (clonedObj.type === 'activeSelection') {
				clonedObj.canvas = this.canvas;
				clonedObj.forEachObject((obj: any) => {
					obj.set('id', isCut ? obj.id : v4());
					this.canvas.add(obj);
					if (obj.dblclick) {
						obj.on('mousedblclick', this.eventHandler.object.mousedblclick);
					}
				});
			} else {
				if (clonedObj.superType === 'node') {
					clonedObj = clonedObj.duplicate();
				}
				this.canvas.add(clonedObj);
				if (clonedObj.dblclick) {
					clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
				}
			}
			const newClipboard = clipboard.set({
				top: clonedObj.top,
				left: clonedObj.left,
			});
			if (isCut) {
				this.clipboard = null;
			} else {
				this.clipboard = newClipboard;
			}

			if (!this.transactionHandler.active) {
				this.transactionHandler.save('paste');
			}
			// TODO...
			// After toGroup svg elements not rendered.
			this.objects = this.getObjects();

			clonedObj.setCoords();
			this.canvas.setActiveObject(clonedObj);
			this.canvas.requestRenderAll();
		}, propertiesToInclude);
		return true;
	};

	public find = (obj: FabricObject) => this.findById(obj.id);

	public findById = (id: string): FabricObject | null => {
		let findObject;
		const exist = this.objects.some(obj => {
			if (obj.id === id) {
				findObject = obj;
				return true;
			}
			return false;
		});
		if (!exist) {
			warning(true, 'Not found object by id.');
			return null;
		}
		return findObject;
	};

	public findOriginById = (id: string) => {
		let findObject: FabricObject;
		const exist = this.objects.some(obj => {
			if (obj.id === id) {
				findObject = obj;
				return true;
			}
			return false;
		});
		if (!exist) {
			console.warn('Not found object by id.');
			return null;
		}
		return findObject;
	};

	public findOriginByIdWithIndex = (id: string) => {
		let findObject;
		let index = -1;
		const exist = this.objects.some((obj, i) => {
			if (obj.id === id) {
				findObject = obj;
				index = i;
				return true;
			}
			return false;
		});
		if (!exist) {
			console.warn('Not found object by id.');
			return {};
		}
		return {
			object: findObject,
			index,
		};
	};

	public select = (obj: FabricObject, find?: boolean) => {
		let findObject = obj;
		if (find) {
			findObject = this.find(obj);
		}
		if (findObject) {
			this.canvas.discardActiveObject();
			this.canvas.setActiveObject(findObject);
			this.canvas.requestRenderAll();
		}
	};

	public selectById = (id: string) => {
		const findObject = this.findById(id);
		if (findObject) {
			this.canvas.discardActiveObject();
			this.canvas.setActiveObject(findObject);
			this.canvas.requestRenderAll();
		}
	};

	public selectAll = () => {
		this.canvas.discardActiveObject();
		const filteredObjects = this.canvas.getObjects().filter((obj: any) => {
			if (obj.id === 'workarea') {
				return false;
			} else if (!obj.evented) {
				return false;
			} else if (obj.superType === 'link') {
				return false;
			} else if (obj.superType === 'port') {
				return false;
			} else if (obj.superType === 'element') {
				return false;
			} else if (obj.locked) {
				return false;
			}
			return true;
		});
		if (!filteredObjects.length) {
			return;
		}
		if (filteredObjects.length === 1) {
			this.canvas.setActiveObject(filteredObjects[0]);
			this.canvas.renderAll();
			return;
		}
		const activeSelection = new fabric.ActiveSelection(filteredObjects, {
			canvas: this.canvas,
			...this.activeSelectionOption,
		});
		this.canvas.setActiveObject(activeSelection);
		this.canvas.renderAll();
	};

	public originScaleToResize = (obj: FabricObject, width: number, height: number) => {
		if (obj.id === 'workarea') {
			this.setByPartial(obj, {
				workareaWidth: obj.width,
				workareaHeight: obj.height,
			});
		}
		this.setByPartial(obj, {
			scaleX: width / obj.width,
			scaleY: height / obj.height,
		});
	};

	public importJSON = async (json: any, callback?: (canvas: FabricCanvas) => void) => {

		if (typeof json === 'string') {
			json = JSON.parse(json);
		}
		let prevLeft = 0;
		let prevTop = 0;
		this.canvas.setBackgroundColor(this.canvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
		// const workareaExist = json.filter((obj: FabricObjectOption) => obj.id === 'workarea');
		// if (!this.workarea) {
		// 	this.workareaHandler.initialize();
		// }
		// if (!workareaExist.length) {
		// 	this.canvas.centerObject(this.workarea);
		// 	this.workarea.setCoords();
		// 	prevLeft = this.workarea.left;
		// 	prevTop = this.workarea.top;
		// } else {
		// 	const workarea = workareaExist[0];
		// 	prevLeft = workarea.left;
		// 	prevTop = workarea.top;
		// 	this.workarea.set(workarea);
		// 	await this.workareaHandler.setImage(workarea.src, true);
		// 	this.workarea.setCoords();
		// }
		json.forEach((obj: FabricObjectOption) => {
			obj.id = v4()

			this.add(obj, false, true, true);
			this.canvas.renderAll();
		});
		this.objects = this.getObjects();
		if (callback) {
			callback(this.canvas);
		}
		return Promise.resolve(this.canvas);
	};

	public exportJSON = () => this.canvas.toObject(this.propertiesToInclude).objects as FabricObject[];

	public exportSVG = () => {
		return this.canvas.toSVG({ suppressPreamble: true });
	};

	public saveProjects = (isGridActive, option = { name: 'New Image', format: 'png', quality: 1 }) => {
		const aObj = this.canvas.getActiveObject()

		if (isGridActive && aObj) {
			this.removeGrid()
		}
		return {
			dataUrl: this.canvas.toDataURL(option),
			aObj: aObj,
			allObjects: this.exportJSON(),
		}
	};

	public saveImage = (targetObject: FabricObject, option = { name: 'New Image', format: 'png', quality: 1 }) => {
		let dataUrl;
		let target = targetObject;
		if (target) {
			dataUrl = target.toDataURL(option);
		} else {
			target = this.canvas.getActiveObject() as FabricObject;
			if (target) {
				dataUrl = target.toDataURL(option);
			}
		}
		if (dataUrl) {
			const anchorEl = document.createElement('a');
			anchorEl.href = dataUrl;
			anchorEl.download = `${option.name}.png`;
			document.body.appendChild(anchorEl); // required for firefox
			anchorEl.click();
			anchorEl.remove();
		}
	};

	public toGroup = (target?: FabricObject) => {
		const activeObject = target || (this.canvas.getActiveObject() as fabric.ActiveSelection);
		if (!activeObject) {
			return null;
		}
		if (activeObject.type !== 'activeSelection') {
			return null;
		}
		const group = activeObject.toGroup() as FabricObject<fabric.Group>;
		group.set({
			id: v4(),
			name: 'New group',
			type: 'group',
			...this.objectOption,
		});
		this.objects = this.getObjects();
		if (!this.transactionHandler.active) {
			this.transactionHandler.save('group');
		}
		if (this.onSelect) {
			this.onSelect(group);
		}
		this.canvas.renderAll();
		return group;
	};


	public toActiveSelection = (target?: FabricObject) => {
		const activeObject = target || (this.canvas.getActiveObject() as fabric.Group);
		if (!activeObject) {
			return;
		}
		if (activeObject.type !== 'group') {
			return;
		}
		const activeSelection = activeObject.toActiveSelection();
		this.objects = this.getObjects();
		if (!this.transactionHandler.active) {
			this.transactionHandler.save('ungroup');
		}
		if (this.onSelect) {
			this.onSelect(activeSelection);
		}
		this.canvas.renderAll();
		return activeSelection;
	};

	public bringForward = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {
			this.canvas.bringForward(activeObject);
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('bringForward');
			}

		}
	};

	public bringToFront = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {
			this.canvas.bringToFront(activeObject);
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('bringToFront');
			}

		}
	};

	public sendBackwards = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {
			const firstObject = this.canvas.getObjects()[1] as FabricObject;
			if (firstObject.id === activeObject.id) {
				return;
			}
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('sendBackwards');
			}
			this.canvas.sendBackwards(activeObject);

		}
	};

	public sendToBack = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {
			this.canvas.sendToBack(activeObject);
			this.canvas.sendToBack(this.canvas.getObjects()[1]);
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('sendToBack');
			}

		}
	};

	public clear = (includeWorkarea = false) => {
		const ids = this.canvas.getObjects().reduce((prev, curr: any) => {
			if (curr.superType === 'element') {
				prev.push(curr.id);
				return prev;
			}
			return prev;
		}, []);

		if (includeWorkarea) {
			this.canvas.clear();
			this.workarea = null;
		} else {
			this.canvas.discardActiveObject();
			this.canvas.getObjects().forEach((obj: any) => {
				if (obj.id === 'grid' || obj.id === 'workarea') {
					return;
				}
				this.canvas.remove(obj);
			});
		}
		this.objects = this.getObjects();
		this.canvas.renderAll();
	};

	public startRequestAnimFrame = () => {
		if (!this.isRequsetAnimFrame) {
			this.isRequsetAnimFrame = true;
			const render = () => {
				this.canvas.renderAll();
				this.requestFrame = fabric.util.requestAnimFrame(render);
			};
			fabric.util.requestAnimFrame(render);
		}
	};

	public saveCanvasImage = (dataUrl: string, option = { name: 'New Image', format: 'png', quality: 1 }) => {

		if (dataUrl) {
			const anchorEl = document.createElement('a');
			anchorEl.href = dataUrl;
			anchorEl.download = `${option.name}.png`;
			document.body.appendChild(anchorEl); // required for firefox
			anchorEl.click();
			anchorEl.remove();
		}
	};

	public rotate = (angle: number) => {
		const activeObject = this.canvas.getActiveObject();
		if (activeObject) {
			this.set('rotation', angle);
			activeObject.rotate(angle);
			this.canvas.requestRenderAll();
		}
	};

	public setCanvasOption = (canvasOption: CanvasOption) => {
		this.canvasOption = Object.assign({}, this.canvasOption, canvasOption);
		this.canvas.setBackgroundColor(canvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
		if (typeof canvasOption.width !== 'undefined' && typeof canvasOption.height !== 'undefined') {
			if (this.eventHandler) {
				this.eventHandler.resize(canvasOption.width, canvasOption.height);
			} else {
				this.canvas.setWidth(canvasOption.width).setHeight(canvasOption.height);
			}
		}
		if (typeof canvasOption.selection !== 'undefined') {
			this.canvas.selection = canvasOption.selection;
		}
		if (typeof canvasOption.hoverCursor !== 'undefined') {
			this.canvas.hoverCursor = canvasOption.hoverCursor;
		}
		if (typeof canvasOption.defaultCursor !== 'undefined') {
			this.canvas.defaultCursor = canvasOption.defaultCursor;
		}
		if (typeof canvasOption.preserveObjectStacking !== 'undefined') {
			this.canvas.preserveObjectStacking = canvasOption.preserveObjectStacking;
		}
	};

	public setKeyEvent = (keyEvent: KeyEvent) => {
		this.keyEvent = Object.assign({}, this.keyEvent, keyEvent);
	};

	public setFabricObjects = (fabricObjects: FabricObjects) => {
		this.fabricObjects = Object.assign({}, this.fabricObjects, fabricObjects);
	};

	public setWorkareaOption = (workareaOption: WorkareaOption) => {
		this.workareaOption = Object.assign({}, this.workareaOption, workareaOption);
		if (this.workarea) {
			this.workarea.set({
				...workareaOption,
			});
		}
	};

	public setGuidelineOption = (guidelineOption: GuidelineOption) => {
		this.guidelineOption = Object.assign({}, this.guidelineOption, guidelineOption);
		if (this.guidelineHandler) {
			this.guidelineHandler.initialize();
		}
	};

	public setGridOption = (gridOption: GridOption) => {
		this.gridOption = Object.assign({}, this.gridOption, gridOption);
	};

	public setObjectOption = (objectOption: FabricObjectOption) => {
		this.objectOption = Object.assign({}, this.objectOption, objectOption);
	};

	public setActiveSelectionOption = (activeSelectionOption: Partial<FabricObjectOption<fabric.ActiveSelection>>) => {
		this.activeSelectionOption = Object.assign({}, this.activeSelectionOption, activeSelectionOption);
	};

	public setPropertiesToInclude = (propertiesToInclude: string[]) => {
		this.propertiesToInclude = union(propertiesToInclude, this.propertiesToInclude);
	};
}

export default Handler;
