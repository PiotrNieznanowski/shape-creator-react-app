import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Upload } from "antd";

const { Dragger } = Upload;

class FileUpload extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    limit: PropTypes.number,
    accept: PropTypes.string,
  };

  static defaultProps = {
    limit: 5,
  };

  state = {
    fileList: this.props.value ? [this.props.value] : [],
  };
  componentDidUpdate() {
    this.props.setFile(this.state.fileList)
  }

  render() {

    const { accept, limit } = this.props;
    const { fileList } = this.state;
    const props = {
      accept,
      name: "file",
      multiple: false,
      onRemove: (file) => {
        this.setState(
          { fileList: [] }
        );
      },
      beforeUpload: (file) => {
        const isLimit = file.size / 1024 / 1024 < limit;
        if (!isLimit) {
          return false;
        }
        this.setState({
          fileList: [file],
        });
        return false;
      },
      fileList,
    };
    return (
      <Dragger {...props} >
        <InfoFrame>
          <Info1>Click file to this area to upload</Info1>
          <Info2>Support for a single upload. Limited to $<span>{limit}</span>MB or less</Info2>
        </InfoFrame>
      </Dragger>
    );
  }
}

export default FileUpload;

const InfoFrame = styled.div`

display:flex;
flex-direction: column;
flex-wrap: nowrap;
justify-content:center;
background: #FAFAFA ;
padding:15px;
`
const Info1 = styled.h3`

text-align: center;
color:#929496;
font-style: normal;
font-weight: bold;
margin:0 ;
`

const Info2 = styled.h4`

text-align: center;
color:#929496;
font-style: normal;

`