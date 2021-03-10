import { combineReducers } from "@reduxjs/toolkit";
import reducer from "./entities";

export default combineReducers({
  entities: reducer,
});
