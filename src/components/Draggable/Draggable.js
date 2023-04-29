import React, { memo, Component, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { calWHtoPx, calGridItemPosition } from "utils";
import { isEqual } from "lodash";
import { DragSource } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { beginDrag, endDrag, getDraggableTypes } from "rdx/gridLayout";
import { getEmptyImage } from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";

import { pxToWH } from "utils";
import { findByLabelText } from "@testing-library/react";

const Draggable = ({}) => {
  return <></>;
};

export default Draggable;
