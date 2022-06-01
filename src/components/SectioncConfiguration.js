import React, { Component } from "react";
import styled from "styled-components";
import { itemStyleProperty } from './configurationFiles/itemStyleProperty'

class SectioncConfiguration extends Component {

  render() {
    const { onChange, selectedItem, canvasRef } = this.props;

    const changeValues = (newValue, nameProperty) => {

      if (newValue.hex) {
        let setColor = newValue.hex;
        onChange(setColor, nameProperty);
        return
      }
      onChange(newValue, nameProperty)
    }

    if (canvasRef) {

      return (
        <Container >
          {selectedItem && itemStyleProperty[selectedItem.type]
            ?
            <>
              {itemStyleProperty[selectedItem.type].style.component.render(canvasRef, selectedItem, changeValues)}
            </>
            : <h2 style={{ color: '#EFEFEF' }}>
              <span style={{ color: '#FF851B' }}>Select</span>  a figure from the side menu or select it on the canvas.
            </h2>
          }
        </Container>
      );
    }
    return null;
  }
}

export default SectioncConfiguration;

const Container = styled.div`

display:flex ;
height:100% ;
width:100% ;
justify-content:center;
align-items:center;
flex-direction: row;
flex-wrap: wrap;
background: #333131 ;
padding:20px ;

`



