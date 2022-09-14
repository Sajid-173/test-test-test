import styled from "styled-components";

const ImageContainer = styled.div`
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
`;

export { ImageContainer };
