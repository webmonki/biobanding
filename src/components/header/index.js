import { h, Component } from "preact";
import { route } from "preact-router";
import TopAppBar from "preact-material-components/TopAppBar";
import Drawer from "preact-material-components/Drawer";
import List from "preact-material-components/List";
import Dialog from "preact-material-components/Dialog";
import Switch from "preact-material-components/Switch";
import "preact-material-components/Switch/style.css";
import "preact-material-components/Dialog/style.css";
import "preact-material-components/Drawer/style.css";
import "preact-material-components/List/style.css";
import "preact-material-components/TopAppBar/style.css";
import "preact-material-components/Theme/style.css";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import style from "./style";
import Auth from "../state";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Select from "preact-material-components/Select";
import "preact-material-components/Select/style.css";
import NewMeasurementAdmin from "../dialogs/newMeasurementAdmin";
import NewMeasurementUser from "../dialogs/newMeasurementUser";
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";

export default class Header extends Component {
  componentWillMount = () => {
    this.setState({ userIds: [] });
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  // Request to Log out user
  logOut = () => {
    let that = this;
    let url = Auth.url + "/api/users/logout";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if ([1, 2, 3, 4].includes(this.readyState)) {
        if (this.status === 200) {
          Auth.logout();
        } else {
          Auth.logout();
        }
      }
    };

    xhttp.send();
  };

  getPlayerDetails = () => {
    let that = this;
    let url = Auth.url + "/api/users/details";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);

        let idList = [];
        let usernameList = [];

        response["userdetails"].forEach((user) => {
          usernameList.push(user.username);
          idList.push(user.userID);
        });
        that.setState({ usernames: usernameList });
        that.setState({ userIds: idList });
        that.getDialog(idList);
      } else {
        try {
          let response = JSON.parse(this.responseText);
          if (response.msg == "Token is invalid") {
            Auth.logout();
            location.reload();
          }
        } catch (err) {}
      }
    };
    xhttp.send();
  };

  getDataFromDialog = (height, sittingHeight, span, weight, chosenIndex) => {
    this.setState({ height });
    this.setState({ sittingHeight });
    this.setState({ span });
    this.setState({ weight });
    this.setState({ chosenIndex });

    this.newMeasurementsDialog.MDComponent.close();

    this.sendMeasurement();
  };

  sendMeasurement = () => {
    let id;
    Auth.check_admin()
      ? (id = this.state.userIds[this.state.chosenIndex])
      : (id = Auth.getUser().id);

    let that = this;
    let url = Auth.url + "/api/user/" + id + "/anthropometric";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        that.sbar.MDComponent.show({
          message: "Messung erfolgreich gesendet",
        });
        that.props.setReload();
      } else {
        try {
          let response = JSON.parse(this.responseText);
          if (response.msg === "Token is invalid") {
            Auth.logout();
            location.reload();
          }
        } catch (err) {}
      }
    };

    let today = new Date();

    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    let data = `{
			"userID": ${id},
			"date_measured": "${date}",
			"height": ${this.state.height},
			"sitting_height": ${this.state.sittingHeight},
			"body_span": ${this.state.span},
			"weight": ${this.state.weight}
		}`;

    xhttp.send(data);
  };

  getDialog = (idList = []) => {
    let dialog;
    if (Auth.check_admin()) {
      dialog = (
        <NewMeasurementAdmin
          reference={(newMeasurementsDialog) => {
            this.newMeasurementsDialog = newMeasurementsDialog;
          }}
          userIds={idList}
          usernames={this.state.usernames}
          sendData={this.getDataFromDialog}
          header="Messung erstellen"
          subHeader="Anthropometrische Daten"
        />
      );
    } else {
      dialog = (
        <NewMeasurementUser
          reference={(newMeasurementsDialog) => {
            this.newMeasurementsDialog = newMeasurementsDialog;
          }}
          sendData={this.getDataFromDialog}
          header="Messung erstellen"
          subHeader="Anthropometrische Daten"
        />
      );
    }

    this.setState({ dialog });
  };

  render() {
    if (this.state.dialog === undefined) {
      this.getPlayerDetails();
    }
    return (
      <div class={`${"mdc-theme--primary-bg"} ${style.topAppBar}`}>
        <i
          class={style.menuIcon}
          aria-hidden="true"
          onClick={this.props.toggleNavbar}
        >
          menu
        </i>
        <div class={style.btnContainer}>
          <Button class={style.secondaryBtn} onClick={this.logOut}>
            Abmelden
          </Button>
          <Button
            raised
            class={`${"mdc-button mdc-theme--secondary-bg"} ${style.roundBtn}`}
            onClick={() => {
              this.newMeasurementsDialog.MDComponent.show();
            }}
          >
            <i
              class="material-icons mdc-button__icon mdc-theme--text-secondary-on-light"
              aria-hidden="true"
            >
              add
            </i>
            <span class="mdc-button__label mdc-theme--text-secondary-on-light">
              Messung
            </span>
          </Button>
        </div>
        <div class={style.mySnackbar}>
          <Snackbar
            ref={(sbar) => {
              this.sbar = sbar;
            }}
          />
        </div>
        {this.state.dialog}
      </div>
    );
  }
}
