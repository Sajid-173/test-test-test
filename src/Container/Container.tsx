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
const { Panel } = Collapse;
const { Option } = Select;

//Floor Plan component where the floor is made
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

  const [rotate, setRotate] = useState<number>(0);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [width, setWidth] = useState<number>(1000);
  const [height, setHeight] = useState<number>(600);

  const onPanelChange = (key: string | string[]) => {
    console.log(key);
  };

  const getBASE64 = (img: any, callback: any) => {
    setImgname(img.name);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      //console.log(reader.result);
      setUrl(reader.result);
    });

    reader.readAsDataURL(img);
  };
  const handleImageChange = (info: any) => {
    console.log(info);
    getBASE64(info.fileList[0].originFileObj, (urlImage: any) => {
      setUrl(urlImage);
    });
  };

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const handleRotate = () => {
    if (rotate === 0) {
      setRotate(rotate + 90);
      //position of X is custom for the sake of balancing the image in center
      setRotateX(600);
      setWidth(1000);
      setHeight(600);
    } else if (rotate === 90) {
      setRotate(rotate + 90);
      setRotateX(800);
      setRotateY(600);
      setWidth(1000);
      setHeight(600);
    } else if (rotate === 180) {
      setRotate(rotate + 90);
      setRotateX(0);
      setRotateY(600);
      setWidth(1000);
      setHeight(600);
    } else if (rotate === 270) {
      setRotate(0);
      setRotateX(0);
      setRotateY(0);
      setWidth(1000);
      setHeight(600);
    }
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
          <FormRow align="middle" gutter={140}>
            <Col>
              <Typography.Text>Floor Name :</Typography.Text>
              <Typography.Text strong> floor_1</Typography.Text>
            </Col>
            <Col style={{ display: "flex", gap: "8px" }}>
              <Typography.Text>FloorArea: </Typography.Text>

              <Typography.Text>value(L)</Typography.Text>

              <Typography.Text>x</Typography.Text>

              <Typography.Text>value(W)</Typography.Text>

              <Typography.Text>=</Typography.Text>

              <Typography.Text strong>totalArea sq</Typography.Text>
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

            <Button shape="round" type="primary" onSubmit={onSubmit}>
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
            <DrawAnnotations
              Imgurl={url}
              rotate={rotate}
              rotateX={rotateX}
              rotateY={rotateY}
              Mwidth={width}
              Mheight={height}
            />
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
                  <Button type="link" onClick={handleRotate}>
                    Rotate
                  </Button>
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
  const { Imgurl, rotate, rotateX, rotateY, Mwidth, Mheight } = props;
  const [annotations, setAnnotations]: any = useState([]);
  const [newAnnotation, setNewAnnotation]: any = useState([]);
  const [Newimage] = useImage(Imgurl);

  const [label, setlabel] = useState(true);
  const [drawActive, setDrawActive] = useState(true);

  const [rectangles, setRectangles] = React.useState(annotations);
  const [selectedId, selectShape] = React.useState(null);

  //state to disable drawing after the inital drawing has been drawn
  const [active, setActive] = useState(true);

  const handleMouseDown = (event: any) => {
    const empty = (event.target == event.target) === event.target.getStage();
    if (empty || event.target.attrs.image) {
      selectShape(null);
      setDrawActive(true);
    }
    if (drawActive === true) {
      if (newAnnotation.length === 0) {
        setlabel(false);
        const { x, y } = event.target.getStage().getPointerPosition();
        setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
      }
    }
  };

  const handleMouseUp = (event: any) => {
    if (drawActive === true) {
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
    }
  };

  const handleMouseMove = (event: any) => {
    if (drawActive === true) {
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
        width={Newimage && Newimage.width < 1000 ? Newimage?.width : 1000}
        height={
          Newimage && Newimage?.height * (1000 / Newimage?.width) < 600
            ? Newimage?.height * (1000 / Newimage?.width)
            : 600
        }
      >
        <Layer>
          <Image
            image={Newimage}
            x={rotateX}
            y={rotateY}
            rotation={rotate}
            width={Newimage && Newimage.width < 1000 ? Newimage?.width : 1000}
            height={
              Newimage && Newimage?.height * (1000 / Newimage?.width) < 600
                ? Newimage?.height * (1000 / Newimage?.width)
                : 600
            }

            //style={{ width: Mwidth, height: Mheight }}
          />

          {/* <Rect
            fill="rgba(0,0,0,0.1)"
            x={150}
            y={150}
            width={450}
            height={350}
          /> */}
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
                  isSelected={rect.key === selectedId}
                  onSelect={() => {
                    selectShape(rect.key);
                    setDrawActive(false);
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
//Component used for the drawing of the first area
const MainArea = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
  //reference to the shape
  const shapeRef: any = useRef();
  //reference to the transformed shape
  const trRef: any = useRef();

  const [cx, setCx] = useState(shapeProps.x);
  const [cy, setCy] = useState(shapeProps.y);
  const [cwidth, setCwidth] = useState(shapeProps.width);
  const [cheight, setCheight] = useState(shapeProps.height);

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
        fill="rgba(245, 39, 39, 0.55)"
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
        <>
          <Transformer
            ignoreStroke={true}
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              const box = getClientRect(newBox);
              setCwidth(newBox.width < 10 ? shapeProps.width : newBox.width);
              setCheight(
                newBox.height < 10 ? shapeProps.height : newBox.height
              );
              const isOut =
                box.x < 0 ||
                box.y < 0 ||
                box.x + box.width > 1000 ||
                box.y + box.height > 600;

              // box.x < MainRect.x ||
              // box.y < MainRect.y ||
              // box.x + box.width > MainRect.width+MainRect.x ||
              // box.y + box.height > MainRect.height+MainRect.y
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
                setCx(absPos.x);
                setCy(absPos.y);

                // where are shapes inside bounding box of all shapes?

                const offsetX = box.x - absPos.x;

                const offsetY = box.y - absPos.y;

                // when total box goes outside of viewport, we need to move absolute position of shape
                const newAbsPos = { ...absPos };
                if (box.x < 0) {
                  newAbsPos.x = -offsetX;
                  // newAbsPos.x = -offsetX + MainRect.x;
                }
                if (box.y < 0) {
                  newAbsPos.y = -offsetY;
                  // newAbsPos.y = -offsetY + MainRect.y;
                }
                if (box.x + box.width > 1000) {
                  newAbsPos.x = 1000 - box.width - offsetX;
                  // newAbsPos.x = MainRect.width+MainRect.x - box.width - offsetX;
                }
                if (box.y + box.height > 600) {
                  newAbsPos.y = 600 - box.height - offsetY;
                  // newAbsPos.y = MainRect.height+MainRect.y - box.height - offsetY;
                }
                shape.setAbsolutePosition(newAbsPos);
              });
            }}
          />
          <Label
            x={
              shapeProps.width > 0 ? cx + cwidth / 2 - 25 : cx + cwidth / 2 - 25
            }
            y={shapeProps.height > 0 ? cy : cy + cheight}
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
                  newAbsPos.x = -offsetX;
                  // newAbsPos.x = -offsetX + MainRect.x;
                }
                if (box.y < 0) {
                  newAbsPos.y = -offsetY;
                  // newAbsPos.y = -offsetY + MainRect.y;
                }
                if (box.x + box.width > 1000 - box.width / 2) {
                  newAbsPos.x = 1000 - box.width - offsetX;
                  // newAbsPos.x = MainRect.width+MainRect.x - box.width - offsetX;
                }
                if (box.y + box.height > 600 - box.height / 2) {
                  newAbsPos.y = 600 - box.height - offsetY;
                  // newAbsPos.y = MainRect.height+MainRect.y - box.height - offsetY;
                }
                shape.setAbsolutePosition(newAbsPos);
              });
            }}
          >
            <Text
              fontStyle="bold"
              fill="white"
              fontSize={22}
              padding={6}
              text="feet"
            />
          </Label>
          <Label
            x={shapeProps.width > 0 ? cx + 34 : cx + cwidth + 34}
            y={cy + cheight / 2 - 25}
            rotation={90}
          >
            <Text
              fontStyle="bold"
              fill="white"
              fontSize={22}
              padding={6}
              text="feet"
            />
          </Label>
        </>
      )}
    </React.Fragment>
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
  const addFloor = (values: any) => {
    //adds new floors to the page
    console.log(values);
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
        onFinish={addFloor}
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
                <Form.Item {...field} key={field.key}>
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
          <Button
            shape="round"
            // disabled
            type="primary"
            onClick={() => form.submit()}
          >
            Next: Device Detail
          </Button>
        </Col>
      </Row>
    </MainContainer>
  );
};
export default Container;
