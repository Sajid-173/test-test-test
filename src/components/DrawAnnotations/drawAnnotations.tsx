import React, { useState, useEffect } from "react";
import useImage from "use-image";
import {
  Stage,
  Layer,
  Rect,
  Image,
  Text,
  Group,
  Label,
  Tag,
} from "react-konva";

const DrawAnnotations = (props: any) => {
  const { Imgurl } = props;
  const [annotations, setAnnotations]: any = useState([]);
  const [newAnnotation, setNewAnnotation]: any = useState([]);
  const [image] = useImage(Imgurl);

  const handleMouseDown = (event: any) => {
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
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
    }
  };
  useEffect(() => {
    if (annotations) props.data([...annotations, ...newAnnotation]);
  }, [annotations, newAnnotation]);

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

          {annotationsToDraw.map((value) => {
            return (
              <>
                <Rect
                  x={value.x}
                  y={value.y}
                  width={value.width}
                  height={value.height}
                  fill="transparent"
                  stroke="red"
                />
                <Text
                  x={
                    value.x > 0
                      ? value.x + value.width / 2 - 25
                      : value.x + value.width / 2 - 25
                  }
                  y={
                    value.y > 0
                      ? value.y + value.height / 2 - 20
                      : value.y + value.height
                  }
                  Text={`Area:  ${value.key} \n Width: ${Math.abs(
                    value.width
                  )} \n Height: ${Math.abs(value.height)}`}
                  fill="black"
                />

                <Label
                  x={value.x}
                  y={value.y + value.height / 2 - 25}
                  fill="black"
                  rotation={90}
                >
                  <Tag fill="red" />
                  <Text
                    padding={5}
                    fill="white"
                    text={`ft : ${Math.trunc(value.height)}`}
                  />
                </Label>

                <Label x={value.x + value.width - 30} y={value.y - 20}>
                  <Tag fill="red" />
                  <Text
                    padding={5}
                    fill="white"
                    text={`ft : ${Math.trunc(value.width)}`}
                  />
                </Label>
              </>
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default DrawAnnotations;
