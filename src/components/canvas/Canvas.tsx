// @ts-nocheck
import React, { Component } from 'react';
import styled from "styled-components";
import { fabric } from 'fabric';
import { v4 } from 'uuid';
import ResizeObserver from 'resize-observer-polyfill';
import { FabricCanvas } from './utils';
import { defaults } from './constants';


import Handler, { HandlerOptions } from './handlers/Handler';

export type CanvasProps = HandlerOptions & {
	responsive?: boolean;
	style?: React.CSSProperties;
	ref?: React.RefAttributes<Handler>;
};

interface IState {
	id: string;
	loaded: boolean;
}

class Canvas extends Component<CanvasProps, IState> {
	public handler: Handler;
	public canvas: FabricCanvas;
	public container = React.createRef<HTMLDivElement>();
	private resizeObserver: ResizeObserver;
	static defaultProps: CanvasProps = {
		id: v4(),
		editable: true,
		responsive: true,
		width: 0,
		height: 0,
	};

	state: IState = {
		id: v4(),
		loaded: true,
	};

	componentDidMount() {

		const { editable, canvasOption, width, height, responsive, ...other } = this.props;
		const { id } = this.state;
		const mergedCanvasOption = Object.assign({}, defaults.canvasOption, canvasOption, {
			width,
			height,
			selection: editable,
		});
		this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption);

		this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
		this.canvas.renderAll();
		this.handler = new Handler({
			id,
			width,
			height,
			editable,
			canvas: this.canvas,
			container: this.container.current,
			canvasOption: mergedCanvasOption,
			...other,
		});

		if (this.props.responsive) {
			this.createObserver();
		}
	}

	createObserver = () => {
		this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			const { width = 0, height = 0 } = (entries[0] && entries[0].contentRect) || {};

			this.handler.eventHandler.resize(width, height);
		});
		this.resizeObserver.observe(this.container.current);
	};

	render() {

		return (
			<Container ref={this.container} id={this.state.id}>
				<canvas id={`canvas_${this.state.id}`} />
			</Container>
		);
	}
}

export default Canvas;

const Container = styled.div`
grid-area: 2 / 2 / 3 / 3;
/* border:1px dotted #333131; */

`

