import React, { memo, Component, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { calWHtoPx, calGridItemPosition } from "utils";
import { isEqual } from "lodash";
import { DragSource } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  beginDrag,
  endDrag,
  getDraggableTypes,
  getCardByID,
  getLayout
} from "rdx/gridLayout";
import { getEmptyImage } from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";

import { pxToWH } from "utils";
import { findByLabelText } from "@testing-library/react";

const Card = ({ cardID, groupID, props }) => {
  const dispatch = useDispatch();
  const { margin, rowHeight, calWidth } = useSelector(getLayout);
  const draggables = useSelector(getDraggableTypes);
  const {
    gridx,
    gridy,
    width,
    height,
    isShadow,
    type = "Card"
  } = useSelector(getCardByID(groupID, cardID));
  const contentRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type },
    begin: () => {
      const contentDom = findDOMNode(contentRef.current);
      const contentBoundingRect = contentDom.getBoundingClientRect();
      console.log(contentBoundingRect, "contentBoundingRect");
      const contentDomWidth = contentBoundingRect.width;
      const contentDomHeight = contentBoundingRect.height;
      dispatch(beginDrag({ groupID, id: cardID }));
      return {
        id: cardID,
        type,
        pixelWidth: contentDomWidth,
        pixelHeight: contentDomHeight
      };
    },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(endDrag({ id: cardID }));
      }
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const { x, y } = calGridItemPosition(
    gridx,
    gridy,
    margin,
    rowHeight,
    calWidth
  );
  const { wPx, hPx } = calWHtoPx(width, height, margin, rowHeight, calWidth);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <>
      {isShadow ? (
        <div
          className="card-shadow"
          ref={drag}
          style={{
            width: wPx,
            height: hPx,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            transform: `translate(${x}px, ${y}px)`
          }}
        >
          <div ref={contentRef} style={{ width: "100%" }}>
            {/* <div style={{ position: "absolute", top: "0", right: "0" }}>XXX</div> */}
            {(() => {
              const Draggable = draggables[type] ?.component;
              if (Draggable) return <Draggable {...props}></Draggable>;
              return <div></div>;
            })()}
          </div>
        </div>
      ) : (
          <div
            className="card"
            ref={drag}
            style={{
              width: wPx,
              height: hPx,
              opacity: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `translate(${x}px, ${y}px)`
            }}
          >
            <div ref={contentRef} style={{ width: "100%" }}>
              {/* <div style={{ position: "absolute", top: "0", right: "0" }}>XXX</div> */}
              {(() => {
                const Draggable = draggables[type] ?.component;
                if (Draggable) return <Draggable></Draggable>;
                return <div>{cardID}</div>;
              })()}
            </div>
          </div>
        )}
    </>
  );
};

export default Card;
