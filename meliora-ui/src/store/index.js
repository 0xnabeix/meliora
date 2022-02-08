import { createStore, applyMiddleware, compose } from "redux";
// middlewares
import thunkMiddleware from "redux-thunk";
// Import custom components

const store = createStore(
  compose(
    applyMiddleware(thunkMiddleware),

    //For working redux dev tools in chrome (https://github.com/zalmoxisus/redux-devtools-extension)
    window.devToolsExtension
      ? window.devToolsExtension()
      : function (f) {
          return f;
        }
  )
);

export default store;
