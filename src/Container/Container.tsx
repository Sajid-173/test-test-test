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
  Tooltip,
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

/////////////Main Container for everything
const Container = () => {
  const addFloor = (values: any) => {
    //adds new floors to the page
    console.log(values);
  };
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const [iwidth, setIwidth] = useState(false);
  const [iheight, setIheight] = useState(false);
  const [hrules, setHrules] = useState({
    required: false,
    message: "",
  });
  const [wrules, setWrules] = useState({
    required: false,
    message: "",
  });
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

      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 4 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="Height" name="height" rules={[hrules]}>
          <Input
            onBlur={() => setWrules({ required: false, message: "" })}
            onSelect={() => {
              setHrules({ required: true, message: "please Input height!" });
              setWrules({ required: false, message: "" });
            }}
            onChange={(e: any) => {
              if (e.target.value.length > 0) {
                setIwidth(true);
              } else {
                setIwidth(false);
              }
            }}
            disabled={iheight}
          />
        </Form.Item>

        <Form.Item label="Width" name="width" rules={[wrules]}>
          <Input
            onSelect={() => {
              setWrules({ required: true, message: "please input width!" });
              setHrules({ required: false, message: "" });
            }}
            onChange={(e: any) => {
              if (e.target.value.length > 0) {
                setIheight(true);
              } else {
                setIheight(false);
              }
            }}
            disabled={iwidth}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </MainContainer>
  );
};
//Floor Plan component where the floor is made
const FloorComponent = () => {
  const [url, setUrl] = useState<any>(null);
  const [localData, setLocalData] = useState([]);
  const [imgname, setImgname] = useState();
  const [inputPopup, setInputPopup] = useState(false);

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
              <Tooltip
                visible={inputPopup}
                placement="topLeft"
                title="Enter the floor Name"
              >
                <Typography.Text>Floor name</Typography.Text>
              </Tooltip>
            </Col>
            <Col style={{ display: "flex", gap: "8px" }}>
              {/* <Input onSelect={() => setIheight(true)} placeholder="Width" />
             <Input onSelect={() => setIwidth(true)} placeholder="Height" /> */}
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
            <DrawAnnotations
              Imgurl={url}
              rotate={rotate}
              rotateX={rotateX}
              rotateY={rotateY}
              Mwidth={width}
              Mheight={height}
              setInputPopup={setInputPopup}
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
  const { Imgurl, rotate, rotateX, rotateY, setInputPopup } = props;
  const [annotations, setAnnotations]: any = useState([]);
  const [newAnnotation, setNewAnnotation]: any = useState([]);
  const [Newimage] = useImage(Imgurl);

  const [label, setlabel] = useState(true);
  const [drawActive, setDrawActive] = useState(false);

  const [rectangles, setRectangles] = React.useState(annotations);
  const [selectedId, selectShape] = React.useState(null);

  const [recActive, setRecActive] = useState([10, 10]);

  const [labelin, setLabelin] = useState(false);

  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  //state to disable drawing after the inital drawing has been drawn
  const [active, setActive] = useState(true);
  useEffect(() => {
    console.log(drawActive);
  }, [drawActive]);

  const handleMouseDown = (event: any) => {
    const empty = (event.target == event.target) === event.target.getStage();
    if (empty || event.target.attrs.image) {
      selectShape(null);
      //setDrawActive(false);
      // setRecActive([10, 10]);
    }
    // const notempty = event.target.getStage().getPointerPosition();
    // if (
    //   notempty.x > 150 &&
    //   notempty.x < 450 + 150 &&
    //   notempty.y > 150 &&
    //   notempty.y < 350 + 150
    // ) {
    //   selectShape(null);
    // }

    // the function will return pointer position relative to the passed node
    var transform = event.target.getStage().getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    //transform.invert();

    // get pointer (say mouse or touch) position
    var pos = event.target.getStage().getStage().getPointerPosition();

    // now we find relative point
    const rpos = transform.point(pos);

    if (drawActive === true) {
      if (newAnnotation.length === 0) {
        setlabel(false);
        //const { x, y } = event.target.getStage().getPointerPosition();
        const { x, y } = rpos;
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
        let nx, ny;

        if (x - sx < 0 && y - sy < 0) {
          nx = sx - (x + sx);
          ny = sy - (y + sy);

          console.log("negative width and height");
        } else if (x - sx < 0 && y - sy > 0) {
          nx = sx - (x + sx);
          ny = sy;
          console.log("negative width");
        } else if (x - sx > 0 && y - sy < 0) {
          nx = sx;
          ny = sy - (y + sy);
          console.log("negative height");
        } else {
          console.log("positive height and width");
          nx = sx;
          ny = sy;
        }

        const annotationToAdd: any = {
          x: Math.abs(nx),
          y: Math.abs(ny),
          width: Math.abs(x - sx),
          height: Math.abs(y - sy),
          key: annotations.length + 1,
          name: `Area ${annotations.length + 1}`,
        };
        if (Math.abs(nx) < 175 || Math.abs(ny) < 175) {
          setLabelin(true);
        }
        annotations.push(annotationToAdd);

        setNewAnnotation([]);
        setAnnotations(annotations);
        setActive(false);
        console.log(annotationToAdd);
        setInputPopup(true);
      }
    }
    console.log(annotations);
  };

  const handleMouseMove = (event: any) => {
    const empty = (event.target == event.target) === event.target.getStage();
    if (empty || event.target.attrs.image) {
      // selectShape(null);
      //setDrawActive(false);
      setRecActive([10, 10]);
    }
    const notempty = event.target.getStage().getPointerPosition();
    if (
      notempty.x < 450 &&
      notempty.x > 450 - 300 &&
      notempty.y < 450 &&
      notempty.y > 450 - 300 &&
      !selectedId
    ) {
      setDrawActive(true);
      setRecActive([0, 0]);
    }
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

            key: "0",
            name: "",
          },
        ]);
      }
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    if (newScale < 1) {
      setStage({
        scale: 1,
        x: 0,
        y: 0,
      });
    } else {
      setStage({
        scale: newScale,
        x:
          (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
        y:
          (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
      });
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
        onWheel={handleWheel}
        width={Newimage && Newimage.width < 1000 ? Newimage?.width : 1000}
        height={
          Newimage && Newimage?.height * (1000 / Newimage?.width) < 600
            ? Newimage?.height * (1000 / Newimage?.width)
            : 600
        }
        x={stage.x}
        y={stage.y}
        scaleX={stage.scale}
        scaleY={stage.scale}
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

          <Rect
            stroke={"black"}
            strokeWidth={1}
            dash={recActive}
            x={450}
            y={450}
            width={-300}
            height={-300}
          />
          {label === true && (
            <Label x={270} y={270}>
              <Tag fill="black" cornerRadius={9} />
              <Text
                padding={14}
                align="center"
                fontSize={24}
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
                  labelin={labelin}
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
const MainArea = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  labelin,
}: any) => {
  //reference to the shape
  const shapeRef: any = useRef();
  //reference to the transformed shape
  const trRef: any = useRef();

  const [cx, setCx] = useState(shapeProps.x);
  const [cy, setCy] = useState(shapeProps.y);
  const [cwidth, setCwidth] = useState(shapeProps.width);
  const [cheight, setCheight] = useState(shapeProps.height);
  const [rotatePosition, setRotatePosition] = useState({
    x:
      shapeProps.width > 0
        ? shapeProps.x + shapeProps.width / 2 - 25
        : shapeProps.x + shapeProps.width / 2 - 25,
    y: shapeProps.height > 0 ? shapeProps.y : shapeProps.y + shapeProps.height,
  });
  const [rotateAngle, setRotateAngle] = useState(0);

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
    const p2a = getCorner(x, y, width / 2 - 25, 0, rad);
    const p3 = getCorner(x, y, width, height, rad);
    const p4 = getCorner(x, y, 0, height, rad);
    setRotatePosition(p2a);
    setRotateAngle(rad * (180 / 3.1416));
    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);
    console.log(rotatePosition.x);
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
        strokeWidth={1}
        fill="rgba(245, 39, 39, 0.55)"
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable
        {...shapeProps}
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
              const boxes = trRef.current.nodes().map((node: any) => {
                node.getClientRect();
              });
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
            x={shapeProps.x + shapeProps.width / 2 - 25}
            y={labelin ? shapeProps.y : shapeProps.y - 25}
          >
            <Tag fill="black"></Tag>
            <Text
              fontStyle="bold"
              fill="white"
              fontSize={16}
              padding={6}
              text="feet"
              align="center"
              width={50}
              height={25}
            ></Text>
          </Label>
          <Label
            x={labelin ? shapeProps.x + 25 : shapeProps.x}
            y={shapeProps.y + shapeProps.height / 2 - 25}
            rotation={90}
            width={50}
            height={30}
          >
            <Tag fill="black"></Tag>
            <Text
              fontStyle="bold"
              fill="white"
              fontSize={16}
              padding={6}
              text="feet"
              align="center"
              width={50}
              height={25}
            ></Text>
          </Label>

          <Label
            x={shapeProps.x + shapeProps.width / 2 - 25}
            y={shapeProps.y + shapeProps.height / 2 - 12.5}
          >
            <Text
              fontStyle="bold"
              fill="white"
              fontSize={cwidth < 100 ? 12 : 44}
              padding={6}
              text="Area 1"
            ></Text>
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

export default Container;
