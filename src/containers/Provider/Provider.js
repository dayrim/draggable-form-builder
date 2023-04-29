import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import configStore from "rdx/store";
const Provider = ({ children, draggableTypes, initialState }) => {
  return (
    <ReduxProvider
      store={configStore({
        gridLayout: {
          draggableTypes,
          groups: initialState
        }
      })}
    >
      <DndProvider backend={Backend}>{children}</DndProvider>
    </ReduxProvider>
  );
};

export default Provider;
