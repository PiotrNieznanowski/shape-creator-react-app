import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CommonButton } from "./common";
import { useDispatch } from 'react-redux';
import Cards from "./Cards";

function SectionProjects(props) {

  const dispatch = useDispatch();

  const { myProjects, projectToLoad, canvasRef } = props;

  const handlerRemoveProject = (key) => {
    dispatch({
      type: 'removeProject',
      payload: key,
    })

  }
  const setCurrentProject = (key) => {

    dispatch({
      type: 'addProjectToCanvas',
      payload: key,
    })

  }
  const handlerAddProjectToCanvas = () => {
    canvasRef.handler.importJSON(projectToLoad.allObjectsToRender)
  }

  return (
    <Container>
      <Options>
        {/* <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="arrow-left"
          style={{ fontSize: '40px', color: "white" }}
        /> */}
      </Options>
      <WrapCards>
        {myProjects.length === 0
          ?
          <InfoFrame>
            <Info1>Your projects will appear here</Info1>
            <Info2>Tap the "New project" button to create your first project</Info2>
          </InfoFrame>
          :
          myProjects.map((obj, i) => (
            <Cards
              key={i}
              obj={obj}
              handlerRemoveProject={handlerRemoveProject}
              setCurrentProject={setCurrentProject}
              handlerAddProjectToCanvas={handlerAddProjectToCanvas}
              canvasRef={canvasRef}
            // disable={disable()}
            />
          ))}
      </WrapCards>

    </Container>
  )
}

export default SectionProjects;

const Container = styled.div`
border-top:1px solid white ;
display:flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content:center;
width:100%;

background: #333131 ;
padding:3px;
align-content:flex-start;
height:40% ;
`

const Options = styled.div`

display:flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content:center;
width:100%;
background: #333131 ;
padding:3px;
align-content:flex-start;
height:10% ;
`

const WrapCards = styled.div`

display:flex;
flex-direction: row;
flex-wrap: wrap;
justify-content:space-around;
width:100%;
/* border-top: 1px dotted gray; */
background: #333131 ;
padding:3px;
align-content:flex-start;
height:90% ;
overflow-y: scroll;

::-webkit-scrollbar { width: 10px }

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px #DEDEDE; 
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #C4C4C4; 
  border-radius: 3px;
 }
`
const InfoFrame = styled.div`

display:flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content:center;
width:100%;
height:100% ;
background: #333131 ;
padding:15px;
`
const Info1 = styled.h3`

text-align: center;
color:#EFEFEF;
font-style: normal;
font-weight: bold;
margin:0 ;
`

const Info2 = styled.h4`

text-align: center;
color:#EFEFEF;
font-style: normal;

`


