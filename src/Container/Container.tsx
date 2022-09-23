import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Popconfirm,
  Form,
  Upload,
  Collapse,
  Space,
  Typography,
  Input,
  Select,
} from "antd";
import {
  Stage,
  Layer,
  Rect,
  Image,
  Text,
  Label,
  Tag,
  Transformer,
} from "react-konva";
import {
  PlusCircleOutlined,
  InboxOutlined,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import useImage from "use-image";
import FormItem from "antd/es/form/FormItem";
import {
  MainContainer,
  ImageContainer,
  BottomButtonContainer,
  FormRow,
  UploadInnerContainer,
  BottomFormContainer,
  FormContainer,
} from "./styles";

//Component used for the drawing of the first area
const MainArea = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
  //reference to the shape
  const shapeRef: any = useRef();
  //reference to the transformed shape
  const trRef: any = useRef();

  //gets the corner of the shape
  function getCorner(
    pivotX: any,
    pivotY: any,
    diffX: any,
    diffY: any,
    angle: any
  ) {
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    /// find angle from pivot to corner
    angle += Math.atan2(diffY, diffX);

    /// get new x and y and round it off to integer
    const x = pivotX + distance * Math.cos(angle);
    const y = pivotY + distance * Math.sin(angle);

    return { x: x, y: y };
  }

  function getClientRect(rotatedBox: any) {
    const { x, y, width, height } = rotatedBox;
    const rad = rotatedBox.rotation;

    const p1 = getCorner(x, y, 0, 0, rad);
    const p2 = getCorner(x, y, width, 0, rad);
    const p3 = getCorner(x, y, width, height, rad);
    const p4 = getCorner(x, y, 0, height, rad);

    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
  function getTotalBox(boxes: any) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    boxes.forEach((box: any) => {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        stroke="red"
        fill="rgba(245, 39, 39, 0.34)"
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        //transforming of the shape in the first selection, maybe 2nd even
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),

            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            const box = getClientRect(newBox);
            const isOut =
              box.x < 0 ||
              box.y < 0 ||
              box.x + box.width > 800 ||
              box.y + box.height > 600;

            // if new bounding box is out of visible viewport, let's just skip transforming
            // this logic can be improved by still allow some transforming if we have small available space
            if (isOut) {
              return oldBox;
            }
            return newBox;
          }}
          onDragMove={() => {
            const boxes = trRef.current
              .nodes()
              .map((node: any) => node.getClientRect());
            const box = getTotalBox(boxes);

            trRef.current.nodes().forEach((shape: any) => {
              const absPos = shape.getAbsolutePosition();
              // where are shapes inside bounding box of all shapes?
              const offsetX = box.x - absPos.x;
              const offsetY = box.y - absPos.y;

              // when total box goes outside of viewport, we need to move absolute position of shape
              const newAbsPos = { ...absPos };
              if (box.x < 0) {
                newAbsPos.x = -offsetX + 2;
              }
              if (box.y < 0) {
                newAbsPos.y = -offsetY + 2;
              }
              if (box.x + box.width > 800) {
                newAbsPos.x = 800 - box.width - offsetX - 2;
              }
              if (box.y + box.height > 600) {
                newAbsPos.y = 600 - box.height - offsetY - 2;
              }
              shape.setAbsolutePosition(newAbsPos);
            });
          }}
        />
      )}
    </React.Fragment>
  );
};
//Floor Plan component where the floor is made
const { Panel } = Collapse;
const { Option } = Select;
const FloorComponent = () => {
  const [url, setUrl] = useState<any>(null);
  const [localData, setLocalData] = useState([]);
  const [imgname, setImgname] = useState();
  const [enabled, setenabled] = useState("disabled");
  const [firststage, setFriststage]: any = useState(true);
  const data = (d: any) => {
    setLocalData(d);
    // console.log("sajid", d);
  };

  const onPanelChange = (key: string | string[]) => {
    // console.log(key);
  };

  const getBASE64 = (img: any, callback: any) => {
    console.log(img);
    setImgname(img.name);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUrl(reader.result);
      // console.log(reader.result);
    });
    reader.readAsDataURL(img);
  };
  const handleImageChange = (info: any) => {
    getBASE64(info.fileList[0].originFileObj, (urlImage: any) => {
      setUrl(urlImage);
    });
  };

  const MainAreaSubmit = () => {
    console.log("sumbitted");
    setFriststage(false);
  };

  return (
    <Collapse
      onChange={onPanelChange}
      className="collapse-menu"
      collapsible="header"
      defaultActiveKey={["1"]}
      // collapsible
    >
      <Panel
        style={{ width: "100%" }}
        header={
          <FormRow gutter={10}>
            <Col>
              <Form.Item name="floorName" label="Floor Name :">
                <Input minLength={1} maxLength={30} className="floor-name" />
              </Form.Item>
            </Col>
            <Col style={{ display: "flex", gap: "12px" }}>
              <Form.Item name="floorArea" label="Floor Area (L*W) :">
                <Input type="number" className="dimension-input" />
              </Form.Item>
              <Typography.Text>x</Typography.Text>
              <Form.Item>
                <Input type="number" className="dimension-input" />
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

            <Button shape="round" type="primary" onClick={MainAreaSubmit}>
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
            {" "}
            <DrawAnnotations Imgurl={url} />{" "}
          </Space>
        )}

        <BottomButtonContainer>
          <Row justify="end" gutter={24}>
            <Space size={20}>
              <Col>
                <Typography.Text>{imgname}</Typography.Text>
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
          <>{<FloorArea data={item} />}</>
        ))}
      </Panel>
    </Collapse>
  );
};

//Draw anootation for the first selection
const DrawAnnotations = (props: any) => {
  const { Imgurl } = props;
  const [annotations, setAnnotations]: any = useState([]);
  const [newAnnotation, setNewAnnotation]: any = useState([]);
  const [image] = useImage(Imgurl);
  const [label, setlabel] = useState(true);

  const [rectangles, setRectangles] = React.useState(annotations);
  const [selectedId, selectShape] = React.useState(null);

  //state to disable drawing after the inital drawing has been drawn
  const [active, setActive] = useState(true);

  const handleMouseDown = (event: any) => {
    if (active === true) {
      if (newAnnotation.length === 0) {
        setlabel(false);
        const { x, y } = event.target.getStage().getPointerPosition();
        setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
      }
    }
  };

  const handleMouseUp = (event: any) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      const annotationToAdd: any = {
        x: sx,
        y: sy,
        width: Math.trunc(x - sx),
        height: Math.trunc(y - sy),
        key: annotations.length + 1,
        name: `Area ${annotations.length + 1}`,
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
      setActive(false);
    }
  };

  const handleMouseMove = (event: any) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: Math.trunc(x - sx),
          height: Math.trunc(y - sy),
          //feet formula and meter formulas
          ftw: Math.trunc(x - sx) / 100,
          fth: Math.trunc(y - sy) / 100,
          mw: Math.trunc(x - sx) / 3779.52756,
          mh: Math.trunc(y - sy) / 3779.52756,
          key: "0",
          name: "",
        },
      ]);
    }
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];
  // console.log(annotationsToDraw[0]);
  return (
    <>
      <Stage
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        width={800}
        height={600}
      >
        <Layer>
          <Image image={image} width={800} height={600} />

          {label === true && (
            <Label x={270} y={270}>
              <Tag fill="black" cornerRadius={9} />
              <Text
                padding={14}
                align="center"
                fontSize={14}
                width={280}
                fill="white"
                text="Click and drag to select the floor coverage area"
                wrap="true"
              />
            </Label>
          )}
          {annotationsToDraw &&
            annotationsToDraw.map((rect, i) => {
              return (
                <MainArea
                  key={i}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id);
                  }}
                  onChange={(newAttrs: any) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
                  }}
                />
              );
            })}
        </Layer>
      </Stage>
    </>
  );
};

///Floor Area for the bottom menu which comes after the multiple area selected in a floorplan
const FloorArea = (props: any) => {
  const { data } = props;
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
          {data.width}*{data.height}px
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

/////////////Main Container for everything
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
