import React, { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { loadBugs, resolveBug } from "../store/bugs";

const BugsUI = () => {
  const dispatch = useDispatch();
  const { list: bugs, loading } = useSelector((state) => state.entities.bugs);

  useEffect(() => {
    dispatch(loadBugs());
  }, []);

  return (
    <div>
      <h1>Bug</h1>
      <ul>
        {loading ? (
          <p>Loading bugs...</p>
        ) : (
          bugs.map((bug) => (
            <li key={bug.id}>
              {bug.description}
              {bug.resolved ? (
                <span style={{ margin: "0 5px", color: "blue" }}>&#9745;</span>
              ) : (
                <span style={{ margin: "0 5px", color: "red" }}>&#9746;</span>
              )}
              <button onClick={() => dispatch(resolveBug(bug.id))}>
                resolve
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default BugsUI;
