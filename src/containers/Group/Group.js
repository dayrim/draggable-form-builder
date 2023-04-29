import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  Fragment,
  useState
} from "react";
import { DndProvider, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import { map } from "lodash";

import { getContainerMaxHeight } from "utils";
import {
  moveCardInGroup,
  cardDropInGroup,
  cardHoverOverGroup,
  getDraggableTypes,
  renderGrid,
  getNextGroupID,
  getCards,
  getLayout,
  getDefaultLayout,
  createNewGroup
} from "rdx/gridLayout";
import { Card } from "components";
import { findDOMNode } from "react-dom";
import { useDispatch, useSelector } from "react-redux";

const Group = ({ id = undefined, children, render }) => {
  const dispatch = useDispatch();
  const groupWrapRef = useRef(null);
  const draggableTypes = useSelector(getDraggableTypes);
  const layout = useSelector(getLayout);
  const defaultLayout = useSelector(getDefaultLayout);
  const nextGroupID = useSelector(getNextGroupID);
  const [groupID] = useState(id === undefined ? nextGroupID : id);
  const cards = useSelector(getCards(groupID));

  useEffect(() => {
    console.log(nextGroupID, "nextGroupID");
    if (id === undefined) dispatch(createNewGroup({ groupID: nextGroupID }));
  }, []);

  const [{ isOver, item }, drop] = useDrop({
    accept: ["Card", ...map(draggableTypes, ({ type }) => type)],
    hover(item, monitor, component) {
      if (groupWrapRef?.current) {
        // const hoverItem = props;
        // console.log(drop());
        const { x, y } = monitor.getClientOffset();

        const groupDom = findDOMNode(groupWrapRef.current);
        const groupBoudingRect = groupDom.getBoundingClientRect();

        const groupItemX = groupBoudingRect.left;
        const groupItemY = groupBoudingRect.top;
        console.log(
          x - groupItemX - item.pixelWidth / 2,
          y - groupItemY,
          "x, y"
        );
        console.log(item, "item");
        dispatch(
          moveCardInGroup({
            cardID: item.id,
            groupID,
            x: x - groupItemX - item.pixelWidth / 2,
            y: y - groupItemY
          })
        );
      }
    },
    drop(item, monitor) {
      dispatch(cardDropInGroup());
    },
    collect: mon => ({
      isOver: mon.isOver(),
      item: mon.getItem()
    })
  });

  useEffect(() => {
    if (groupWrapRef?.current) {
      dispatch(cardHoverOverGroup({ groupID: groupID, isOver }));
    }
  }, [dispatch, groupID, isOver]);

  useEffect(() => {
    const containerDom = document.querySelector(".card-container");

    if (layout.containerWidth !== containerDom.clientWidth) {
      dispatch(renderGrid());
    }
  }, []);

  const containerMaxHeight = getContainerMaxHeight(
    cards,
    layout.rowHeight,
    layout.margin
  );

  return (
    <div ref={groupWrapRef}>
      <div className="group-item" ref={drop}>
        <div
          className="group-item-container"
          style={{
            background: isOver ? "rgba(79,86,98,.1)" : "transparent"
          }}
        >
          <section
            className="card-container"
            style={{
              height:
                containerMaxHeight > defaultLayout.containerHeight
                  ? containerMaxHeight
                  : defaultLayout.containerHeight
            }}
          >
            {render(cards, groupID)}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Group;
