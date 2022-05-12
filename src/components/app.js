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
import Navbar from "./navbar/navbar";
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
    this.setState({ drawerOpen: false });
    this.setState({ railOpen: false });
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

    if (e.url === "/") {
      route("/login", true);
    } else {
      route(e.url, true);
    }
  };

  toggleDrawer = () => {
    console.log("TOGGLE");
    if (this.drawer.MDComponent.open === false) {
      console.log("OPEN DRAWER");
      this.drawer.MDComponent.open = true;
      this.rail.MDComponent.open = false;
      this.setState({ drawerOpen: true });
      this.setState({ railOpen: false });
      //   this.setState({ versionClass: style.versionContainer });
    } else {
      console.log("OPEN RAIL");
      this.drawer.MDComponent.open = false;
      this.rail.MDComponent.open = true;
      this.setState({ drawerOpen: false });
      this.setState({ railOpen: true });
      //   this.setState({ versionClass: style.versionContainerRail });
    }
    // this.getNavbarContent(this.props);
  };

  renderTopAppBar = (userLoggedIn) => {
    if (userLoggedIn === undefined || userLoggedIn === false) {
      return undefined;
    }

    return (
      <Header setReload={this.setReload} toggleNavbar={this.toggleDrawer} />
    );
  };

  getDrawerOpen = () => {
    if (
      this.state.drawerOpen === undefined ||
      this.state.drawerOpen === false
    ) {
      return false;
    }

    return true;
  };

  getRailOpen = () => {
    if (this.state.railOpen === undefined || this.state.railOpen === false) {
      return false;
    }

    return true;
  };

  drawerRef = (drawer) => (this.drawer = drawer);
  railRef = (rail) => (this.rail = rail);

  renderNavbar = (userLoggedIn, drawerOpen, railOpen) => {
    if (userLoggedIn === undefined || userLoggedIn === false) {
      return undefined;
    }

    return (
      <Navbar
        drawerRef={this.drawerRef}
        railRef={this.railRef}
        drawer={drawerOpen}
        rail={railOpen}
      />
    );
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

  handleChange = (e) => {
    this.handleRoute(e);

    if (Auth.getUser() === undefined) {
      this.setState({ userLoggedIn: false });
    } else {
      this.setState({ userLoggedIn: true });
    }
  };

  render() {
    return (
      <div id="app">
        <script
          type="text/javascript"
          src="https://vp-systeme.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-onpk8x/b/7/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=de-DE&collectorId=cc9af09f"
        />
        {this.renderTopAppBar(this.state.userLoggedIn)}
        <div id="page">
          {this.renderNavbar(
            this.state.userLoggedIn,
            this.state.drawerOpen,
            this.state.railOpen
          )}
          <Router onChange={this.handleChange}>
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
      </div>
    );
  }
}
