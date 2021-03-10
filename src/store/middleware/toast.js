const toast = (state) => (next) => (action) => {
  if (action.type === "error") {
    console.error("toastify:", action.payload.message);
    return next(action);
  } else {
    return next(action);
  }
};

export default toast;
