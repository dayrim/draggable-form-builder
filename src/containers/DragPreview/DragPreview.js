import React, { useEffect, useState, useRef } from "react";
import { useDragLayer } from "react-dnd";
import { useSelector } from "react-redux";

import { findDOMNode } from "react-dom";
import {
  getShadowedCard,
  getShadowCard,
  getDraggableTypes
} from "rdx/gridLayout";

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 9999,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
};

const DragPreview = props => {
  const {
    type,
    isDragging,
    currentDomOffset,
    currentPointerOffset,
    initialDomOffset,
    item,
    offset
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    type: monitor.getItemType(),
    initialDomOffset: monitor.getInitialClientOffset(),
    currentDomOffset: monitor.getSourceClientOffset(),
    currentPointerOffset: monitor.getDifferenceFromInitialOffset(),
    isDragging: monitor.isDragging(),
    offset: monitor.getDifferenceFromInitialOffset()
  }));
  const dragRef = useRef(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [initX, setInitX] = useState(0);
  const [initY, setInitY] = useState(0);
  const shadowCard = useSelector(getShadowCard);

  useEffect(() => {
    if (initialDomOffset && dragRef?.current && currentPointerOffset) {
      const dragDom = findDOMNode(dragRef.current);
      const dragBoundingRect = dragDom.getBoundingClientRect();
      const dragDomWidth = dragBoundingRect.width;
      const dragDomHeight = dragBoundingRect.height;
      setInitX(initialDomOffset.x - dragDomWidth / 2);
      setInitY(initialDomOffset.y - dragDomHeight / 2);
    }
    if (currentPointerOffset) {
      setX(currentPointerOffset.x);
      setY(currentPointerOffset.y);
    }
  }, [currentDomOffset, initialDomOffset, currentPointerOffset]);

  const draggables = useSelector(getDraggableTypes);
  function renderItem() {
    if (
      (shadowCard &&
        item &&
        shadowCard?.id === item?.id &&
        shadowCard.isOver) ||
      !draggables[type]?.component
    ) {
      // console.log("returned", shadowCard?.id);
      return <></>;
    }
    const Preview = draggables[type].component;
    return <Preview></Preview>;
  }

  return (
    <div className="drag-preview" style={layerStyles}>
      <div
        ref={dragRef}
        style={{
          position: "absolute",
          top: initY,
          left: initX,
          transform: `translate(${x}px, ${y}px)`
        }}
      >
        {renderItem()}
      </div>
    </div>
  );
};
export default DragPreview;
