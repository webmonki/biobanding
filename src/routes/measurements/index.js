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
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";

export default class Measurements extends Component {
  componentWillMount = () => {
    // Load Users and Overview to Fill Table and Create Dialog
    this.loadData();

    // User Dialog kann ohne zusätzliche Daten erstellt werden
    if (Auth.check_admin() === false) {
      this.getDialog();
    }
  };

  // Wenn die TopAppbar eine Messung erstellt wird props.reload auf true gesetzt
  // und sagt so dem measurements View, dass er updaten soll
  componentDidUpdate = () => {
    if (this.props.reload) {
      this.loadData();

      // this.props.reload wird wieder auf false gesetzt
      this.props.unsetReload();
    }
  };

  // Admin lädt Overview und Users
  // User lädt Measurements
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

  // Erstellt Tabelle abhängig davon ob der User admin ist
  // ToDO: User darf keine Messungen löschen
  showTable = (editable) => {
    let data = this.state.measurements;
    let content;
    if (Auth.check_admin()) {
      content = (
        <Table
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
          editable={editable}
          data={data}
          pageSize={9}
          clickEdit={this.showDialog}
          delete={this.delete}
          showDialog={this.openDialog}
          idKey="id"
          title="Messungen"
          subTableTitle="Ergebnisse"
        />
      );
    }

    this.setState({ content });
  };

  // Api request für User Daten. Wird geladen damit der Admin auswählen kann für welchen user er eine neue Messung erstellen will
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

        // Wird in DropDown angezeigt
        that.setState({ usernames: usernameList });

        // Um in sendMeasurements übergeben zu werden
        that.setState({ userIds: idList });
        that.getDialog();
      } else {
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

  // API Request um Messungen zu bearbeiten
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
        that.bar.MDComponent.show({
          message: `Messung ${that.state.editId} erfolgreich geändert`,
        });

        // Daten neu Laden um Änderungen zu bekommen
        that.loadData();

        // Dialog schlließen
        that.measurementsEditDialog.MDComponent.close();

        // Tabelle neu erzeugen
        that.showTable(true);
      } else {
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

  // String aus den geladenen Daten in Date object umwandeln
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

  // API Request Messungsübersicht alle User
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
        that.showTable(true);
      } else {
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

  // API Request Messungen eines Users
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
        that.showTable(true);
      } else {
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

  // API Request um Messung zu löschen. Wird in Tabelle aufgerufen
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
        that.bar.MDComponent.show({
          message: `Messung ${id} erfolgreich gelöscht`,
        });

        // Daten neu Laden um Änderungen zu erhalten
        that.loadData();

        // Tabelle neu rendern
        that.showTable(true);
      } else {
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

  // Api Request um neue Messung anzulegen
  sendMeasurement = () => {
    let id;

    // Wenn Admin nimm id aus userIDs an der Stelle choosenIndex, welche aus dropdown kommt
    // Wenn User nimm seine UserID
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
        // Daten neu Laden um Änderung zu erhalten
        that.loadData();

        // Dialog schließen
        that.newMeasurementsDialog.MDComponent.close();

        // Snackbar MSG
        that.bar.MDComponent.show({
          message: `Messung erfolgreich angelegt`,
        });
      } else {
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

  // Öffnet den Dialog zum Bearbeiten einer Messung mit den Aktuellen Werten
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

  // Wird Dialog für Neue Messungen übergeben um Werte zurück zu erhalten
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

  // Wird Dialog für Bearbeitung einer Messung übergeben um Werte zurück zu erhalten
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

  // Erzeugt die Dialoge zum Neue Messungen erstellen abhängig davon on User admin ist oder nicht
  // und den Dialog zum Bearbeiten von Messungen
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

  render() {
    return (
      <div class={style.page}>
        <span class={style.pageHeader}>Messungen</span>
        <Card class={style.card}>{this.state.content}</Card>
        <div class={style.mySnackbar}>
          <Snackbar
            ref={(bar) => {
              this.bar = bar;
            }}
          />
        </div>
        {this.state.dialog}
        {this.state.editDialog}
      </div>
    );
  }
}
