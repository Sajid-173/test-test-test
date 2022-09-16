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
import {
  ImageContainer,
  BottomButtonContainer,
  FormContainer,
  UploadInnerContainer,
} from "./styles";
import DrawAnnotations from "../DrawAnnotations/drawAnnotations";
import FloorArea from "../FloorArea/floorArea";

const { Panel } = Collapse;
const { Option } = Select;

const FloorComponent = () => {
  const [url, setUrl] = useState<any>(null);
  const [localData, setLocalData] = useState([]);
  const data = (d: any) => {
    setLocalData(d);
    // console.log("sajid", d);
  };

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

      //defaultActiveKey={["1"]}
      // collapsible
    >
      <Panel
        style={{ width: "100%" }}
        header={
          <FormContainer>
            <Form name="customized_form_controls" layout="inline">
              <Form.Item name="floorName" label="Floor Name :">
                <Input className="floor-name" />
              </Form.Item>
              <Form.Item name="floorArea" label="Floor Area (L*W) :">
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
                      <Option value="sqf">
                        <b>ft</b>
                        <sup>
                          <b>2</b>
                        </sup>
                      </Option>
                      <Option value="sqm">
                        <b>m</b>
                        <sup>
                          <b>2</b>
                        </sup>
                      </Option>
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
            <Upload className="img-upload" onChange={handleImageChange}>
              <UploadInnerContainer align="center" direction="vertical">
                <Space direction="vertical" align="center">
                  <Typography.Text className="ant-upload-drag-icon">
                    <InboxOutlined className="upload-icon" />
                  </Typography.Text>
                  <Typography.Text className="ant-upload-text">
                    Click or drag file to this area to upload
                  </Typography.Text>
                </Space>
              </UploadInnerContainer>
            </Upload>
          </ImageContainer>
        )}

        {url !== null && (
          //<Image width={800} height={600} src={url} preview={false} />
          <Space>
            <DrawAnnotations data={(d: any) => data(d)} Imgurl={url} />
          </Space>
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
                  <Button type="link">Upload</Button>
                  <Typography.Text>|</Typography.Text>
                  <Button type="link">Rotate</Button>
                </Space>
              </Col>
            </Space>
          </Row>
        </BottomButtonContainer>

        {localData?.map((item) => (
          <>
            <FloorArea data={item} />
          </>
        ))}
      </Panel>
    </Collapse>
  );
};

export default FloorComponent;
