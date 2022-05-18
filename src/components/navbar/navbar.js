import Drawer from "preact-material-components/Drawer";
import "preact-material-components/Drawer/style.css";
import { h, Component } from "preact";
import "preact-material-components/List/style.css";
import List from "preact-material-components/List";
import style from "./style";
import { route } from "preact-router";
import Auth from "../state";

export default class Navbar extends Component {
  componentWillMount = () => {
    this.setState({ versionClass: style.versionContainer });
  };

  componentDidMount = () => {
    // initial opening of the navbar. navbar will never be closed again
    this.props.openDrawer();
  };

  linkTo = (path) => () => {
    route(path);
  };

  // Page Routing for navbar Items
  goHome = this.linkTo("/");
  goToMyProfile = this.linkTo("/profile");
  goToMeasurements = this.linkTo("/measurements");
  goToUsers = this.linkTo("/users");
  goToSettings = this.linkTo("/settings");

  // display text
  getDisplayBar = () => {
    if (this.props.drawerOpen === false) {
      return { display: "block" };
    }
    return { display: "none" };
  };

  // Render navbar für admin or user
  renderNavbarContent = (props) => {
    let content;
    if (Auth.check_admin()) {
      content = (
        <div>
          <div class={this.state.versionClass}>
            <span>{Auth.version}</span>
          </div>

          <Drawer
            id={"navbar"}
            dismissible
            ref={this.props.drawerRef}
            class={style.navbar}
          >
            <Drawer.DrawerContent class={style.navbarContent}>
              <Drawer.DrawerItem
                class={style.navbarItem}
                selected={props.selectedRoute === "/measurements"}
                onClick={this.goToMeasurements}
              >
                <List.ItemGraphic class={style.navItemIcon}>
                  equalizer
                </List.ItemGraphic>
                <span style={this.getDisplayBar()} class={style.navItemLabel}>
                  Messungen
                </span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                class={style.navbarItem}
                selected={props.selectedRoute === "/users"}
                onClick={this.goToUsers}
              >
                <List.ItemGraphic class={style.navItemIcon}>
                  group
                </List.ItemGraphic>
                <span style={this.getDisplayBar()} class={style.navItemLabel}>
                  Benutzer
                </span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                class={style.navbarItem}
                selected={props.selectedRoute === "/profile"}
                onClick={this.goToMyProfile}
              >
                <List.ItemGraphic class={style.navItemIcon}>
                  account_circle
                </List.ItemGraphic>
                <span style={this.getDisplayBar()} class={style.navItemLabel}>
                  Profil
                </span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                class={style.navbarItem}
                selected={props.selectedRoute === "/settings"}
                onClick={this.goToSettings}
              >
                <List.ItemGraphic class={style.navItemIcon}>
                  build
                </List.ItemGraphic>
                <span style={this.getDisplayBar()} class={style.navItemLabel}>
                  Einstellungen
                </span>
              </Drawer.DrawerItem>
            </Drawer.DrawerContent>
          </Drawer>
        </div>
      );
    } else {
      content = (
        <div>
          <Drawer
            id={"navbar"}
            dismissible
            ref={this.props.drawerRef}
            class={style.navbar}
          >
            <Drawer.DrawerContent class={style.navbarContent}>
              <Drawer.DrawerItem
                class={style.navbarItem}
                selected={props.selectedRoute === "/measurements"}
                onClick={this.goToMeasurements}
              >
                <List.ItemGraphic class={style.navItemIcon}>
                  equalizer
                </List.ItemGraphic>
                <span style={this.getDisplayBar()} class={style.navItemLabel}>
                  Messungen
                </span>
              </Drawer.DrawerItem>
              <Drawer.DrawerItem
                class={style.navbarItem}
                selected={props.selectedRoute === "/profile"}
                onClick={this.goToMyProfile}
              >
                <List.ItemGraphic class={style.navItemIcon}>
                  account_circle
                </List.ItemGraphic>
                <span style={this.getDisplayBar()} class={style.navItemLabel}>
                  Profil
                </span>
              </Drawer.DrawerItem>
            </Drawer.DrawerContent>
          </Drawer>
        </div>
      );
    }

    return content;
  };

  render() {
    return this.renderNavbarContent(this.props);
  }
}
