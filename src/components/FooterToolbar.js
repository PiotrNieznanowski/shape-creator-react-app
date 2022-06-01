import React, { useState, Component } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, Switch, Tooltip, Input } from "antd";
import { fabric } from 'fabric';

import CommonButton from "./common/CommonButton";

function FooterToolbar(props) {

  const { canvasRef } = props
  const dispatch = useDispatch();

  const [distance, setDistance] = useState(0);
  const [switchChecked, setSwitchChecked] = useState();

  const showGrid = (checked) => {

    if (checked) {
      
      canvasRef.handler.addGrid(distance)

      dispatch({
        type: 'setActiveGrid',
        payload: true
      })
    } else {

      canvasRef.handler.removeGrid()
      dispatch({
        type: 'setActiveGrid',
        payload: false
      })
    }
    setSwitchChecked(checked)
  }

  const handleChange = (e) => { setDistance(e.target.value) };

  return (
    <React.Fragment>
      {/* <div className="rde-editor-footer-toolbar-interaction">
					<Button.Group>
						<CommonButton
							type={interactionMode === 'selection' ? 'primary' : 'default'}
							style={{ borderBottomLeftRadius: '8px', borderTopLeftRadius: '8px' }}
							onClick={() => {
								selection();
							}}
							icon="mouse-pointer"
							tooltipTitle='action'
						/>
						<CommonButton
							type={interactionMode === 'grab' ? 'primary' : 'default'}
							style={{ borderBottomRightRadius: '8px', borderTopRightRadius: '8px' }}
							onClick={() => {
								grab();
							}}
							tooltipTitle={i18n.t('action.grab')}
							icon="hand-rock"
						/>
					</Button.Group>
				</div>
        <div className="rde-editor-footer-toolbar-zoom">
          <Button.Group>
            <CommonButton
              style={{
                borderBottomLeftRadius: "8px",
                borderTopLeftRadius: "8px",
              }}
              onClick={() => {
                canvasRef.handler.zoomHandler.zoomOut();
              }}
              icon="search-minus"
              tooltipTitle={i18n.t("action.zoom-out")}
            />
            <CommonButton
              onClick={() => {
                canvasRef.handler.zoomHandler.zoomOneToOne();
              }}
              tooltipTitle={i18n.t("action.one-to-one")}
            >
              {`${zoomValue}%`}
            </CommonButton>
            <CommonButton
              onClick={() => {
                canvasRef.handler.zoomHandler.zoomToFit();
              }}
              tooltipTitle={i18n.t("action.fit")}
              icon="expand"
            />
            <CommonButton
              style={{
                borderBottomRightRadius: "8px",
                borderTopRightRadius: "8px",
              }}
              onClick={() => {
                canvasRef.handler.zoomHandler.zoomIn();
              }}
              icon="search-plus"
              tooltipTitle={i18n.t("action.zoom-in")}
            />
          </Button.Group>
        </div> */}
      <DistanceSection>
        <InputStyle
          onChange={handleChange}
          placeholder={distance}
          maxLength={3}
          disabled = {switchChecked}
        />
         <Tooltip >
          <Switch disabled={distance === 0 ? true : false} onChange={showGrid} />
        </Tooltip>
      </DistanceSection>
    </React.Fragment>
  );

}

export default FooterToolbar;

const DistanceSection = styled.div`

    display:flex ;
    flex-direction:row;
    flex-wrap:nowrap;
    justify-content: center;
    position:absolute;
    bottom:0;
    align-items:center;
    width:250px ;
    /* height: 100%; */
    /* outline-offset:-5px;
    outline: 1px solid #E5851B; */
    border-radius: 15px;
    text-align: center;
    margin-left: 30px;
    padding:15px ;
    
    
`

const InputStyle = styled(Input)`
 width:50px ;
 border-radius:15px ;
 margin-right:10px ;
    
`
