import { h, Component } from "preact";

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
import "preact-material-components/TextField/style.css";
import "preact-material-components/Select/style.css";
import NewMeasurementAdmin from "../dialogs/newMeasurementAdmin";
import NewMeasurementUser from "../dialogs/newMeasurementUser";
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";

export default class Header extends Component {
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

  // Playerdetails werden geladen damit im Dialog die Dropdown List gefüllt werden kann
  getPlayerDetails = () => {
    let that = this;
    let url = Auth.url + "/api/users/details";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let response = JSON.parse(this.responseText);

        let idList = [];
        let usernameList = [];

        response.userdetails.forEach((user) => {
          usernameList.push(user.username);
          idList.push(user.userID);
        });
        that.setState({ usernames: usernameList });
        that.setState({ userIds: idList });

        // Generiert den Dialog zum Erstellen einer neuen Messung
        that.getDialog(idList);
      } else {
        try {
          let response = JSON.parse(this.responseText);
          if (response.msg == "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };
    xhttp.send();
  };

  // Wird Dialog übergeben damit man die Daten zurück erhält
  getDataFromDialog = (height, sittingHeight, span, weight, chosenIndex) => {
    this.setState({ height });
    this.setState({ sittingHeight });
    this.setState({ span });
    this.setState({ weight });
    this.setState({ chosenIndex });

    this.newMeasurementsDialog.MDComponent.close();

    this.sendMeasurement();
  };

  // Neue Messung erstellen
  sendMeasurement = () => {
    let id;

    // UserID: Admin kann auswählen, User kriegt seine
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
        // Snackbar
        that.sbar.MDComponent.show({
          message: "Messung erfolgreich gesendet",
        });

        // Um Measurements zu sagen, die Daten zu updaten
        that.props.setReload();
      } else {
        try {
          let response = JSON.parse(this.responseText);

          // Wenn Token abgelaufen log out
          if (response.msg === "Token is invalid") {
            Auth.logout();
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

  // Zwei Dialoge können erzeigt werden. Für admin oder user
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
    // Initiales Laden der Spielerdetails um Dialoge zu erzeugen
    if (this.state.dialog === undefined) {
      this.getPlayerDetails();
    }

    return (
      <div class={`${"mdc-theme--primary-bg"} ${style.topAppBar}`}>
        {/* MenuIcon */}
        <i
          class={style.menuIcon}
          aria-hidden="true"
          onClick={this.props.toggleNavbar}
        >
          menu
        </i>
        <div class={style.btnContainer}>
          {/* AbmeldeButton */}
          <Button class={style.secondaryBtn} onClick={this.logOut}>
            Abmelden
          </Button>

          {/* Neue Messung erzeugen Button */}
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

        {/* Snackbar */}
        <div class={style.mySnackbar}>
          <Snackbar
            ref={(sbar) => {
              this.sbar = sbar;
            }}
          />
        </div>
        {/* Dialog */}
        {this.state.dialog}
      </div>
    );
  }
}
