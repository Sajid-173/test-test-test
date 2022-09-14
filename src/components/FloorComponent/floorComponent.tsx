import React, { useState } from "react";
import { Upload, Button, Collapse, Space } from "antd";
import FloorComponentForm from "../FloorComponentForm/FloorComponentForm";
import { InboxOutlined, DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import { ImageContainer } from "./styles";
const { Panel } = Collapse;

const FloorComponent = () => {
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  const [state, setState]: any = useState({
    fileList: [
      {
        thumbUrl:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
  });

  const [imgurl, setImgurl] = useState({
    previewVisible: false,
    previewImage: "",
  });

  const handlePreview = (file: any) => {
    console.log(file);
    setImgurl({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  const handleChange = (info: any) => {
    let fileList = [...info.fileList];
    //console.log(fileList);
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    setImgurl({
      previewImage: info.file.url || info.file.thumbUrl,
      previewVisible: true,
    });
    console.log("this is img url" + imgurl.previewImage);
    console.log(imgurl.previewImage);

    setState({ fileList: fileList });
  };

  return (
    <Collapse onChange={onChange} className="collapse-menu">
      <Panel
        header={<FloorComponentForm />}
        extra={[
          <Space>
            <Button
              type="primary"
              shape="circle"
              ghost
              icon={<DeleteOutlined />}
            />

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
        <ImageContainer>
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            onChange={handleChange}
            multiple={false}
            isImageUrl={() => true}
            onPreview={handlePreview}
            listType="picture"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="upload-icon" />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            {/* <Image src={imgurl.previewImage} width="500px" height="500px" /> */}
          </Upload>
        </ImageContainer>
      </Panel>
    </Collapse>
  );
};

export default FloorComponent;
