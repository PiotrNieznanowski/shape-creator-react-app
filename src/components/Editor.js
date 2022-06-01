
// import "./../styles/index.scss";
// import "./../styles/index.css";
// import "./../styles/icons.css";
import React, { Component } from "react";
import styled from "styled-components";
import { Badge, Button } from "antd";
import ItemsToolbar from "./ItemsToolbar";
import HeaderToolbar from "./HeaderToolbar";
import Canvas from "./canvas/Canvas.tsx";
import Configurations from "./Configurations";
import FooterToolbar from "./FooterToolbar";
import descriptors from './configurationFiles/Descriptors.json';
import { defaultOptions } from "./configurationFiles/defaultOptions";
import { propertiesToInclude } from "./configurationFiles/propertiesToInclude";


class Editor extends Component {

  state = {
    selectedItem: null,
    preview: false,
    progress: 0,
    animations: [],
    styles: [],
    dataSources: [],
    editing: false,
    descriptors: {},
    objects: undefined,
  };


  componentDidMount() {
    this.setState({
      descriptors: descriptors,
      selectedItem: null
    })
  }

  canvasHandlers = {

    onSelect: (target) => {
      const { selectedItem } = this.state;

      if (
        target &&
        target.id &&
        target.id !== "workarea" &&
        target.type !== "activeSelection"
      ) {
        if (selectedItem && target.id === selectedItem.id) {
          return;
        }


        this.setState({
          selectedItem: target,
        });

        return;
      }
      this.canvasRef.handler.getObjects().forEach((obj) => {
        if (obj) {
          // this.canvasRef.handler.animationHandler.resetAnimation(obj, true);
        }
      });
      this.setState({
        selectedItem: null,
      });
    },

    onRemove: () => {

      this.canvasHandlers.onSelect(null);
    },

    onChange: (newValue, nameProperty) => {

      const { selectedItem } = this.state;

      if (nameProperty === "color") {
        selectedItem.set({
          fill: newValue
        });
      };
      if (nameProperty === "opacity") {
        selectedItem.set({
          opacity: newValue
        });
      };
      if (nameProperty === "strokeWidth") {

        selectedItem.set({
          strokeWidth: newValue
        });
      }
      if (nameProperty === "strokeColor") {

        selectedItem.set({
          stroke: newValue
        });
      }
      if (nameProperty === "radius") {

        selectedItem.set({
          rx: newValue,
          ry: newValue
        });
      }

      this.canvasRef.canvas.renderAll();


    },

    onClick: (canvas, target) => {
      const { link } = target;
      if (link.state === "current") {
        document.location.href = link.url;
        return;
      }
      window.open(link.url);
    },

    onTransaction: (transaction) => {
      this.forceUpdate();
    },
  };

  render() {
    const { selectedItem, descriptors } = this.state;

    const { onRemove, onSelect, onChange, onClick, onTransaction } = this.canvasHandlers;

    return (
      <Container >

        <HeaderToolbar
          canvasRef={this.canvasRef}
        />
        <ItemsToolbar
          canvasRef={this.canvasRef}
          descriptors={descriptors}
          selectedItem={selectedItem}
        />

        <Canvas
          ref={(c) => { this.canvasRef = c }}
          objectOption={defaultOptions}
          propertiesToInclude={propertiesToInclude}
          onRemove={onRemove}
          onSelect={onSelect}
          onClick={onClick}
          onTransaction={onTransaction}
        />

        <Configurations
          canvasRef={this.canvasRef}
          onChange={onChange}
          selectedItem={selectedItem}
        />
        <FooterToolbar
          canvasRef={this.canvasRef}
        />

      </Container>
    );
  }
}

export default Editor

const Container = styled.div`
background:#EDEDED ;
width: 100vw; 
height: 100vh;
display: grid;
padding:10px;
grid-template-columns: 80px 1fr 400px;
grid-template-rows: 80px 1fr;
grid-column-gap: 10px;
grid-row-gap: 10px;
`
