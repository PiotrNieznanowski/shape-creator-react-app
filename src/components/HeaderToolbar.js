import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import { CommonButton } from "./common";
import { v4 } from 'uuid';

function HeaderToolbar(props) {

  const { canvasRef } = props;
  const dispatch = useDispatch();
  const gridVisible = useSelector(state => state.gridIsActive)

  const [collapse, setCollapse] = useState(false);

  function handlerCollaps() {
    setCollapse(!collapse)
  };

  const handlerAddingProject = () => {

    const data = canvasRef.handler.saveProjects(gridVisible);
    const { dataUrl, aObj, allObjects } = data;

    if (!aObj) {
      return
    } else {
      dispatch({
        type: 'addingProject',
        payload: {
          dataUrl: dataUrl,
          key: v4(),
          allObjectsToRender: allObjects
        }
      })
      dispatch({
        type: 'resetCurrentProject',
        payload: null,
      })
    }

    canvasRef.handler.clear();

    if (gridVisible === false) {
      return
    } else {
      canvasRef.handler.addGrid()
    }
  }

  return (

    <Container>

      <CommonButton
        className="rde-action-btn"
        shape="circle"
        tooltipTitle={'Save'}
        tooltipPlacement={'bottom'}
        onClick={() => handlerAddingProject()}
        icon="image"
        style={{ fontSize: '25px', margin: '15px' }}

      />

      <CommonButton
        className="rde-action-btn"
        shape="circle"
        tooltipTitle={'Clone'}
        tooltipPlacement={'bottom'}
        onClick={() => canvasRef.handler?.duplicate()}
        icon="clone"
        style={{ fontSize: '25px', margin: '15px' }}

      />
      <CommonButton
        className="rde-action-btn"
        shape="circle"
        tooltipTitle={'Remove'}
        tooltipPlacement={'bottom'}
        onClick={() => canvasRef.handler?.remove()}
        icon="trash"
        style={{ fontSize: '25px', margin: '15px' }}
      />
      <CommonButton
        className="rde-action-btn"
        disabled={(canvasRef && !canvasRef.handler?.transactionHandler.undos.length)}
        onClick={() => canvasRef.handler?.transactionHandler.undo()}
        style={{ fontSize: '25px', margin: '15px' }}
        tooltipTitle={'Undo'}
        tooltipPlacement={'bottom'}
        shape="circle"
        icon="undo-alt"
      />

      <CommonButton
        className="rde-action-btn"
        disabled={(canvasRef && !canvasRef.handler?.transactionHandler.redos.length)}
        onClick={() => canvasRef.handler?.transactionHandler.redo()}
        style={{ fontSize: '25px', margin: '15px' }}
        tooltipTitle={'Redo'}
        tooltipPlacement={'bottom'}
        shape="circle"
        icon="redo-alt"
      />
    </Container>
  );
}


export default HeaderToolbar;

const Container = styled.div`
grid-area: 1 / 1 / 2 / 3;
width:100% ;
height:100% ;
display:flex;
flex-direction: row;
flex-wrap: nowrap;
justify-content:center;
align-items:baseline;

`












