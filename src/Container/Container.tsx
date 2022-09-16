import React, { useState } from "react";
import { Button, Row, Col, Popconfirm, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import FloorComponent from "../components/FloorComponent/floorComponent";
import { MainContainer } from "./styles";

const Container = () => {
  const addFloor = () => {
    //adds new floors to the page
  };
  const [form] = Form.useForm();
  return (
    //the entire container of the page
    <MainContainer direction="vertical">
      {/* Top level button for adding new floor */}

      <Form
        form={form}
        name="dynamic_form_nest_item"
        autoComplete="off"
        initialValues={{ fields: [""] }}
      >
        <Form.List name="fields">
          {(fields, { add, remove }) => (
            <>
              <Row justify="end">
                <Button
                  shape="round"
                  type="link"
                  icon={<PlusCircleOutlined />}
                  onClick={() => add()}
                >
                  Add new floor plan
                </Button>
              </Row>

              {fields.reverse().map((field) => (
                <Form.Item {...field}>
                  <FloorComponent />
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      </Form>

      {/* container for the 2 buttons at the bottom */}

      <Row justify="end" gutter={24}>
        <Col>
          <Popconfirm
            placement="top"
            title="Are you sure you want to cancel?"
            //onConfirm={confirm}
            okText="Yes"
            cancelText="No"
          >
            <Button shape="round" type="primary">
              Cancel
            </Button>
          </Popconfirm>
        </Col>
        <Col>
          <Button shape="round" disabled type="primary">
            Next: Device Detail
          </Button>
        </Col>
      </Row>
    </MainContainer>
  );
};
export default Container;
