import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { message } from "antd";
import { v4 } from "uuid";
import { CommonButton } from "./common";
import { SVGModal } from "./common";

function ItemsToolbar(props) {

  const [svgModalVisible, setSvgModalVisible] = useState(false);

  const handlers = {
    onAddItem: (item, centered) => {
      const { canvasRef, selectedItem, thickness } = props;

      if (canvasRef.handler.interactionMode === "polygon") {
        message.info("Already drawing");
        return;
      }
      const id = v4();
      const option = Object.assign({}, item.option, { id });
      if (item.option.superType === "svg" && item.type === "default") {
        handlers.onSVGModalVisible(item.option);
        return;
      }
      option.thickness = thickness

      canvasRef.handler.add(option, centered);

    },
    onAddSVG: (option, centered) => {
      const { canvasRef, thickness } = props;
      
      canvasRef.handler.add(
        { ...option, type: "svg", superType: "svg", id: v4(), name: "New SVG", thickness: thickness },
        centered
      );
      handlers.onSVGModalVisible();
    },
    onDrawingItem: (item) => {

      const { canvasRef } = props;
      if (canvasRef.handler.interactionMode === "polygon") {
        message.info("Already drawing");
        return;
      }
      item.name === 'Polygon' ? canvasRef.handler.drawingHandler.polygon.init() : canvasRef.handler.drawingHandler.polyline.init()
    },
    onSVGModalVisible: () => {
      setSvgModalVisible(!svgModalVisible)
    }
  };

  const renderItems = (items, key) => (
    <WrapItems key={key}>
      {Array.isArray(items)
        ?
        items.map((item) => {
          return (
            <WrapItem key={item.name} >
              <div style={{ width: '100%', textAlign: 'center' }}>{item.name}</div>
              {renderItem(item)}
            </WrapItem>
          )
        })
        :
        ""}
    </WrapItems>
  );

  const renderItem = (item, centered) =>
    item.type === "drawing" ? (
      <CommonButton
        className="rde-action-btn"
        shape="circle"
        icon={item.icon.name}
        style={{ fontSize: '25px', margin: '5px' }}
        onClick={(e) => handlers.onDrawingItem(item)}
      />
    ) : (
      <CommonButton
        className="rde-action-btn"
        shape="circle"
        icon={item.icon.name}
        style={{ fontSize: '25px', margin: '5px' }}
        onClick={(e) => handlers.onAddItem(item, centered)}
      />
    );

  const { canvasRef, descriptors, selectedItem } = props

  return (
    <Container  >
      {descriptors ? Object.keys(descriptors).map((key, i) => renderItems(descriptors[key], i)) : null}
      <SVGModal
        visible={svgModalVisible}
        onOk={handlers.onAddSVG}
        onCancel={handlers.onSVGModalVisible}
      />
    </Container>
  );

}

export default ItemsToolbar;

const Container = styled.div`
grid-area: 2 / 1 / 3 / 2;
`

const WrapItems = styled.div`
display: flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content: space-evenly;
align-items: center;
width:100% ;
height:100% ;
`
const WrapItem = styled.div`
width:100% ;
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-items:center;
justify-content:center;
`
