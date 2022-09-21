import React, { useState, useEffect } from "react";
import useImage from "use-image";
import { Stage, Layer, Rect, Image, Text, Label, Tag } from "react-konva";
import MainArea from "../MainArea/MainArea";

const DrawAreaAnnotations = (props: any) => {
  const { Imgurl } = props;
  const [annotations, setAnnotations]: any = useState([]);
  const [newAnnotation, setNewAnnotation]: any = useState([]);
  const [image] = useImage(Imgurl);
  const [label, setlabel] = useState(true);

  const [rectangles, setRectangles] = React.useState(annotations);
  const [selectedId, selectShape] = React.useState(null);
  const [active, setActive] = useState(true);

  const handleMouseDown = (event: any) => {
    if (newAnnotation.length === 0) {
      setlabel(false);
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

export default DrawAreaAnnotations;
