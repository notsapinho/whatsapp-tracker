import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import Framework7 from "framework7/framework7-lite.esm.bundle.js";
import Framework7React from "framework7-react";
import "framework7/css/framework7.bundle.css";
import "./css/icons.css";
import "./css/app.scss";
import App from "./components/app.jsx";
import client from "./js/client";
client.init();

Framework7.use(Framework7React);

ReactDOM.render(React.createElement(App), document.getElementById("root"));

serviceWorker.register();
