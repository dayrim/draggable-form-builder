import { combineEpics } from "redux-observable";

import * as gridLayout from "rdx/gridLayout/epic";

export default combineEpics(...Object.values(gridLayout));
