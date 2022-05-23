import { h, Component } from "preact";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import style from "./style";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Radio from "preact-material-components/Radio";
import Auth from "../../components/state";
import "preact-material-components/List/style.css";
import "preact-material-components/Radio/style.css";

export default class Profile extends Component {
  componentWillMount = () => {
    this.setState({ username: Auth.getUser().name });
    this.setState({ email: Auth.getUser().email });
    this.getDetails();
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleKey);
  };

  handleKey = (event) => {
    if (event.code === "Enter") {
      this.sendData();
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  // API Request to update username and email
  sendNewLogin = () => {
    let that = this;
    let url = Auth.url + "/api/users/edit";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Snackbar MSG
        that.props.showSnackbar("Login-Daten erfolgreich geändert");

        // Email und Username in Auth setzen
        Auth.setEmail(that.state.email);
        Auth.setUsername(that.state.username);
      } else {
        if (this.status !== 200) {
          this.props.showSnackbar("Fehler beim Ändern", true);
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
			"userID": "${Auth.getUser().id}",
			"username": "${this.state.username}",
			"email": "${this.state.email}"
		}`;

    xhttp.send(data);
  };

  // send email and username if one has changed
  sendData = () => {
    if (
      this.state.username !== Auth.getUser().name ||
      this.state.email !== Auth.getUser().email
    ) {
      this.sendNewLogin();
    }

    // Will always be send
    this.sendPlayerDetails();
  };

  // API Request to get playerdetails
  getDetails = () => {
    let that = this;
    let url = Auth.url + "/api/user/" + Auth.getUser().id + "/details";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let response;

        try {
          response = JSON.parse(this.responseText);
        } catch (err) {}

        that.props.showSnackbar("Profil erfolgreich geladen");

        // Set vaues in states to display them in textfields
        that.setState({ firstname: response["player_details:"].first_name });
        that.setState({ lastname: response["player_details:"].last_name });
        that.setState({
          fatherHeight: response["player_details:"].height_father,
        });
        that.setState({
          motherHeight: response["player_details:"].height_mother,
        });

        let date = response["player_details:"].birthday;

        if (date !== undefined) {
          date = date.replace('"', "");
          date = date.replace('"', "");

          that.setState({ birthday: date });
        }

        let sex = response["player_details:"].sex_m_0_f_1;

        if (sex === 0) {
          document.getElementById("radioMale").checked = true;
        } else if (sex === 1) {
          document.getElementById("radioFemale").checked = true;
        }

        that.handleRadioChange();
      } else {
        if (this.status !== 200 && this.status !== 404) {
          this.props.showSnackbar("Fehler beim Ändern", true);
        }
        if (this.status === 404) {
          that.props.showSnackbar("Kein Profil gefunden", true);
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

  // API Request to update playerdetails
  sendPlayerDetails = () => {
    let that = this;
    let url = Auth.url + "/api/user/" + Auth.getUser().id + "/details";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Snackbar MSG
        that.props.showSnackbar("Spielerdetails erfolgreich angelegt");
      } else {
        try {
          if (this.status !== 200) {
            this.props.showSnackbar("Fehler beim Anlegen", true);
          }
          let response = JSON.parse(this.responseText);
          if (response.msg === "Token is invalid") {
            Auth.logout();
          }
        } catch (err) {}
      }
    };

    switch (this.state.sex) {
      case "male":
        this.sex = 0;
        break;
      case "female":
        this.sex = 1;
        break;
      default:
        break;
    }

    let data = `{
            "userID": ${Auth.getUser().id},
            "first_name": "${this.state.firstname}",
			"last_name": "${this.state.lastname}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex},
			"height_father": ${this.state.fatherHeight},
			"height_mother": ${this.state.motherHeight}
        }`;

    xhttp.send(data);
  };

  handleRadioChange = () => {
    let male = document.getElementById("radioMale").checked;
    let female = document.getElementById("radioFemale").checked;

    if (male && !female) {
      this.setState({ sex: "male" });
    } else if (!male && female) {
      this.setState({ sex: "female" });
    } else {
      this.setState({ sex: "" });
    }
  };

  // Render Profil View with validation in textfields
  render() {
    return (
      <div class={style.page}>
        <span class={style.pageHeader}>Profil</span>
        <div class={style.profileContainer}>
          <div class={style.headerContainer}>
            <span class={style.header}>Benutzerdaten</span>
            <span class={style.subHeader}>
              Diese Daten werden für die Anmeldung benötigt
            </span>
          </div>
          <div class={style.row}>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                class={style.fullWidth}
                label="Benutzername"
                value={this.state.username}
                onInput={(e) => {
                  this.setState({ username: e.target.value });
                  let val = e.target.value;
                  if (val.length < 1) {
                    this.setState({ usernameFBClass: style.feedbackErr });
                    this.setState({ usernameFB: "Mindestens 1 Zeichen" });
                  }
                  if (val.length > 32) {
                    this.setState({ usernameFBClass: style.feedbackErr });
                    this.setState({ usernameFB: "Maximal 32 Zeichen" });
                  }
                  if (val.length > 0 && val.length < 33) {
                    this.setState({ usernameFBClass: style.feedbackSucc });
                    this.setState({ usernameFB: "" });
                  }
                }}
              />
              <span class={this.state.usernameFBClass}>
                {this.state.usernameFB}
              </span>
            </div>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                class={style.fullWidth}
                label="E-Mail"
                value={this.state.email}
                onInput={(e) => {
                  this.setState({ email: e.target.value });
                  let val = e.target.value;
                  if (
                    val.match(
                      /^([\wäöüÜÖÄß])+(([\.]{0,1}[\wäöüÜÖÄß])?)*(([\+]{0,1}[\wäöüÜÖÄß])?)*([\wäöüÜÖÄß-])*\@([\wäöüÜÖÄß-]+\.)+([\w]{2,})+$/
                    )
                  ) {
                    this.setState({ emailFBClass: style.feedbackSucc });
                    this.setState({ emailFB: "" });
                  } else {
                    this.setState({ emailFBClass: style.feedbackErr });
                    this.setState({ emailFB: "keine E-Mail" });
                  }
                }}
              />
              <span class={this.state.emailFBClass}>{this.state.emailFB}</span>
            </div>
          </div>
          <div class={style.headerContainer}>
            <span class={style.header}>Persönliche Daten</span>
            <span class={style.subHeader}>
              Diese Daten werden für eine bessere Zuordnung der Messungen
              benötigt
            </span>
          </div>
          <div class={style.row}>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                class={style.fullWidth}
                label="Vorname"
                value={this.state.firstname}
                onInput={(e) => {
                  this.setState({ firstname: e.target.value });
                  let val = e.target.value;
                  if (val.length < 2) {
                    this.setState({ firstnameFBClass: style.feedbackErr });
                    this.setState({ firstnameFB: "Mindestens 2 Zeichen" });
                  }
                  if (val.length > 32) {
                    this.setState({ firstnameFBClass: style.feedbackErr });
                    this.setState({ firstnameFB: "Maximal 32 Zeichen" });
                  }
                  if (val.length > 1 && val.length < 33) {
                    this.setState({ firstnameFBClass: style.feedbackSucc });
                    this.setState({ firstnameFB: "" });
                  }
                }}
              />
              <span class={this.state.firstnameFBClass}>
                {this.state.firstnameFB}
              </span>
            </div>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                class={style.fullWidth}
                label="Nachname"
                value={this.state.lastname}
                onInput={(e) => {
                  this.setState({ lastname: e.target.value });
                  let val = e.target.value;
                  if (val.length < 4) {
                    this.setState({ lastnameFBClass: style.feedbackErr });
                    this.setState({ lastnameFB: "Mindestens 4 Zeichen" });
                  }
                  if (val.length > 64) {
                    this.setState({ lastnameFBClass: style.feedbackErr });
                    this.setState({ lastnameFB: "Maximal 64 Zeichen" });
                  }
                  if (val.length > 3 && val.length < 65) {
                    this.setState({ lastnameFBClass: style.feedbackSucc });
                    this.setState({ lastnameFB: "" });
                  }
                }}
              />
              <span class={this.state.lastnameFBClass}>
                {this.state.lastnameFB}
              </span>
            </div>
          </div>
          <div class={style.row}>
            <div class={style.dateContainer}>
              <TextField
                class={style.fullWidth}
                type="date"
                value={this.state.birthday}
                onInput={(e) => {
                  let birthday = e.target.value;
                  let today = new Date();
                  let dd = String(today.getDate()).padStart(2, "0");
                  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
                  let yyyy = today.getFullYear();

                  today = mm + "-" + dd + "-" + yyyy;

                  this.setState({ birthday });

                  today = new Date(today);
                  birthday = new Date(birthday);

                  let diff = Math.floor(
                    Math.abs(today - birthday) / (1000 * 3600 * 24) / 365
                  );

                  this.setState({ diff });

                  if (diff < 4) {
                    this.setState({ birthdayFBClass: style.feedbackErr });
                    this.setState({ birthdayFB: "Mindestalter 4 Jahre" });
                  }

                  if (diff > 18) {
                    this.setState({ birthdayFBClass: style.feedbackErr });
                    this.setState({ birthdayFB: "Maximalalter 18 Jahre" });
                  }

                  if (diff > 4 && diff < 18) {
                    this.setState({ birthdayFBClass: style.feedbackSucc });
                    this.setState({ birthdayFB: "" });
                  }
                }}
              />
              <span class={style.bDayLabel}>Geburtstag</span>
              <span class={this.state.birthdayFBClass}>
                {this.state.birthdayFB}
              </span>
            </div>
            <div class={style.radioContainer}>
              <div class={style.radioBtn}>
                <label for="radioMale">männlich</label>
                <Radio
                  id="radioMale"
                  name="genderOptions"
                  onChange={this.handleRadioChange}
                />
              </div>
              <div class={style.radioBtn}>
                <label for="radioFemale">weiblich</label>
                <Radio
                  id="radioFemale"
                  name="genderOptions"
                  onChange={this.handleRadioChange}
                />
              </div>
            </div>
          </div>
          <div class={style.row}>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                class={style.fullWidth}
                type="number"
                min={0}
                max={300}
                label="Größe der Mutter"
                value={this.state.motherHeight}
                onInput={(e) => {
                  this.setState({ motherHeight: e.target.value });
                  let val = e.target.value;
                  if (val < 0) {
                    this.setState({ motherFBClass: style.feedbackErr });
                    this.setState({ motherFB: "Mindestens 0" });
                  }
                  if (val > 300) {
                    this.setState({ motherFBClass: style.feedbackErr });
                    this.setState({ motherFB: "Maximal 300" });
                  }
                  if (val >= 0 && val <= 300) {
                    this.setState({ motherFBClass: style.feedbackSucc });
                    this.setState({ motherFB: "" });
                  }
                }}
              />
              <span class={this.state.motherFBClass}>
                {this.state.motherFB}
              </span>
            </div>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                class={style.fullWidth}
                type="number"
                min={0}
                max={300}
                label="Größe des Vaters"
                value={this.state.fatherHeight}
                onInput={(e) => {
                  this.setState({ fatherHeight: e.target.value });
                  let val = e.target.value;
                  if (val < 0) {
                    this.setState({ fatherFBClass: style.feedbackErr });
                    this.setState({ fatherFB: "Mindestens 0" });
                  }
                  if (val > 300) {
                    this.setState({ fatherFBClass: style.feedbackErr });
                    this.setState({ fatherFB: "Maximal 300" });
                  }
                  if (val >= 0 && val <= 300) {
                    this.setState({ fatherFBClass: style.feedbackSucc });
                    this.setState({ fatherFB: "" });
                  }
                }}
              />
              <span class={this.state.fatherFBClass}>
                {this.state.fatherFB}
              </span>
            </div>
          </div>
          <div class={style.row}>
            <Button raised onClick={this.sendData}>
              Speichern
            </Button>
            <Button
              onClick={() => {
                this.props.openConfirmDialog();
              }}
              class={style.codeBtn}
            >
              Accout löschen
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
