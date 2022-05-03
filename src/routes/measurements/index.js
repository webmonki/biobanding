import { h, Component } from "preact";
import Card from "preact-material-components/Card";
import "preact-material-components/Card/style.css";
import "preact-material-components/Button/style.css";
import style from "./style";
import Navbar from "../../components/navbar/navbar";
import Auth from "../../components/state";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import Dialog from "preact-material-components/Dialog";
import "preact-material-components/Dialog/style.css";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import "preact-material-components/List/style.css";
import List from "preact-material-components/List";
import Drawer from "preact-material-components/Drawer";
import "preact-material-components/Drawer/style.css";
import Table from "../../components/table";
import NewMeasurementAdmin from "../../components/dialogs/newMeasurementAdmin";
import NewMeasurementUser from "../../components/dialogs/newMeasurementUser";
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";

export default class Measurements extends Component {
  componentWillMount = () => {
    this.setState({ pageClass: style.pageSmall });

    this.loadData();

    if (Auth.check_admin() == false) {
      this.getDialog();
    }
  };

  loadData = () => {
    if (Auth.check_admin()) {
      this.getOverview();
      this.getUsers();
    } else {
      this.getMeasurements();
    }
  };

  fitPageSize = (large) => {
    large
      ? this.setState({ pageClass: style.pageLarge })
      : this.setState({ pageClass: style.pageSmall });
  };

  openDialog = () => {
    this.newMeasurementsDialog.MDComponent.show();
  };

  showTable = (editable) => {
    let data = this.state.measurements;
    let content;
    if (Auth.check_admin()) {
      content = (
        <div>
          <Table
            editable={editable}
            data={data}
            pageSize={10}
            clickEdit={this.showDialog}
            delete={this.delete}
            showDialog={this.openDialog}
            idKey="Id"
            title="Messungen"
          />
        </div>
      );
    } else {
      content = (
        <div>
          <Table
            editable={editable}
            data={data}
            pageSize={10}
            clickEdit={this.showDialog}
            delete={this.delete}
            showDialog={this.openDialog}
            idKey="Id"
            title="Messungen"
          />
        </div>
      );
    }

    this.setState({ content });
  };

  getUsers = () => {
    let that = this;
    let url = Auth.url + "/api/users";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        // that.setState({ responseFBClass : style.feedbackSucc });
        // that.setState({ responseFB : 'Benutzer erfolgreich geladen' });
        let idList = [];
        let usernameList = [];
        response["users:"].forEach((user) => {
          usernameList.push(user.Benutzername);
          idList.push(user.userID);
        });
        that.setState({ usernames: usernameList });
        that.setState({ userIds: idList });
        that.getDialog();
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
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        // that.setState({ responseFBClass : style.feedbackSucc });
        // that.setState({ responseFB : 'Messung erfolgreich geändert' });
        that.bar.MDComponent.show({
          message: `Messung ${that.state.editId} erfolgreich geändert`,
        });
        that.loadData();
        that.measurementsEditDialog.MDComponent.close();
        that.showTable(true);
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

    let data = `{
			"date_measured": "${date}",
			"height": ${this.state.height},
			"sitting_height": ${this.state.sittingHeight},
			"body_span": ${this.state.span},
			"weight": ${this.state.weight}
		}`;

    xhttp.send(data);
  };

  getOverview = () => {
    let that = this;
    let url = Auth.url + "/api/measurements";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        // that.setState({ responseFBClass : style.feedbackSucc });
        // that.setState({ responseFB : 'Übersicht erfolgreich geladen' });
        that.setState({ measurements: response.measurements });
        that.showTable(true);
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

  getMeasurements = () => {
    let that = this;
    let url = Auth.url + "/api/user/" + Auth.getUser().id + "/anthropometric";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        // that.setState({ responseFBClass : style.feedbackSucc });
        // that.setState({ responseFB : 'Messungen erfolgreich geladen' });
        that.setState({ measurements: response["measurements:"] });
        that.showTable(true);
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

  delete = (id) => {
    let that = this;
    let url = Auth.url + "/api/measurement/" + id;
    let xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        // that.setState({ responseFBClass : style.feedbackSucc });
        // that.setState({ responseFB : 'Messung erfolgreich gelöscht' });
        that.bar.MDComponent.show({
          message: `Messung ${id} erfolgreich gelöscht`,
        });

        that.loadData();
        that.showTable(true);
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
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        that.loadData();
        that.newMeasurementsDialog.MDComponent.close();
        that.bar.MDComponent.show({
          message: `Messung erfolgreich angelegt`,
        });
      } else {
        let response = JSON.parse(this.responseText);
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

  checkDelete = () => {
    let checkboxes = document.getElementsByName("deleteCheck");

    checkboxes.forEach((cb) => {
      if (cb.checked) {
        this.delete(cb.value);
      }
    });
  };

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
      <div class={this.state.pageClass}>
        <Navbar selectedRoute="/measurements" fitPageSize={this.fitPageSize} />
        <span class={style.pageHeader}>Messungen</span>
        {/* <div class={style.btnContainer}>
					<Button class={style.deleteBtn} onClick={this.checkDelete}>
						<List.ItemGraphic class={`${"mdc-theme--primary"} ${style.deleteIcon}`}>delete</List.ItemGraphic>
					</Button>
					<Button raised class={`${"mdc-button mdc-theme--primary-bg"} ${style.roundBtn}`} onClick={() => {
						this.newMeasurementsDialog.MDComponent.show();
					}}>
						<i class="material-icons mdc-button__icon mdc-theme-on-primary" aria-hidden="true">add</i>
						<span class="mdc-button__label mdc-theme-on-primary">erstellen</span>
					</Button>
				</div> */}
        <Card class={style.card}>{this.state.content}</Card>
        {/* <div class={style.feedbackContainer}>
					<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
				</div> */}
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
