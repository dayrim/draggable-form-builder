import { devToolsEnhancer } from "redux-devtools-extension/developmentOnly";
import { createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { merge } from "lodash";

import rootReducer, { combinedInitStates } from "./reducer";
import rootEpic from "./epic";

export default externalInitState => {
  const epicMiddleware = createEpicMiddleware();

  const enhancer = compose(
    applyMiddleware(epicMiddleware),
    devToolsEnhancer({
      name: "Erply Launchpad",
      trace: true,
      traeLimit: 30
    })
  );
  const initState = merge(externalInitState, combinedInitStates);
  console.log(initState, "initState");
  const store = createStore(rootReducer(), initState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducer", () => {
      const nextReducer = require("./reducer").default; // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }
  epicMiddleware.run(rootEpic);

  return store;
};
