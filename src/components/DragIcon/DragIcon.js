import React, { useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import { findDOMNode } from "react-dom";
import { getEmptyImage } from "react-dnd-html5-backend";

import {
  getNextCardID,
  beginDrag,
  endDrag,
  getLayout,
  getDraggableTypes
} from "rdx/gridLayout";
import { pxToWH } from "utils";

const DragIcon = ({
  children,
  type,
  gridx = 0,
  gridy = 0,
  width = undefined,
  height = undefined
}) => {
  const nextCardID = useSelector(getNextCardID);
  const { rowHeight, calWidth } = useSelector(getLayout);
  const draggableTypes = useSelector(getDraggableTypes);
  const dispatch = useDispatch();
  const wrapRef = useRef(null);

  const [, drag, preview] = useDrag({
    item: { type },
    begin: monitor => {
      const pxWidth = draggableTypes[type].width;
      const pxHeight = draggableTypes[type].height;

      const { width, height } = pxToWH(pxWidth, pxHeight, rowHeight, calWidth);
      dispatch(
        beginDrag({
          shadowCard: {
            id: nextCardID,
            gridx,
            gridy,
            type,
            height,
            width,
            isShadow: true
          }
        })
      );

      return {
        id: nextCardID,
        type,
        pixelWidth: pxWidth,
        pixelHeight: pxHeight
      };
    },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(endDrag({ id: nextCardID }));
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <div ref={wrapRef} className="drag-icon-wrap">
      <div className="drag-icon" ref={drag}>
        {children}
      </div>
    </div>
  );
};
export default DragIcon;
