import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
    margin: "0",
    padding: "5px"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function Dropdown(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState("");
  const handleChange = event => {
    setAge(event.target.value);
  };
  return (
    <FormControl className={classes.formControl}>
      <Select
        value={age}
        onChange={handleChange}
        displayEmpty
        variant={props.variant || "outlined"}
        className={classes.selectEmpty}
      >
        <MenuItem value="" disabled>
          Placeholder
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
      <FormHelperText>Placeholder</FormHelperText>
    </FormControl>
  );
}
