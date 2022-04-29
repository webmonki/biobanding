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
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

const publicRoutes = ["/signup", "/forgot", "/reset", "/login"];
const adminOnlyRoutes = ["/settings", "/users"];

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */

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

  render() {
    return (
      <div id="app">
        <Header />
        <Router onChange={this.handleRoute}>
          <Login path="/login" />
          <Signup path="/signup" />
          <Profile path="/profile/" user="me" />
          <Profile path="/profile/:user" />
          <Measurements path="/measurements" />
          <Users path="/users" />
          <Forgot path="/forgot" />
          <Reset path="/reset" />
          <Settings path="/settings" />
          <NotFound default />
        </Router>
      </div>
    );
  }
}
