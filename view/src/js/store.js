import { createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import Reducers from "./reducers";

/**
 * @type {Store}
 */
const store = createStore(Reducers, composeWithDevTools());
window.store = store;
export default store;
