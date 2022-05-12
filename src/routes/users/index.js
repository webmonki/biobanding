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
import EditUser from "../../components/dialogs/editUser";
import NewUser from "../../components/dialogs/newUser";
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";

export default class Users extends Component {
  componentWillMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  // API Request um User Daten zu laden
  getData = () => {
    let that = this;
    let url = Auth.url + "/api/users";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let response = JSON.parse(this.responseText);

        that.setState({ users: response["users:"] });
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

  // API Request um Benutzer Daten zu löschen
  delete = (id) => {
    let that = this;
    let url = Auth.url + "/api/user/" + id;
    let xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        //  Snackbar MSG
        that.bar.MDComponent.show({
          message: `Benutzer erfolgreich gelöscht`,
        });

        that.getData();
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

  // Öffne Edit Dialog und setze Werte
  showDialog = (id) => {
    document.addEventListener("keyup", this.handleKeyEdit);

    this.setState({ editId: id });

    this.state.users.forEach((user) => {
      if (user.userID === id) {
        this.setState({ editUsername: user.username });
        this.setState({ editEmail: user.email });
      }
    });
    this.editUserDialog.MDComponent.show();
  };

  // API Request um Benutzer Daten zu bearbeiten
  editData = () => {
    let that = this;

    let url = Auth.url + "/api/user/" + this.state.editId;
    let xhttp = new XMLHttpRequest();

    xhttp.open("PUT", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let newUserList = [];
        let editId = that.state.editId;

        // Update die lokale Benutzer Liste um Reload zu vermeiden
        that.state.users.forEach((user) => {
          if (user.userID !== editId) {
            newUserList.push(user);
          } else {
            user.username = that.state.editUsername;
            user.email = that.state.editEmail;
            newUserList.push(user);
          }
        });
        that.setState({ users: newUserList });

        // Schließe Dialog
        that.editUserDialog.MDComponent.close();

        // Snackbar MSG
        that.bar.MDComponent.show({
          message: "Benutzer erfolgreich geändert",
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

    let data = `{
			"username": "${this.state.editUsername}",
			"email": "${this.state.editEmail}"
		}`;

    xhttp.send(data);
  };

  // API Request um neuen Benutzer zu registrieren
  sendData = () => {
    let that = this;
    let url = Auth.url + "/api/users/register";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Snackbar MSG
        that.bar.MDComponent.show({
          message: "Benutzer erfolgreich angelegt",
        });

        // Neu Laden um aktuelle Daten zu haben
        that.getData();

        // Schließe Dialog
        that.newUserDialog.MDComponent.close();
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
            "username": "${this.state.username}",
            "email": "${this.state.email}",
            "password": "${this.state.password}",
			"is_admin": ${this.state.admin}
        }`;

    xhttp.send(data);
  };

  // Wird Dialog übergeben um Daten zurück zu erhalten
  getDataFromDialogForEdit = (username, email) => {
    this.setState({ editUsername: username });
    this.setState({ editEmail: email });

    this.editData();
  };

  // Wird Dialog übergeben um Daten zurück zu erhalten
  getDataFromDialogForNew = (username, email, password, admin) => {
    this.setState({ username });
    this.setState({ email });
    this.setState({ password });
    this.setState({ admin });

    this.sendData();
  };

  // Rendert die Dialoge zum Erstellen und Bearbeiten
  renderDialog = () => {
    let dialog = (
      <div>
        <EditUser
          reference={(editUserDialog) => {
            this.editUserDialog = editUserDialog;
          }}
          sendData={this.getDataFromDialogForEdit}
          username={this.state.editUsername}
          email={this.state.editEmail}
        />
        <NewUser
          reference={(newUserDialog) => {
            this.newUserDialog = newUserDialog;
          }}
          sendData={this.getDataFromDialogForNew}
        />
      </div>
    );
    return dialog;
  };

  showNewUserDialog = () => {
    this.newUserDialog.MDComponent.show();
  };

  // rendert die Tabelle
  showTable = (editable) => {
    let content = (
      <div>
        <Table
          editable={editable}
          data={this.state.users}
          pageSize={9}
          clickEdit={this.showDialog}
          delete={this.delete}
          showDialog={this.showNewUserDialog}
          idKey="userID"
          title="Benutzer"
        />
      </div>
    );
    return content;
  };

  render() {
    return (
      <div class={style.page}>
        <span class={style.pageHeader}>Benutzer</span>
        <Card class={style.card}>{this.showTable(true)}</Card>
        <div class={style.feedbackContainer}>
          <span class={this.state.responseFBClass}>
            {this.state.responseFB}
          </span>
        </div>
        <div class={style.mySnackbar}>
          <Snackbar
            ref={(bar) => {
              this.bar = bar;
            }}
          />
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}
