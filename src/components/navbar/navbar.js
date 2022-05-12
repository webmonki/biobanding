import Drawer from "preact-material-components/Drawer";
import "preact-material-components/Drawer/style.css";
import { h, Component } from "preact";
import "preact-material-components/List/style.css";
import List from "preact-material-components/List";
import style from "./style";
import { route } from "preact-router";
import Auth from "../state";

export default class Navbar extends Component {
  dialogRef = (dialog) => (this.dialog = dialog);

  componentWillMount = () => {
    this.setState({ versionClass: style.versionContainer });

    this.getNavbarContent(this.props);
  };

  linkTo = (path) => () => {
    route(path);
  };

  goHome = this.linkTo("/");
  goToMyProfile = this.linkTo("/profile");
  goToMeasurements = this.linkTo("/measurements");
  goToUsers = this.linkTo("/users");
  goToSettings = this.linkTo("/settings");

  getDisplayBar = () => {
    if (this.props.drawer === true) {
      console.log("DISPLAY DRAWER");
      return { display: "block" };
    }
    console.log("DONT DISPLAY DRAWER");
    return { display: "none" };
  };

  getDisplayRail = () => {
    if (this.props.rail === true) {
      console.log("DISPLAY RAIL");
      return { display: "block" };
    }
    console.log("DONT DISPLAY RAIL");
    return { display: "none" };
  };

  getNavbarContent = (props) => {
    let content;
    if (Auth.check_admin()) {
      content = (
        <div id="navbar">
          <div class={this.state.versionClass}>
            <span>{Auth.version}</span>
          </div>

          <Drawer
            dismissible
            ref={this.props.drawerRef}
            class={style.navbar}
            style={{ display: this.getDisplayBar() }}
          >
            <Drawer.DrawerContent class={style.navbarContent}>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/measurements"}
                onClick={this.goToMeasurements}
              >
                <List.ItemGraphic>equalizer</List.ItemGraphic>
                <span>Messungen</span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/users"}
                onClick={this.goToUsers}
              >
                <List.ItemGraphic>group</List.ItemGraphic>
                <span>Benutzer</span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/profile"}
                onClick={this.goToMyProfile}
              >
                <List.ItemGraphic>account_circle</List.ItemGraphic>
                <span>Profil</span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/settings"}
                onClick={this.goToSettings}
              >
                <List.ItemGraphic>build</List.ItemGraphic>
                <span>Einstellungen</span>
              </Drawer.DrawerItem>
            </Drawer.DrawerContent>
          </Drawer>
          <Drawer
            dismissible
            ref={this.props.railRef}
            class={style.navrail}
            style={this.getDisplayRail()}
          >
            <Drawer.DrawerContent class={style.navrailContent}>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/measurements"}
                onClick={this.goToMeasurements}
              >
                <List.ItemGraphic>equalizer</List.ItemGraphic>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/users"}
                onClick={this.goToUsers}
              >
                <List.ItemGraphic>group</List.ItemGraphic>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/profile"}
                onClick={this.goToMyProfile}
              >
                <List.ItemGraphic>account_circle</List.ItemGraphic>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/settings"}
                onClick={this.goToSettings}
              >
                <List.ItemGraphic>build</List.ItemGraphic>
              </Drawer.DrawerItem>
            </Drawer.DrawerContent>
          </Drawer>
        </div>
      );
    } else {
      content = (
        <div id="navbar">
          <Drawer dismissible ref={this.props.drawerRef} class={style.navbar}>
            <Drawer.DrawerContent class={style.navbarContent}>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/measurements"}
                onClick={this.goToMeasurements}
              >
                <List.ItemGraphic>equalizer</List.ItemGraphic>
                <span>Messungen</span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/profile"}
                onClick={this.goToMyProfile}
              >
                <List.ItemGraphic>account_circle</List.ItemGraphic>
                <span>Profil</span>
              </Drawer.DrawerItem>
            </Drawer.DrawerContent>
          </Drawer>
          <Drawer dismissible ref={this.props.railRef} class={style.navrail}>
            <Drawer.DrawerContent class={style.navrailContent}>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/measurements"}
                onClick={this.goToMeasurements}
              >
                <List.ItemGraphic>equalizer</List.ItemGraphic>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                selected={props.selectedRoute === "/profile"}
                onClick={this.goToMyProfile}
              >
                <List.ItemGraphic>account_circle</List.ItemGraphic>
              </Drawer.DrawerItem>
            </Drawer.DrawerContent>
          </Drawer>
        </div>
      );
    }

    this.setState({ content });
  };

  render() {
    return this.state.content;
  }
}
