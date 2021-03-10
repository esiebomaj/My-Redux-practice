import { Provider } from "react-redux";
import "./App.css";
import Bugs from "./components/bugs";
import configureStore from "./store/configureStore";
import BugsUI from "./components/bugsUI";

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <Bugs />
      {/* <BugsUI /> */}
    </Provider>
  );
}

export default App;
