import styled from "styled-components";

//the entire container of the page
const MainContainer = styled.div`
  margin: 50px auto;
  padding: 0 48px;
`;

const FloorButtonContainer = styled.div`
  padding: 12px 48px;
  display: flex;
  justify-content: flex-end;
`;

//Container for the Collapse Menu
const CollapseMenuContainer = styled.div`
  padding: 0 48px;

  & .ant-collapse-arrow {
    margin-top: 10px;
  }
`;

//container for the 2 buttons at the bottom
const ButtonContainer = styled.div`
  padding: 0 96px;
  margin-top: 32px;
`;

export {
  MainContainer,
  ButtonContainer,
  CollapseMenuContainer,
  FloorButtonContainer,
};
