import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
}));

export default function TextFields() {
  const classes = useStyles();

  return (
    <div style={{ padding: "8px", flex: "1 1 100%" }}>
      <TextField
        id="standard-full-width"
        label="Label"
        placeholder="Placeholder"
        helperText="Text editor!"
        fullWidth
        multiline
        rowsMax="4"
        rows="4"
        variant="outlined"
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
      />
    </div>
  );
}
