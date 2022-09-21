import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";
const MainArea = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
  const shapeRef: any = useRef();
  const trRef: any = useRef();

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

export default MainArea;
