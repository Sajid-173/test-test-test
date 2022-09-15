import React from "react";
import { Input, Select, Typography, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { BottomFormContainer, FormContainer } from "./styles";
const { Option } = Select;
const FloorArea = () => {
  return (
    <BottomFormContainer>
      <FormContainer layout="inline">
        <FormItem>
          <Input className="form-item-width" placeholder="Area Name" />
        </FormItem>
        <FormItem>
          <Select
            className="form-item-width"
            defaultValue="indoor"
            //onChange={handleChange}
          >
            <Option value="indoor">Indoor</Option>
            <Option value="outdoor">Outdoor</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select
            className="form-item-width"
            defaultValue="camera"
            //onChange={handleChange}
          >
            <Option value="camera">Camera</Option>
            <Option value="drone">Drone</Option>
            <Option value="agv">AGV</Option>
            <Option value="ar/vr">AR/VR</Option>
          </Select>
        </FormItem>
        <Typography.Text className="form-item-width">
          Area Calculations
        </Typography.Text>
        <Popconfirm
          placement="top"
          title="Are you sure you want to Delete?"
          //onConfirm={confirm}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            shape="circle"
            ghost
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </FormContainer>
    </BottomFormContainer>
  );
};

export default FloorArea;
