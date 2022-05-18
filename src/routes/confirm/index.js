import { h, Component } from "preact";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import style from "./style";
import Navbar from "../../components/navbar/navbar";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Radio from "preact-material-components/Radio";
import Auth from "../../components/state";
import "preact-material-components/List/style.css";
import "preact-material-components/Radio/style.css";
import Card from "preact-material-components/Card";
import { route } from "preact-router";

export default class Confirm extends Component {
  componentWillMount = () => {
    // gets token from URL
    let queryString = window.location.search;

    let urlParams = new URLSearchParams(queryString);

    let token = urlParams.get("token");

    this.setState({ token });
  };

  // If view did mount create eventlistener for Enter
  componentDidMount = () => {
    document.addEventListener("keyup", this.handleKey);
  };

  // If Enter is hit, send Data
  handleKey = (event) => {
    if (event.code === "Enter") {
      this.sendConfirm();
      document.removeEventListener("keyup", this.handleKey);
    }
  };

  // If View unmounts remove eventlistener
  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  // API Request to confirm user
  sendConfirm = () => {
    let that = this;
    let url = Auth.url + "/api/users/confirm";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", this.state.token);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        let response = JSON.parse(this.responseText);

        Auth.createUser(response);
        route("/measurements", true);
      } else if (this.readyState === 4 && this.status === 200) {
        that.props.showSnackbar("E-Mail Adresse ist bereits bestätigt");
      } else {
        try {
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

    let data;

    // Only send filled Values
    if (
      this.state.motherHeight !== undefined &&
      this.state.fatherHeight !== undefined
    ) {
      data = `{
            "first_name": "${this.state.firstname}",
			"last_name": "${this.state.lastname}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex},
			"height_father": ${this.state.fatherHeight},
			"height_mother": ${this.state.motherHeight}
        }`;
    } else if (
      this.state.motherHeight !== undefined &&
      this.state.fatherHeight === undefined
    ) {
      data = `{
            "first_name": "${this.state.firstname}",
			"last_name": "${this.state.lastname}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex},
			"height_mother": ${this.state.motherHeight}
        }`;
    } else if (
      this.state.motherHeight === undefined &&
      this.state.fatherHeight !== undefined
    ) {
      data = `{
            "first_name": "${this.state.firstname}",
			"last_name": "${this.state.lastname}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex},
			"height_father": ${this.state.fatherHeight}        
		}`;
    } else {
      data = `{
            "first_name": "${this.state.firstname}",
			"last_name": "${this.state.lastname}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex}
        }`;
    }
    xhttp.send(data);
  };

  // Sets sex determined by radio btns
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

  // Render view with validation in Textfields
  render() {
    return (
      <Card class={style.card}>
        <div class={style.headerContainer}>
          <span class={style.header}>Persönliche Daten</span>
          <span class={style.subHeader}>
            Um deine Registrierung abzuschließen, gib jetzt deine persönlichen
            Daten ein. Diese werden für die Berechnung benötigt.
          </span>
        </div>
        <div class={style.inputContainer}>
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
          </div>
          <div class={style.row}>
            <div class={style.dateContainer}>
              <TextField
                class={style.dateInput}
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

          <div class={style.input}>
            <TextField
              autocomplete="off"
              class={style.fullWidth}
              type="number"
              min={0}
              max={300}
              label="Größe der Mutter"
              helperText="optional"
              helperTextPersistent
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
          </div>
          <div class={style.input}>
            <TextField
              autocomplete="off"
              class={style.fullWidth}
              type="number"
              min={0}
              max={300}
              label="Größe des Vaters"
              helperText="optional"
              helperTextPersistent
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
          </div>
          <div class={style.btnContainer}>
            <Button raised onClick={this.sendConfirm}>
              Registrierung abschließen
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}
