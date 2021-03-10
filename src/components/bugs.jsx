import React, { Component } from "react";
import { connect } from "react-redux";
import { loadBugs, resolveBug } from "../store/bugs";

class Bugs extends Component {
  state = { bugs: [] };

  componentDidMount() {
    this.props.loadBugs();
  }

  render() {
    const { bugs, loading } = this.props;
    return (
      <div>
        <h1>Bugs</h1>
        <ul>
          {loading ? (
            <p>Loading bugs...</p>
          ) : (
            bugs.map((bug) => (
              <li style={{ margin: "10px" }} key={bug.id}>
                {bug.description + " - id :  " + bug.id}

                {bug.resolved ? (
                  <span style={{ color: "blue", margin: "0 5px" }}>
                    &#9812;
                  </span>
                ) : (
                  <span style={{ color: "red", margin: "0 5px" }}>&#9876;</span>
                )}
                <button onClick={() => this.props.resolveBug(bug.id)}>
                  resolve
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }
}
const matchStateToProps = (state) => ({
  bugs: state.entities.bugs.list,
  loading: state.entities.bugs.loading,
});
const matchDispatchToProps = (dispatch) => ({
  loadBugs: () => dispatch(loadBugs()),
  resolveBug: (id) => dispatch(resolveBug(id)),
});

export default connect(matchStateToProps, matchDispatchToProps)(Bugs);
