import React, { useState, useEffect, Component } from "react";
import mockData from "mock";
import { Group } from "containers";
import { cloneDeep, forEach, map } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "components";
import { DndProvider, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import { calColCount, calColWidth, compactLayoutHorizontal } from "utils";
import {
  getCompactType,
  getDefaultLayout,
  getGroups,
  getLayout,
  renderGrid
} from "rdx/gridLayout";

const Content = () => {
  const dispatch = useDispatch();
  const groups = useSelector(getGroups);
  const layout = useSelector(getLayout);
  const defaultLayout = useSelector(getDefaultLayout);

  useEffect(() => {
    window.addEventListener("resize", handleLoad);
    return () => window.removeEventListener("resize", handleLoad);
  }, []);

  const initGroupItem = groups => {
    let itemDoms = [];
    itemDoms = groups.map((g, i) => {
      return <Group id={g.id} />;
    });
    return itemDoms;
  };

  const handleLoad = () => {
    dispatch(renderGrid());
  };
  return (
    <div>
      <Group
        id={0}
        render={(cards, groupID) =>
          map(cards, card => (
            <Card
              key={`${groupID}_${card.id}`}
              cardID={card.id}
              groupID={groupID}
              props={{
                type: "text",
                name: "clientCode",
                placeholder: "Please insert your account number",
                onChange: () => {},
                value: "",
                isInvalid: true
              }}
            />
          ))
        }
      ></Group>
      <Group
        render={(cards, groupID) =>
          map(cards, card => (
            <Card
              key={`${groupID}_${card.id}`}
              cardID={card.id}
              groupID={groupID}
            />
          ))
        }
      />
    </div>
  );
};
export default Content;
