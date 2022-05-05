import { h, Component } from "preact";
import { Router } from "preact-router";
import { route } from "preact-router";
import Header from "./header";
import Profile from "../routes/profile";
import NotFound from "../routes/404";
import Measurements from "../routes/measurements";
import Login from "../routes/login";
import Signup from "../routes/signup";
import Auth from "./state";
import Users from "../routes/users";
import Forgot from "../routes/forgot";
import Reset from "../routes/reset";
import Settings from "../routes/settings";
import Confirm from "../routes/confirm";
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

const publicRoutes = ["/signup", "/forgot", "/reset", "/login", "/confirm"];
const adminOnlyRoutes = ["/settings", "/users"];

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */

  componentWillMount = () => {
    this.setState({ showInstruction: false });
  };

  handleRoute = async (e) => {
    let auth = Auth.getAuth();
    const isPublicRoute = publicRoutes.some((route) => e.url.match(route));
    const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
      e.url.match(route)
    );

    if (auth === false || (auth === undefined && !isPublicRoute)) {
      route("/login", true);
    } else if (!Auth.check_admin() && isAdminOnlyRoute) {
      route("/measurements", true);
    }

    this.setState({ currentUrl: e.url });
  };

  setInstructions = (val) => {
    this.setState({ showInstruction: val });
  };

  unsetReload = () => {
    this.setState({ reload: false });
  };

  setReload = () => {
    this.setState({ reload: true });
  };

  render() {
    return (
      <div id="app">
        <Header setReload={this.setReload} />
        <Router onChange={this.handleRoute}>
          <Login
            path="/login"
            showInstruction={this.state.showInstruction}
            setInstructions={this.setInstructions}
          />
          <Signup path="/signup" setInstructions={this.setInstructions} />
          <Profile path="/profile/" user="me" />
          <Profile path="/profile/:user" />
          <Measurements
            path="/measurements"
            reload={this.state.reload}
            unsetReload={this.unsetReload}
          />
          <Users path="/users" />
          <Forgot path="/forgot" />
          <Reset path="/reset" />
          <Settings path="/settings" />
          <Confirm path="/confirm" />
          <NotFound default />
        </Router>
      </div>
    );
  }
}
