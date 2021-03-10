import axios from "axios";
import * as actions from "../api";
import { apiCallFailed } from "./../api";

const api = (store) => (next) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) return next(action);
  const { url, method, data, onStart, onSuccess, onError } = action.payload;

  if (onStart) store.dispatch({ type: onStart });
  next(action);

  try {
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url,
      method,
      data,
    });

    store.dispatch(actions.apiCallSuccess(response.data));
    if (onSuccess) store.dispatch({ type: onSuccess, payload: response.data });
  } catch (e) {
    store.dispatch(apiCallFailed({ message: e.message }));
    if (onError) store.dispatch({ type: onError, payload: e.message });
  }
};

export default api;
