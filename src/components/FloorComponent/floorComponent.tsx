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
  FormRow,
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
      collapsible="header"
      //defaultActiveKey={["1"]}
      // collapsible
    >
      <Panel
        style={{ width: "100%" }}
        header={
          <FormRow gutter={10}>
            <Col>
              <Form.Item name="floorName" label="Floor Name :">
                <Input className="floor-name" />
              </Form.Item>
            </Col>
            <Col style={{ display: "flex", gap: "12px" }}>
              <Form.Item name="floorArea" label="Floor Area (L*W) :">
                <Input className="dimension-input" />
              </Form.Item>
              <Typography.Text>x</Typography.Text>
              <Form.Item>
                <Input className="dimension-input" />
              </Form.Item>
              <Typography.Text>=</Typography.Text>
              <Form.Item>
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
              </Form.Item>
            </Col>
          </FormRow>
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
            <Upload onChange={handleImageChange}>
              <UploadInnerContainer align="center" direction="vertical">
                <Space direction="vertical" align="center">
                  <Space direction="vertical" align="end">
                    <InboxOutlined />
                  </Space>
                  <Typography.Text>
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
