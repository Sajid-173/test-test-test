import styled from "styled-components";
import { Space, Form } from "antd";

const BottomFormContainer = styled(Space)`
  width: 100%;
  padding: 24px;

  & .form-item-width {
    width: 250px;
  }
  display: flex;
  justify-content: center;
`;

const FormContainer = styled(Form)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export { BottomFormContainer, FormContainer };
