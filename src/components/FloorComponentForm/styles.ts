import styled from "styled-components";
import { Space } from "antd";

const FormContainer = styled(Space)`
  width: 100%;
  & .dimension-input {
    width: 50px;
  }

  & .dimension-measures {
    width: 70px;
  }
`;

export { FormContainer };
