import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import store from "./store/index";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import App from "./App";
import { CSSTransition,TransitionGroup } from 'react-transition-group'
import { routes } from "./route/route";
import ScrollToTop from "./component/common/ScrollToTop";

const Root = (props) => {
  return (
    <Fragment>
      <Provider store={store}>
        <BrowserRouter basename={`/`}>
          <ScrollToTop />
          <Switch>
              <App>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/`}
                  render={() => {
                    return (
                      <Redirect
                        to={`${process.env.PUBLIC_URL}/projects`}
                      />
                    );
                  }}
                />

                <TransitionGroup>
                {routes.map(({ path, Component }) => (
                  <Route
                    key={path}
                    path={`${process.env.PUBLIC_URL}${path}`}
                  >
                    {({ match }) => ( 
                   <CSSTransition 
                                  in={match != null}
                                  timeout={500}
                                  unmountOnExit
                                  >
                    <div>
                      <Component />
                    </div>
                    </CSSTransition>
                   )}
                  </Route>
                ))}
                </TransitionGroup>
              </App>
          </Switch>
        </BrowserRouter>
      </Provider>
    </Fragment>
  );
};
ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
