import React from "react";
import Checkbox from "@material-ui/core/Checkbox";

export default function Checkboxes() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = event => {
    setChecked(event.target.checked);
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      value="primary"
      inputProps={{ "aria-label": "primary checkbox" }}
    />
  );
}
