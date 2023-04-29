import React from "react";
import "./App.scss";
import { DrawerLayout, DragPreview } from "containers";
import { Dropdown, TextField, TextArea, Checkbox } from "components";
import { Provider } from "containers";
import mockData from "mock";

function App() {
  console.log(Dropdown, "Dropdown");
  console.log(<Dropdown></Dropdown>, "Dropdown");
  return (
    <Provider
      initialState={mockData}
      draggableTypes={{
        Dropdown: {
          component: Dropdown,
          name: "Dropdown",
          type: "Dropdown",
          width: 170,
          height: 100
        },
        TextField: {
          component: TextField,
          name: "Text Field",
          type: "TextField",
          width: 200,
          height: 60
        },
        TextArea: {
          component: TextArea,
          name: "Text Area",
          type: "TextArea",
          width: 470,
          height: 175
        },
        Checkbox: {
          component: Checkbox,
          name: "Checkbox",
          type: "Checkbox",
          width: 42,
          height: 42
        }
      }}
    >
      <div className="App">
        <DragPreview></DragPreview>
        <DrawerLayout></DrawerLayout>
      </div>
    </Provider>
  );
}

export default App;
