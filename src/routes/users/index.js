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
import { getRegistrationCode } from "../../components/reguests/requests";
export default class Users extends Component {
  componentWillMount = () => {
    this.getData();
    Auth.setRegisCode(getRegistrationCode());
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  // API Request to load user data
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

  // API Request to delete user data
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
        that.props.showSnackbar("Benutzer erfolgreich gelöscht");

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

  // open edit dialog and set values for textfields
  showDialog = (id) => {
    document.addEventListener("keyup", this.handleKeyEdit);

    this.setState({ editId: id });

    this.state.users.forEach((user) => {
      if (user.userID === id) {
        this.setState({ editUsername: user.Benutzername });
        this.setState({ editEmail: user["E-Mail"] });
      }
    });
    this.editUserDialog.MDComponent.show();
  };

  // API Request to edit user data
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

        // update local user list to prevent reload
        that.state.users.forEach((user) => {
          if (user.userID !== editId) {
            newUserList.push(user);
          } else {
            user.Benutzername = that.state.editUsername;
            user["E-Mail"] = that.state.editEmail;
            newUserList.push(user);
          }
        });
        that.setState({ users: newUserList });

        // close dialog
        that.editUserDialog.MDComponent.close();

        // Snackbar MSG
        that.props.showSnackbar("Benutzer erfolgreich geändert");
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

  // API Request to create new user
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
        that.props.showSnackbar("Benutzer erfolgreich angelegt");

        // reload to get updated data
        that.getData();

        // close dialog
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
			"registration_code": ${Auth.getRegisCode()},
			"is_admin": ${this.state.admin}
        }`;

    xhttp.send(data);
  };

  // will be given to dialog to return its values from the textfields
  getDataFromDialogForEdit = (username, email) => {
    this.setState({ editUsername: username });
    this.setState({ editEmail: email });

    this.editData();
  };

  // will be given to dialog to return its values from the textfields
  getDataFromDialogForNew = (username, email, password, admin) => {
    this.setState({ username });
    this.setState({ email });
    this.setState({ password });
    this.setState({ admin });

    this.sendData();
  };

  // create the dialogs for creating and editing
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

  // rendert table
  showTable = (editable) => {
    let users = this.state.users;

    if (users !== undefined) {
      users[0].is_admin = true;
      users[1].is_admin = false;

      let content = (
        <div>
          <Table
            deletable
            editable={editable}
            data={users}
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
    }
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
        {this.renderDialog()}
      </div>
    );
  }
}
