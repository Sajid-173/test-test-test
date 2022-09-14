import React, { useState } from "react";
import { Button, Row, Col } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import {
  MainContainer,
  ButtonContainer,
  CollapseMenuContainer,
  FloorButtonContainer,
} from "./styles";

import FloorComponent from "../components/FloorComponent/floorComponent";

const Container = () => {
  const addFloor = () => {
    //adds new floors to the page
  };
  return (
    //the entire container of the page
    <MainContainer>
      {/* Top level button for adding new floor */}
      <FloorButtonContainer>
        <Button
          shape="round"
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={addFloor}
        >
          Add new Floorplan
        </Button>
      </FloorButtonContainer>
      {/* Collapse Menu container */}
      <CollapseMenuContainer>
        <FloorComponent />
      </CollapseMenuContainer>
      {/* container for the 2 buttons at the bottom */}
      <ButtonContainer>
        <Row justify="end" gutter={24}>
          <Col>
            <Button shape="round" type="primary">
              Cancel
            </Button>
          </Col>
          <Col>
            <Button shape="round" disabled type="primary">
              Next: Device Detail
            </Button>
          </Col>
        </Row>
      </ButtonContainer>
    </MainContainer>
  );
};
export default Container;
