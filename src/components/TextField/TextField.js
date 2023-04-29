import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function TextFields() {
  const classes = useStyles();

  return (
    <TextField
      required
      variant="outlined"
      id="standard-required"
      label="Required"
      defaultValue="Hello World"
      className={classes.textField}
      margin="normal"
    />
  );
}
