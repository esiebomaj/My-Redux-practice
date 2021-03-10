import reducer from "./reducer";

function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    for (let listener of listeners) {
      listener();
    }
  };

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default createStore(reducer);
