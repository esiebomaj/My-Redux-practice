import { combineReducers } from "@reduxjs/toolkit";
import bugReducer from "./bugs";
import userReducer from "./users";
import projectReducer from "./projects";

export default combineReducers({
  projects: projectReducer,
  bugs: bugReducer,
  users: userReducer,
});
