import { combineReducers } from "redux";
import user from "./user";
import follower from "./follower";
import presences from "./presences";

export default combineReducers({ follower, user, presences });
