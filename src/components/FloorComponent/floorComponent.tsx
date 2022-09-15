import React, { useState } from "react";
import {
  Upload,
  Button,
  Collapse,
  Space,
  Typography,
  Row,
  Image,
  Col,
  Popconfirm,
  Form,
  Input,
  Select,
} from "antd";

import { InboxOutlined, DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import { ImageContainer, BottomButtonContainer, FormContainer } from "./styles";
import FloorArea from "../Floorarea/Floorarea";

const { Panel } = Collapse;
const { Option } = Select;

const FloorComponent = () => {
  const [url, setUrl] = useState<any>(null);

  const onPanelChange = (key: string | string[]) => {
    // console.log(key);
  };

  const getBASE64 = (img: any, callback: any) => {
    console.log(img);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUrl(reader.result);
      console.log(reader.result);
    });
    reader.readAsDataURL(img);
  };
  const handleImageChange = (info: any) => {
    getBASE64(info.fileList[0].originFileObj, (urlImage: any) => {
      setUrl(urlImage);
    });
  };

  return (
    <Collapse
      onChange={onPanelChange}
      className="collapse-menu"
      defaultActiveKey={["1"]}
    >
      <Panel
        style={{ width: "100%" }}
        header={
          <FormContainer>
            <Form name="customized_form_controls" layout="inline">
              <Form.Item name="floorName" label="Floor Name :">
                <Input />
              </Form.Item>
              <Form.Item label="Floor Area (L*W) :">
                <Row align="middle" gutter={10}>
                  <Col>
                    <Input className="dimension-input" />
                  </Col>
                  <Typography.Text>x</Typography.Text>
                  <Col>
                    <Input className="dimension-input" />
                  </Col>
                  <Typography.Text>=</Typography.Text>
                  <Col>
                    <Select
                      defaultValue="sqf"
                      //onChange={handleChange}
                      className="dimension-measures"
                    >
                      <Option value="sqf">sqf</Option>
                      <Option value="sqm">sqm</Option>
                    </Select>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </FormContainer>
        }
        extra={[
          <Space>
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

            <Button
              type="primary"
              shape="circle"
              ghost
              icon={<SyncOutlined />}
            />

            <Button shape="round" type="primary" disabled>
              Submit
            </Button>
          </Space>,
        ]}
        key="1"
      >
        {/* Image container where the image is shown */}
        {url === null && (
          <ImageContainer>
            <Upload
              beforeUpload={(file) => {
                return false;
              }}
              onChange={handleImageChange}
              multiple={false}
              isImageUrl={() => true}
              listType="picture"
            >
              <Space direction="vertical">
                <Typography.Text className="ant-upload-drag-icon">
                  <InboxOutlined className="upload-icon" />
                </Typography.Text>
                <Typography.Text className="ant-upload-text">
                  Click or drag file to this area to upload
                </Typography.Text>
              </Space>
            </Upload>
          </ImageContainer>
        )}

        {url !== null && (
          <Image width={800} height={600} src={url} preview={false} />
        )}
        <BottomButtonContainer>
          <Row justify="end" gutter={24}>
            <Space size={20}>
              <Col>
                <Typography.Text>Image Text</Typography.Text>
              </Col>
              <Col>
                {/* Buttons with no backgrounds to be put here later? */}
                <Space size={20}>
                  <Typography.Text>Upload</Typography.Text>
                  <Typography.Text>|</Typography.Text>
                  <Typography.Text>Rotate</Typography.Text>
                </Space>
              </Col>
            </Space>
          </Row>
        </BottomButtonContainer>
        <FloorArea />
      </Panel>
    </Collapse>
  );
};

export default FloorComponent;
