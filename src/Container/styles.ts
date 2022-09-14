import styled from "styled-components";
import { Space } from "antd";

const MainContainer = styled(Space)`
  width: 100%;
  padding: 48px 96px;

  & .ant-collapse-arrow {
    margin-top: 10px;
  }
`;

export { MainContainer };
