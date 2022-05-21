import { h, Component } from "preact";
import Card from "preact-material-components/Card";
import "preact-material-components/Card/style.css";
import "preact-material-components/Button/style.css";
import style from "./style";
import Auth from "../../components/state";
import "preact-material-components/Dialog/style.css";
import "preact-material-components/TextField/style.css";
import "preact-material-components/List/style.css";
import "preact-material-components/Drawer/style.css";
import Table from "../../components/table";
import NewMeasurementAdmin from "../../components/dialogs/newMeasurementAdmin";
import NewMeasurementUser from "../../components/dialogs/newMeasurementUser";
import Chips from "preact-material-components/Chips";
import "preact-material-components/Chips/style.css";
import "preact-material-components/Theme/style.css";

export default class Measurements extends Component {
  componentWillMount = () => {
    // Load Users and Overview to Fill Table and Create Dialog
    this.loadData();

    // User Dialog can be created without additional data
    if (Auth.check_admin() === false) {
      this.getDialog();
    }
  };

  // If topappbar creates a new measurment, props.reload will be set to true
  // and this tells measurement view to reload its data
  componentDidUpdate = () => {
    if (this.props.reload) {
      this.loadData();

      // this.props.reload will be set to false
      this.props.unsetReload();
    }
  };

  // Admin loads Overview und Users
  // User loads Measurements
  loadData = () => {
    if (Auth.check_admin()) {
      this.getOverview();
      this.getUsers();
    } else {
      this.getMeasurements();
    }
  };

  openDialog = () => {
    this.newMeasurementsDialog.MDComponent.show();
  };

  // Creates table determined if user is admin or not
  // ToDO: User darf keine Messungen löschen
  showTable = (editable) => {
    let data = this.state.measurements;
    let content;
    if (Auth.check_admin()) {
      content = (
        <Table
          deletable={Auth.check_admin()}
          editable={editable}
          data={data}
          pageSize={9}
          clickEdit={this.showDialog}
          delete={this.delete}
          showDialog={this.openDialog}
          idKey="Id"
          title="Messungen"
          subTableTitle="Ergebnisse"
        />
      );
    } else {
      content = (
        <Table
          deletable={Auth.check_admin()}
          editable={editable}
          data={data}
          pageSize={9}
          clickEdit={this.showDialog}
          delete={this.delete}
          showDialog={this.openDialog}
          idKey="Id"
          title="Messungen"
          subTableTitle="Ergebnisse"
        />
      );
    }

    this.setState({ content });
  };

  // Api request for User Data. Will be loaded so that admin user can choose for which user he wants to create a new measurement
  getUsers = () => {
    let that = this;
    let url = Auth.url + "/api/users";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let response = JSON.parse(this.responseText);

        let idList = [];
        let usernameList = [];

        response["users:"].forEach((user) => {
          usernameList.push(user.Benutzername);
          idList.push(user.userID);
        });

        // Will be displayed in dropdown
        that.setState({ usernames: usernameList });

        // Will be used in sendMeasurement
        that.setState({ userIds: idList });
        that.getDialog();
      } else {
        if (this.status !== 200) {
          that.props.showSnackbar("Fehler beim Laden der Benutzerdaten", true);
        }
        try {
          let response = JSON.parse(this.responseText);

          if (response.msg === "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };
    xhttp.send();
  };

  // API Request to edit measurements
  editData = () => {
    let that = this;
    let url = Auth.url + "/api/measurement/" + this.state.editId;
    let xhttp = new XMLHttpRequest();

    xhttp.open("PUT", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    let today = new Date();

    let month = "";

    if (today.getMonth() + 1 < 10) {
      month = "0" + (today.getMonth() + 1);
    } else {
      month = today.getMonth() + 1;
    }

    let day = "";
    if (today.getDate() < 10) {
      day = "0" + today.getDate();
    } else {
      day = today.getDate();
    }

    let date = today.getFullYear() + "-" + month + "-" + day;

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Snackbar MSG
        that.props.showSnackbar("Messung erfolgreich geändert");

        // reload data to get changes
        that.loadData();

        // close dialog
        that.measurementsEditDialog.MDComponent.close();

        // rerender table
        that.showTable(true);
      } else {
        if (this.status !== 200) {
          that.props.showSnackbar("Fehler beim Bearbeiten", true);
        }
        try {
          let response = JSON.parse(this.responseText);
          if (response.msg === "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };

    let data = `{
			"date_measured": "${date}",
			"height": ${this.state.height},
			"sitting_height": ${this.state.sittingHeight},
			"body_span": ${this.state.span},
			"weight": ${this.state.weight}
		}`;

    xhttp.send(data);
  };

  // converts date string to date object
  convertDate = (measurements) => {
    measurements.forEach((measurement) => {
      measurement.Datum = measurement.Datum.replace('"', "");
      measurement.Datum = measurement.Datum.replace('"', "");

      let parts = measurement.Datum.split("-");

      let newDate = new Date(parts[0], parts[1] - 1, parts[2]);

      measurement.Datum = newDate;
    });
    return measurements;
  };

  // API Request measurements overview of all users
  getOverview = () => {
    let that = this;
    let url = Auth.url + "/api/measurements";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let response = JSON.parse(this.responseText);

        that.setState({
          measurements: that.convertDate(response.measurements),
        });

        that.props.showSnackbar("Messungen erfolgreich geladen");
        that.showTable(true);
      } else {
        if (this.status !== 200) {
          that.props.showSnackbar(
            "Messungen konnten nicht geladen werden",
            true
          );
        }
        try {
          let response = JSON.parse(this.responseText);
          if (response.msg === "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };
    xhttp.send();
  };

  // API Request to get last measurement of every user
  getMeasurementsLast = () => {
    let that = this;
    let url = Auth.url + "/api/measurements/last";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let response = JSON.parse(this.responseText);

        that.setState({
          measurements: that.convertDate(response.measurements),
        });

        that.props.showSnackbar("Messungen erfolgreich geladen");
        that.showTable(true);
      } else {
        try {
          if (this.status !== 200) {
            that.props.showSnackbar(
              "Messungen konnten nicht geladen werden",
              true
            );
          }

          let response = JSON.parse(this.responseText);
          if (response.msg === "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };
    xhttp.send();
  };

  // API Request all measurements of a user
  getMeasurements = () => {
    let that = this;
    let url = Auth.url + "/api/user/" + Auth.getUser().id + "/anthropometric";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let response = JSON.parse(this.responseText);

        that.setState({
          measurements: that.convertDate(response["measurements:"]),
        });
        that.props.showSnackbar("Messungen erfolgreich geladen");

        that.showTable(true);
      } else {
        if (this.status !== 200) {
          that.props.showSnackbar(
            "Messungen konnten nicht geladen werden",
            true
          );
        }

        try {
          let response = JSON.parse(this.responseText);
          if (response.msg === "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };
    xhttp.send();
  };

  // API Request to delete a measurement. will be triggered in table
  delete = (id) => {
    let that = this;
    let url = Auth.url + "/api/measurement/" + id;
    let xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Snackbar MSG
        that.props.showSnackbar("Messung erfolgreich gelöscht");

        // reload data to get changes
        that.loadData();

        // rerender table
        that.showTable(true);
      } else {
        try {
          if (this.status !== 200) {
            that.props.showSnackbar("Fehler beim Löschen", true);
          }
          let response = JSON.parse(this.responseText);
          if (response.msg === "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };

    xhttp.send();
  };

  // Api Request to create new measurement
  sendMeasurement = () => {
    let id;

    // If user is admin, take the id from the user-id-list which was choosen via dropdown in dialog
    // If user is not admin, take his user id
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
        // reload data to get changes
        that.loadData();

        // close dialog
        that.newMeasurementsDialog.MDComponent.close();

        // Snackbar MSG
        that.props.showSnackbar("Messung erfolgreich angelegt");
      } else {
        if (this.status !== 200) {
          that.props.showSnackbar("Fehler beim Anlegen", true);
        }
        try {
          let response = JSON.parse(this.responseText);
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

  // open dialog for editing of a measurement, and give the dialog its current values
  showDialog = (id) => {
    this.setState({ editId: id });

    this.state.measurements.forEach((measurement) => {
      if (measurement.Id === id) {
        this.setState({ height: measurement.Größe });
        this.setState({ sittingHeight: measurement.Sitzgröße });
        this.setState({ span: measurement.Körperspanne });
        this.setState({ weight: measurement.Gewicht });
      }
    });

    this.getDialog();

    this.measurementsEditDialog.MDComponent.show();
  };

  // Given to dialog to return its values
  getDataFromDialogforNew = (
    height,
    sittingHeight,
    span,
    weight,
    chosenIndex
  ) => {
    this.setState({ height });
    this.setState({ sittingHeight });
    this.setState({ span });
    this.setState({ weight });
    this.setState({ chosenIndex });

    this.sendMeasurement();
  };

  // Given to dialog to return its values
  getDataFromDialogForEdit = (
    height,
    sittingHeight,
    span,
    weight,
    chosenIndex
  ) => {
    this.setState({ height });
    this.setState({ sittingHeight });
    this.setState({ span });
    this.setState({ weight });
    this.setState({ chosenIndex });

    this.editData();
  };

  // und den Dialog zum Bearbeiten von Messungen
  // Creates edit dialog and new measurements dialog with dropdown or without, determined by if user is admin
  getDialog = () => {
    let dialog;

    if (Auth.check_admin()) {
      dialog = (
        <NewMeasurementAdmin
          reference={(newMeasurementsDialog) => {
            this.newMeasurementsDialog = newMeasurementsDialog;
          }}
          userIds={this.state.userIds}
          usernames={this.state.usernames}
          sendData={this.getDataFromDialogforNew}
          header="Neue Messung erstellen"
          subHeader="Anthropometrische Daten"
        />
      );
    } else {
      dialog = (
        <NewMeasurementUser
          reference={(newMeasurementsDialog) => {
            this.newMeasurementsDialog = newMeasurementsDialog;
          }}
          sendData={this.getDataFromDialogforNew}
          header="Neue Messung erstellen"
          subHeader="Anthropometrische Daten"
        />
      );
    }

    let editDialog = (
      <NewMeasurementUser
        reference={(measurementsEditDialog) => {
          this.measurementsEditDialog = measurementsEditDialog;
        }}
        sendData={this.getDataFromDialogForEdit}
        header="Messung bearbeiten"
        subHeader="Anthropometrische Daten"
        formValues={{
          height: this.state.height,
          sittingHeight: this.state.sittingHeight,
          span: this.state.span,
          weight: this.state.weight,
        }}
      />
    );

    this.setState({ dialog });
    this.setState({ editDialog });
  };

  handleChipClick = () => {
    let chipIcon = document.getElementById("chipIcon");
    let chip = document.getElementById("chip");

    if (chipIcon.style.display === "none" || chipIcon.style.display === "") {
      this.getMeasurementsLast();
      chipIcon.style.display = "block";
      chip.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    } else if (chipIcon.style.display === "block") {
      this.getOverview();
      chipIcon.style.display = "none";
      chip.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    }
  };

  getChip = () => {
    if (this.state.measurements !== undefined) {
      if (!Auth.check_admin() || this.state.measurements.length === 0) {
        return undefined;
      }

      return (
        <Chips class={style.chip}>
          <Chips.Chip onClick={this.handleChipClick} id="chip">
            <Chips.Text>
              <div class={style.chipContainer}>
                <i
                  id="chipIcon"
                  class={`${"material-icons"} ${style.chipIcon}`}
                >
                  check
                </i>
                <span class={style.chipText}>Letzte Messungen</span>
              </div>
            </Chips.Text>
          </Chips.Chip>
        </Chips>
      );
    }
  };

  render() {
    return (
      <div class={style.page}>
        <span class={style.pageHeader}>Messungen</span>
        {this.getChip()}
        <Card class={style.card}>{this.state.content}</Card>
        {this.state.dialog}
        {this.state.editDialog}
      </div>
    );
  }
}
