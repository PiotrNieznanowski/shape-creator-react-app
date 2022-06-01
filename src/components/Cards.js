import React, { useState } from "react";
import styled from "styled-components";
import { CommonButton } from "./common";
import OutsideClickHandler from 'react-outside-click-handler';
function Cards(props) {

  const {
    key,
    obj,
    handlerRemoveProject,
    setCurrentProject,
    handlerAddProjectToCanvas,
    canvasRef,
    disable,
  } = props

  const [collapse, setCollapse] = useState(false);

  function handlerCollaps(x, obj) {

    if (x === false) {

    } else {
      setCurrentProject(obj)
    }
    setCollapse(x)
  }
  return (
    <Container>
      <WrapCard>
        <WrapImg>
          <img
            alt="example"
            src={obj.dataUrl}
            width='100%'
            height='100%'
            style={{ objectFit: 'cover', borderRadius:'10px' }}
          />
        </WrapImg>
        <OutsideClickHandler onOutsideClick={() => { handlerCollaps(false) }}>
          <WrapMenu>

            <CommonButton
              className="rde-action-btn"
              shape="circle"
              onClick={(e) => handlerCollaps(true, obj.key)}
              icon="bars"
              disabled={disable}
              style={{ fontSize: '30px' }}
            />

          </WrapMenu>
        </OutsideClickHandler>
      </WrapCard>

      <WrapSubmenu collapse={collapse}  >
        <Submenu1 collapse={collapse}  >
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            onClick={() => handlerCollaps(false, obj.key)}
            icon="angle-down"
            style={{ fontSize: '20px', margin: '15px', border: "1px solid white", color: 'rgba(245, 232, 232, 1)' }}

          />
        </Submenu1>
        <Submenu2 collapse={collapse} >
          <CommonButton
            className="rde-action-btn"
            tooltipTitle={'Add project to Canvas'}
            tooltipPlacement={'right'}
            shape="circle"
            onClick={() => {
              handlerAddProjectToCanvas(obj.key);
              handlerCollaps(false, obj.key)
              setCurrentProject(null)
            }}
            icon="plus"
            style={{ fontSize: '20px', margin: '15px', border: "1px solid white", color: 'rgba(245, 232, 232, 1)' }}

          />
        </Submenu2>
        <Submenu3 collapse={collapse} >
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            tooltipTitle={'Save'}
            tooltipPlacement={'right'}
            onClick={() => {
              const fn = canvasRef.handler?.saveCanvasImage;
              fn(obj.dataUrl);
              handlerCollaps(false, obj.key)
            }}
            icon="atom"
            style={{ fontSize: '20px', margin: '15px', border: "1px solid white", color: 'rgba(245, 232, 232, 1)' }}

          />
        </Submenu3>
        <Submenu4 collapse={collapse}>

          <CommonButton
            className="rde-action-btn"
            shape="circle"
            tooltipTitle={'Remove'}
            tooltipPlacement={'right'}
            onClick={() => {
              handlerRemoveProject(obj.key);
              handlerCollaps(false, obj.key)
            }}
            icon="trash"
            style={{ fontSize: '20px', margin: '15px', border: "1px solid white", color: 'rgba(245, 232, 232, 1)' }}

          />
        </Submenu4>
      </WrapSubmenu>

    </Container>
  )
}

export default Cards;

const Container = styled.div`
width:150px ;
height:200px ;
margin:10px ;
animation: sc 0.2s ease-in-out both;
@keyframes sc{
  0%{ transform: scale( 1)}
  50%{ transform: scale( 1.1)}
  100% { transform: scale(1)}}
`
const WrapCard = styled.div`
width:150px ;
height:200px ;
`
const WrapImg = styled.div`
width:100% ;
height:150px ;
border-radius: 10px 10px 0 0;
background:#F3F3F3 ;

`
const WrapMenu = styled.div`
height:50px ;
width:100% ;
display:flex ;
flex-direction:row;
flex-wrap: nowrap;
justify-content: space-around;
align-items:center;
border-radius: 0 0 10px 10px;
background:#FF851B ;
transition:0.5s ;

&:hover{
  background:#FF551B
}

`
const WrapSubmenu = styled.div`

width:150px ;
height:100% ;
position: relative;
border:1px solid silver;
border-radius:10px;
top:-100%;
z-index: ${props => props.collapse ? "1" : '-1'};
background: ${props => props.collapse ? 'rgba(0, 0, 0, 0.82)' : 'transparent'} ;

`

const Submenu1 = styled.div`
width:30px ;
height:30px ;
position:absolute ;
bottom:0%;
right:50%;
border-radius:50%;
display:${props => props.collapse ? "block" : 'none'};
animation: move 0.1s ease-in-out both;
@keyframes move{100% { transform: translateY( -120%)}}
`

const Submenu2 = styled.div`
width:30px ;
height:30px ;
position:absolute ;
bottom:0%;
right:50%;
border-radius:50%;
display:${props => props.collapse ? "block" : 'none'};
animation: move1 0.1s ease-in-out both;
@keyframes move1{100% { transform: translateY( -300%)}}
`

const Submenu3 = styled.div`
width:30px ;
height:30px ;
position:absolute ;
bottom:0%;
right:50%;
border-radius:50%;
display:${props => props.collapse ? "block" : 'none'};
animation: move2 0.1s ease-in-out both;
@keyframes move2{100% { transform: translateY( -420%)}}
`

const Submenu4 = styled.div`
width:30px ;
height:30px ;
position:absolute ;
bottom:0%;
right:50%;
border-radius:50%;
display:${props => props.collapse ? "block" : 'none'};
animation: move3 0.1s ease-in-out both;
@keyframes move3{100% { transform: translateY( -540%)}}
`


