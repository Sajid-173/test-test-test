import styled from "styled-components";
import { Space } from "antd";

const ImageContainer = styled(Space)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px auto;
  border: 2px dashed black;
  border-radius: 9px;
  padding: 24px;

  height: 600px;
  width: 800px;
  & .upload-icon {
    font-size: 64px;
  }
  & .ant-space {
    width: 100%;
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

const FormContainer = styled(Space)`
  width: 100%;
  & .dimension-input {
    width: 50px;
  }

  & .dimension-measures {
    width: 70px;
  }
`;

export { ImageContainer, BottomButtonContainer, FormContainer };
