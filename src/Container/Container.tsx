import React, { useState } from "react";
import { Button, Row, Col, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import FloorComponent from "../components/FloorComponent/floorComponent";

const Container = () => {
  const addFloor = () => {
    //adds new floors to the page
  };
  return (
    //the entire container of the page
    <Space direction="vertical">
      {/* Top level button for adding new floor */}

      <Row justify="end">
        <Col>
          <Button
            shape="round"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={addFloor}
          >
            Add new Floorplan
          </Button>
        </Col>
      </Row>

      {/* Collapse Menu container */}
      <Row>
        <FloorComponent />
      </Row>
      {/* container for the 2 buttons at the bottom */}

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
    </Space>
  );
};
export default Container;
