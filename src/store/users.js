import { createSlice } from "@reduxjs/toolkit";

let lastID = 0;

const users = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    userAdded: (users, action) => {
      users.push({
        id: ++lastID,
        name: action.payload.name,
      });
    },
  },
});

export const { userAdded } = users.actions;
export default users.reducer;
