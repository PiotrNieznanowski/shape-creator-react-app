import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Form, Radio } from "antd";
import styled from "styled-components";
import CommonButton from "./CommonButton"
import Icon from "./Icon"
import i18n from "i18next";


import { InputHtml } from ".";
import FileUpload from "./FileUpload";


const SVGModal = (props) => {

  const { visible, onOk, onCancel } = props

  const [panel, setPanel] = useState("SVG");
  const [file, setFile] = useState(null);
  const [SVGtext, setSVGtext] = useState("");

  const handleOk = () => {

    if (file === undefined && SVGtext === "") {
      onCancel();
      return
    }

    if (file) {
      const values = {
        loadType: "file",
        svg: file[0]
      }
      if (values.svg instanceof Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(values.svg);
        reader.onload = () => {
          onOk({ ...values, svg: reader.result });
        };
        setFile(null)
      } else {
        onOk(values);
      }
    }

    if (SVGtext) {
      const values = {
        loadType: "svg",
        svg: SVGtext
      }
      if (values.svg instanceof Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(values.svg);
        reader.onload = () => {
          onOk({ ...values, svg: reader.result });
        };
        setSVGtext('')
      } else {
        onOk(values);
      }
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container
      centered
      visible={visible}
      closable={false}
      footer={[

        <CommonButton
          key="2"
          className="rde-action-btn"
          shape="rect"
          onClick={() => handleCancel()}
          style={{ fontSize: '25px', display: 'inline'  }}
        >
          <Icon name="arrow-left" />
          
        </CommonButton>,
        <CommonButton
          key="1"
          className="rde-action-btn"
          shape="rect"
          onClick={() => handleOk()}
          style={{ fontSize: '25px', display: 'inline' }}
        >
          <Icon name="check" />
         
        </CommonButton>
      ]} >

      <WrapButton>
        <CommonButton
          className="rde-action-btn"
          onClick={() => setPanel("SVG")}
          shape="rect"
          style={{ fontSize: '25px', margin: '15px' }}
        >
          <Icon name="shapes" />
         FILE
        </CommonButton>
        <CommonButton
          className="rde-action-btn"
          onClick={() => setPanel("fileSVG")}
          shape="rect"
          style={{ fontSize: '25px', margin: '15px' }}
        >
          <Icon name="code" />
          SVG
        </CommonButton>
      </WrapButton>

      <WrapPanel>
        {panel === "fileSVG" ? <InputHtml setSVGtext={setSVGtext} text={SVGtext} /> : <FileUpload setFile={setFile} accept=".svg" />}
      </WrapPanel>

    </Container>
  );

}

export default SVGModal;

const Container = styled(Modal)`

.modalStyle .ant-modal-header {
 
 };
.newStyle {
 };
.ant-modal-content {
   background:#EDEDED ;
border-radius:10px;
   width:550px;
  height:350px ;
  padding:5px;
  
};
.modalStyle2 {
};
.ant-modal-footer {
 padding:0 ;
 margin:0 ;

}
`
const WrapButton = styled.div`
display:flex ;
justify-content:space-around;
align-items:center;
width:100% ;
height:50px ;
`
const WrapPanel = styled.div`
display:flex ;
justify-content:center;
width:100% ;
height:100%;
margin-top: 20px;
margin-bottom:20px ;
`
