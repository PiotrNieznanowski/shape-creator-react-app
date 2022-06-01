import React from 'react';
import { Slider, Select, InputNumber, Form } from 'antd';
import styled from "styled-components";
import ColorPicker from './ColorPicker';
import { CirclePicker } from 'react-color';

export default {
	render(canvasRef, selectedItem, changeValues) {


		return (
			<Wrapper>
				<WrapEditorFigure>
					{/* <Span>
						{getFieldDecorator('fill', {
							initialValue: selectedItem.fill || 'rgba(0, 0, 0, 1)',
						})(<ColorPicker />)}
					</Span>
					<Span>color</Span> */}
				</WrapEditorFigure>

				<WrapEditorFigure>
					
					<Form>
					<Span>Color</Span>
						<Form.Item
							
							initialValue={selectedItem.fill || 'rgba(255, 255, 255, 0)'}
							name="color"
						>
							<CirclePicker colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7"]} onChangeComplete={(e)=>changeValues(e, 'color')} />
						</Form.Item>
						<Span>Opacity</Span>
						<Form.Item
							getValueFromEvent={(value) => changeValues(value, "opacity")}
							initialValue={selectedItem.opacity || 1}
							name="opacity"
							rules={[
								{
									type: 'number',
									min: 0,
									max: 1,
								},
							]}

						>
							<Slider reverse min={0} max={1} step={0.1} />
						</Form.Item>

						<Span>Stroke Width</Span>
						<Form.Item
							getValueFromEvent={(value) => changeValues(value, "strokeWidth")}
							initialValue={selectedItem.strokeWidth || 0}
							name="strokeWidth"
						>
							<Select showSearch style={{ width: '100%' }}>
								{Array.from({ length: 22 }, (v, k) => {
									const value = k + 1;
									return (
										<Select.Option key={value} value={value}>
											{value}
										</Select.Option>
									);
								})}
							</Select>
						</Form.Item>

						<Span>Stroke Color</Span>
						<Form.Item
					
							initialValue={selectedItem.stroke || 'rgba(255, 255, 255, 0)'}
							name="strokeColor"
						>
							<CirclePicker  onChangeComplete={(e)=>changeValues(e, 'strokeColor')} />
						</Form.Item>
						<Span>Radius</Span>
						<Form.Item
							getValueFromEvent={(value) => changeValues(value, "radius")}
							initialValue={selectedItem.rx || 1}
							name="radius"
							rules={[
								{
									type: 'number',
									min: 0,
									max: 100,
								},
							]}

						>
							<Slider min={0} max={100} step={1} />
						</Form.Item>

					</Form>
				</WrapEditorFigure>

				{/* <WrapEditorFigure>
					<Span>
						{getFieldDecorator('stroke', {
							initialValue: selectedItem.stroke || 'rgba(255, 255, 255, 0)',
						})(<ColorPicker />)}
					</Span>
					<Span>stroke-color</Span>
				</WrapEditorFigure>

				<WrapEditorFigure colon={false}>
					<Span>
						{getFieldDecorator('strokeWidth', {
							initialValue: selectedItem.strokeWidth || 1,
						})(
							<Select showSearch style={{ width: '100%' }}>
								{Array.from({ length: 22 }, (v, k) => {
									const value = k + 1;
									return (
										<Select.Option key={value} value={value}>
											{value}
										</Select.Option>
									);
								})}
							</Select>,
						)}
					</Span>
					
					<Span>stroke-width</Span>
				</WrapEditorFigure>

				<WrapEditorFigure>
					<Span>
						{getFieldDecorator('rx', {
							initialValue: selectedItem.rx || 0,
						})(<InputNumber min={0} />)}
					</Span>
					<Span>rx</Span>
				</WrapEditorFigure>


				<WrapEditorFigure>
					<Span>
						{getFieldDecorator('ry', {
							initialValue: selectedItem.ry || 0,
						})(<InputNumber min={0} />)}
					</Span>
					<Span>ry</Span>
				</WrapEditorFigure> */}

			</Wrapper>
		);
	},
};

const Wrapper = styled.div`
margin: 5px 25px;
width:250px ;
background: #333131 ;
color:white;
justify-content:center;
align-items:center;
flex-direction: row;
flex-wrap: wrap;
`

const WrapEditorFigure = styled.div`
margin: 15px 0px;
width:100% ;
background: #333131 ;
color:white
`
const Span = styled.div`
margin: 5px;
background: #333131 ;
color:white;
`

