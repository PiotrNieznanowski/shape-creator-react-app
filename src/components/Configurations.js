import React, { useEffect } from "react";
import styled from "styled-components";
import SectionProjects from './SectionProjects.js'
import SectioncConfiguration from "./SectioncConfiguration";
import { useSelector } from "react-redux"


function Configurations(props) {

  const myProjects = useSelector(state => state.myProjects);
  const projectToLoad = useSelector(state => state.currentProjects)

const { onChange, selectedItem, canvasRef } = props;

return (
    <>
      <Container >

        <Wrap>
          <SectioncConfiguration
            onChange={onChange}
            selectedItem={selectedItem}
            canvasRef={canvasRef}
          />
        </Wrap>
        <SectionProjects
          myProjects={myProjects}
          projectToLoad={projectToLoad}
          canvasRef={canvasRef}

        />
      </Container>
    </>
  );
}

export default Configurations;

const Container = styled.div`
grid-area: 1 / 3 / 3 / 4;
display:flex ;
justify-content:center;
align-items:center;
flex-direction: row;
flex-wrap: wrap;
overflow:hidden ;
background: #333131 ;

`
const Wrap = styled.div`
height: 60%;
width:100% ;
background: #333131 ;


`


