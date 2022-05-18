import { h, Component } from "preact";
import { Router, route } from "preact-router";
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
import ConfirmDialog from "./dialogs/confirmDialog";
import { deleteAccount } from "./reguests/requests";
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";

// Routes that can be visited without login or registration
const publicRoutes = ["/signup", "/forgot", "/reset", "/login", "/confirm"];

// Routes that can only be visited by admin
const adminOnlyRoutes = ["/settings", "/users"];

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */

  componentWillMount = () => {
    // showInstruction will be used by login view and determines if instruction will be shown or the normal login form
    this.setState({ showInstruction: false });

    // drawerOpen will be given to the navbar and determines if the text is shown
    this.setState({ drawerOpen: false });
  };

  // To prevent the User from visiting routes he has no authorization for
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

    this.setState({ selectedRoute: e.url });
  };

  // Given to TopAppbar(pageheader) to collapse navbar
  toggleDrawer = () => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    let coll = document.getElementById("navbar");

    if (vw > 768) {
      if (this.state.drawerOpen === false) {
        this.setState({ drawerOpen: true });
      } else {
        this.setState({ drawerOpen: false });
      }

      if (coll.style.maxWidth === "256px" || coll.style.maxWidth === "") {
        coll.style.maxWidth = "57px";
      } else {
        coll.style.maxWidth = "256px";
      }
    }
  };

  // to show header only when user is logged in
  renderTopAppBar = (userLoggedIn) => {
    if (userLoggedIn === undefined || userLoggedIn === false) {
      return undefined;
    }

    return (
      <Header
        setReload={this.setReload}
        toggleNavbar={this.toggleDrawer}
        showSnackbar={this.showSnackbar}
      />
    );
  };

  // Referenz for navbar to open it
  drawerRef = (drawer) => (this.drawer = drawer);

  // Referenz for Confirm Dialog to open it
  confirmDialogRef = (confirmDialog) => (this.confirmDialog = confirmDialog);

  // to show navbar only when user is logged in
  renderNavbar = (userLoggedIn, drawerOpen) => {
    if (userLoggedIn === undefined || userLoggedIn === false) {
      return undefined;
    }

    return (
      <Navbar
        drawerRef={this.drawerRef}
        drawerOpen={drawerOpen}
        openDrawer={this.openDrawer}
        selectedRoute={this.state.selectedRoute}
      />
    );
  };

  // Initial open navbar and set maxWidth, so that callapse is working
  openDrawer = () => {
    // let drawer = document.getElementById("navbar");

    // drawer.style.maxWidth = "250px";
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    this.drawer.MDComponent.open = true;
  };

  // Is given to login view, so than instruction will be show if ths user tries to login with non confirmed email
  setInstructions = (val) => {
    this.setState({ showInstruction: val });
  };

  // Will be given to measurements view and will be triggered after it loads measurement data. If measurements view updates with reload = true
  // it will reload the data. Header sets it to true if it creates a new measurement
  unsetReload = () => {
    this.setState({ reload: false });
  };

  // Given to topappbar(header). If set to true it tells measurement view to reload the data
  setReload = () => {
    this.setState({ reload: true });
  };

  // If Url changes, checks if user is logged in, so that header and navbar can be displayed
  handleChange = (e) => {
    this.handleRoute(e);

    if (Auth.getUser() === undefined) {
      this.setState({ userLoggedIn: false });
    } else {
      this.setState({ userLoggedIn: true });
    }
  };

  openConfirmDialog = () => {
    this.confirmDialog.MDComponent.show();
  };

  // Opens snackbar with given text, if error true text will be red else green
  showSnackbar = (text, error) => {
    let sbText = document.getElementsByClassName("mdc-snackbar__text");
    let errorColor = "#B1262D";
    let successColor = "#3C9052";

    if (error) {
      sbText[0].style.color = errorColor;
    } else {
      sbText[0].style.color = successColor;
    }

    this.bar.MDComponent.show({
      message: text,
    });
  };

  getBugTrackerScript = (userLoggedIn) => {
    if (userLoggedIn === undefined || userLoggedIn === false) {
      return undefined;
    }

    return (
      <script
        type="text/javascript"
        src="https://vp-systeme.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-onpk8x/b/7/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=de-DE&collectorId=cc9af09f"
      />
    );
  };

  render() {
    return (
      <div id="app">
        {/* Skript for Bug Tracker */}
        {this.getBugTrackerScript(this.state.userLoggedIn)}
        <ConfirmDialog
          reference={this.confirmDialogRef}
          dialogHeader={"Accout wirklich löschen?"}
          deleteAccount={deleteAccount}
        />

        {/* Header (TopAppBar) */}
        {this.renderTopAppBar(this.state.userLoggedIn)}

        {/* Seiteninhalt */}
        <div id="page">
          {/* NavBar */}
          {this.renderNavbar(this.state.userLoggedIn, this.state.drawerOpen)}

          {/* Routing  mit allen Views */}
          <Router onChange={this.handleChange}>
            <Login
              path="/login"
              showInstruction={this.state.showInstruction}
              setInstructions={this.setInstructions}
            />
            <Signup path="/signup" setInstructions={this.setInstructions} />
            <Profile
              path="/profile"
              openConfirmDialog={this.openConfirmDialog}
              showSnackbar={this.showSnackbar}
            />
            <Measurements
              path="/measurements"
              reload={this.state.reload}
              unsetReload={this.unsetReload}
              showSnackbar={this.showSnackbar}
            />
            <Users path="/users" showSnackbar={this.showSnackbar} />
            <Forgot path="/forgot" />
            <Reset path="/reset" />
            <Settings path="/settings" showSnackbar={this.showSnackbar} />
            <Confirm path="/confirm" />
            <NotFound default />
          </Router>
        </div>
        <div id="mySnackbar">
          <Snackbar
            ref={(bar) => {
              this.bar = bar;
            }}
          />
        </div>
      </div>
    );
  }
}
