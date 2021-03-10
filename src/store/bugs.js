import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

let lastId = 0;

// slice
const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },

    bugsRecieved: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },

    bugRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },

    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },

    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },

    bugAssigned: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].userId = action.payload.user;
    },
  },
});

const {
  bugAdded,
  bugResolved,
  bugAssigned,
  bugsRecieved,
  bugsRequested,
  bugRequestFailed,
} = slice.actions;

export default slice.reducer;

const url = "/bugs";

// action creators
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;
  const diffInMin = moment().diff(moment(lastFetch), "minute");

  if (diffInMin < 10) return;

  return dispatch(
    apiCallBegan({
      url: url,
      onStart: bugsRequested.type,
      onSuccess: bugsRecieved.type,
      onError: bugRequestFailed.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegan({
    url: url,
    data: bug,
    method: "post",
    onSuccess: bugAdded.type,
  });

export const resolveBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });

export const assignBug = (bugId, userId) =>
  apiCallBegan({
    url: url + "/" + bugId,
    method: "patch",
    data: { userId: userId },
    onSuccess: bugAssigned.type,
  });

export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs.list,
  (bugs) => bugs.filter((bug) => bug.resolved !== true)
);

export const getBugByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs.list,
    (bugs) => bugs.filter((bug) => bug.owner === userId)
  );
