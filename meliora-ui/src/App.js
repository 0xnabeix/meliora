import React, { Fragment } from "react";
import Loader from "./component/common/loader/loader";
import Header from "./component/common/header/header";
import Footer from "./component/common/footer/footer";
// import ThemeCustomize from "./component/common/theme-customizer/themeCustomize";
import { ToastContainer } from "react-toastify";

const App = ({ children }) => {
  return (
    <Fragment>
      <Loader />
      <div className="page-wrapper">
        <div className="page-body-wrapper">
          <Header />
          <div className="page-body">{children}</div>
          <Footer />
          {/* <ThemeCustomize /> */}
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default App;
