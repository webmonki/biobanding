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
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";
import Card from "preact-material-components/Card";

export default class Confirm extends Component {
  componentWillMount = () => {
    let queryString = window.location.search;

    let urlParams = new URLSearchParams(queryString);

    let token = urlParams.get("token");

    this.setState({ token });
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleKey);
  };

  handleKey = (event) => {
    if (event.code == "Enter") {
      this.sendData();
      document.removeEventListener("keyup", this.handleKey);
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  sendConfirm = () => {
    let that = this;
    let url = Auth.url + "/api/users/confirm";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", this.state.token);

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText);
        // that.setState({ responseFBClass : style.feedbackSucc });
        // that.setState({ responseFB : 'Spieler Details erfolgreich angelegt'});
        console.log("RES: ", this.response);
        that.bar.MDComponent.show({
          message: `Benutzer bestätigt`,
        });
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

  render() {
    return (
      <Card class={style.card}>
        <div class={style.headerContainer}>
          <span class={style.header}>Benutzer bestätigen</span>
        </div>
        <div class={style.inputContainer}>
          <div class={style.input}>
            <TextField
              autocomplete="off"
              class={style.fullWidth}
              outlined
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
              outlined
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
          <div class={style.dateContainer}>
            <TextField
              class={style.dateInput}
              outlined
              type="date"
              value={this.state.birthday}
              onInput={(e) => this.setState({ birthday: e.target.value })}
            />
            <span class={style.bDayLabel}>Geburtstag</span>
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
          <div class={style.input}>
            <TextField
              autocomplete="off"
              class={style.fullWidth}
              type="number"
              min={0}
              max={300}
              outlined
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
          </div>
          <div class={style.input}>
            <TextField
              autocomplete="off"
              class={style.fullWidth}
              type="number"
              min={0}
              max={300}
              outlined
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
          </div>
          <div class={style.btnContainer}>
            <Button raised onClick={this.sendData}>
              Speichern
            </Button>
          </div>
          <div class={style.mySnackbar}>
            <Snackbar
              ref={(bar) => {
                this.bar = bar;
              }}
            />
          </div>
        </div>
      </Card>
    );
  }
}
