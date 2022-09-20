import styled from "styled-components";
import { Space, Row } from "antd";

const ImageContainer = styled(Space)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px auto;
  border: 2px dashed black;
  border-radius: 9px;

  height: 600px;
  width: 800px;
  & .anticon svg {
    font-size: 64px;
    margin-top: 220px;
  }

  & .ant-space-item {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: stretch;
  }

  & .ant-upload-select-text {
    width: 100%;
    height: 100%;
  }

  & .ant-upload-drag-icon {
    align-self: flex-end;
  }
`;

const BottomButtonContainer = styled(Space)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 auto;
  border-radius: 9px;
  width: 800px;
`;

const FormRow = styled(Row)`
  & .ant-col {
    height: 34px;
  }

  & .dimension-input {
    border-radius: 4px;
  }

  & .dimension-measures {
    border-radius: 4px;
  }
  & .my-select-container .ant-select .ant-select-selector {
    border-radius: 4px;
  }

  & .floor-name {
    border-radius: 4px;
  }
`;

const UploadInnerContainer = styled(Space)`
  width: 100%;
  height: 100%;
`;

export { ImageContainer, BottomButtonContainer, FormRow, UploadInnerContainer };
