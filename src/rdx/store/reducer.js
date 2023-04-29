import { combineReducers } from "redux";
import gridLayout, {
  initState as gridLayoutState
} from "rdx/gridLayout/reducer";

export const combinedInitStates = {
  gridLayout: gridLayoutState
};

export default () =>
  combineReducers({
    gridLayout
  });
