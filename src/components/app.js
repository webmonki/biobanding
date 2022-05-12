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

// Routen die ohne Registrierung oder Anmeldung aufgerufen werden können
const publicRoutes = ["/signup", "/forgot", "/reset", "/login", "/confirm"];

// Routen die nur vom Admin aufgerufen werden dürfen
const adminOnlyRoutes = ["/settings", "/users"];

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */

  componentWillMount = () => {
    // showInstruction wird login übergeben und bestimmt
    //ob der normale Login oder Anweisungen um die Email zu bestätigen angezeigt werden sollen
    this.setState({ showInstruction: false });

    // drawer Open wird der Navbar übergeben und bestimmt ob der Text angezeigt werden soll oder nicht
    this.setState({ drawerOpen: false });
  };

  // Um zu verhindern, dass Benutzer auf nicht zu gelassene Seiten zugreifen können
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

  // Wird dem Header übergeben und Collapset die Navbar
  toggleDrawer = () => {
    if (this.state.drawerOpen === false) {
      this.setState({ drawerOpen: true });
    } else {
      this.setState({ drawerOpen: false });
    }

    let coll = document.getElementById("navbar");

    if (coll.style.maxWidth === "250px") {
      coll.style.maxWidth = "57px";
    } else {
      coll.style.maxWidth = "250px";
    }
  };

  // Um Header nur anzuzeigen wenn Benutzer eingeloggt ist
  renderTopAppBar = (userLoggedIn) => {
    if (userLoggedIn === undefined || userLoggedIn === false) {
      return undefined;
    }

    return (
      <Header setReload={this.setReload} toggleNavbar={this.toggleDrawer} />
    );
  };

  // Referenz um Navbar zu öffnen
  drawerRef = (drawer) => (this.drawer = drawer);

  // Um Navbar nur anzuzeigen wenn Benutzer eingeloggt ist
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

  // Initial Navbar öffnen und maxwidth setzten, damit collapse funktioniert
  openDrawer = () => {
    let drawer = document.getElementById("navbar");

    drawer.style.maxWidth = "250px";
    this.drawer.MDComponent.open = true;
  };

  // Wird login übergeben um damit nach login mit nicht bestätigter Email Anweisungen angezeigt werden können
  setInstructions = (val) => {
    this.setState({ showInstruction: val });
  };

  // Wird measurments übergeben und nach dem Laden der Daten ausgeführt. Somit kann Header neue Messung erstellen und wieder measurement sagen
  // dass er die Daten neu laden soll
  unsetReload = () => {
    this.setState({ reload: false });
  };

  // Wird Header(TopAppBar) übergeben, wenn true werden daten neu geladen. Dafür da damit man im Header neue Messung erstellen kann
  // und diese direkt in measurements angezeigt werden
  setReload = () => {
    this.setState({ reload: true });
  };

  // Wenn sich der Url ändert. HandleRoute siehe oben. Checkt ob Benutzer angemeldet ist, damit Header und Navbar angezeigt werden
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
        {/* Skript für Bug Tracker */}
        <script
          type="text/javascript"
          src="https://vp-systeme.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-onpk8x/b/7/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=de-DE&collectorId=cc9af09f"
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
