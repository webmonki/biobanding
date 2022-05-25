import { h, Component } from "preact";
import Card from "preact-material-components/Card";
import "preact-material-components/Card/style.css";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import style from "./style";
import { route } from "preact-router";
import Auth from "../../components/state.js";
import { Link } from "preact-router/match";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Footer from "../../components/footer";

export default class Login extends Component {
  componentWillMount = () => {
    // initial State of login-Buttons
    this.setState({ btnDisabled: true });

    // Will be set to false after user tried to login and the email is not confirmed
    this.setState({ loginStatus: true });
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleKey);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  handleKey = (event) => {
    if (this.state.btnDisabled === false && event.code === "Enter") {
      this.login();
    }
  };

  // Check Input and Enable Button
  handleChange = () => {
    this.setState({ name: document.getElementById("nameInput").value });
    this.setState({ password: document.getElementById("passwordInput").value });
    this.setState({ loginResponse: "" });

    let val = this.state.name;
    let password = this.state.password;
    let btnDisabled = true;

    if (val.length > 2 && val.length < 32 && password.length > 3) {
      btnDisabled = false;
    }
    this.setState({ btnDisabled });
  };

  // Request to Post Login Data
  login = () => {
    let that = this;
    let url = Auth.url + "/api/users/login";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
      if ([1, 2, 3, 4].includes(this.readyState)) {
        if (this.status === 200) {
          try {
            let response = JSON.parse(this.responseText);
            Auth.createUser(response);
            // If Request Ok go to Home
            document.removeEventListener("keyup", this.handleKey);
            route("/measurements", true);
          } catch (err) {}
        } else if (this.status === 403) {
          that.setState({ loginStatus: false });
        } else {
          try {
            let response = JSON.parse(this.responseText);
            that.setState({ responseFBClass: style.feedbackErr });
            that.setState({ responseFB: response.msg });
          } catch (err) {}
        }
      }
    };

    let data = `{
            "username": "${this.state.name}",
            "password": "${this.state.password}"
        }`;

    xhttp.send(data);
  };

  // Neue Bestätigungs Email senden
  sendMail = () => {
    let that = this;
    let url = Auth.url + "/api/users/sendConfirm";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          try {
            that.props.showSnackbar("E-Mail erfolgreich gesendet");
          } catch (err) {}
        } else {
          that.props.showSnackbar("Fehler beim Senden der E-Mail", true);
        }
      }
    };

    let data = `{
            "username": "${this.state.name}"
        }`;

    xhttp.send(data);
  };

  // Login Content
  renderContent = () => {
    let status = this.state.loginStatus;
    let showInstruction = this.props.showInstruction;

    // Anweisung nach Registrierung
    if (showInstruction) {
      return (
        <div class={style.inputContainer}>
          <div class={style.loginLabel}>Registrierung abschließen</div>
          <span class={style.msg}>
            Um die Registrierung abzuschließen, folgen Sie bitte den Anweisungen
            in der Bestätigungsmail.
          </span>
          <div class={style.btnContainer}>
            <Button
              class={style.secondaryBtn}
              onClick={() => {
                this.setState({ loginStatus: true });
                this.props.setInstructions(false);
              }}
            >
              Anmelden
            </Button>
          </div>
        </div>
      );
    }

    // Login Screen with validation in textfields
    if (status) {
      return (
        <div class={style.inputContainer}>
          <div class={style.loginLabel}>Anmeldung</div>
          <div class={style.input}>
            <TextField
              id="nameInput"
              label="Benutzername"
              value={this.state.name}
              onKeyUp={(e) => {
                this.handleChange();
                this.setState({ name: e.target.value });
                let val = e.target.value;

                this.setState({ nameFBClass: style.feedbackSucc });
                this.setState({ nameFB: "" });

                if (val.length < 2) {
                  this.setState({ nameFBClass: style.feedbackErr });
                  this.setState({ nameFB: "Mindestens 2 Zeichen" });
                }

                if (val.length > 32) {
                  this.setState({ nameFBClass: style.feedbackErr });
                  this.setState({ nameFB: "Maximal 32 Zeichen" });
                }
              }}
            />
            <span class={this.state.nameFBClass}>{this.state.nameFB}</span>
          </div>
          <div class={style.input}>
            <TextField
              id="passwordInput"
              type="password"
              label="Passwort"
              value={this.state.password}
              onKeyUp={(e) => {
                this.handleChange();
                let val = e.target.value;
                this.setState({ password: val });
              }}
            />
            <div class={style.linkContainer}>
              <Link class={style.link} href="/forgot" data-native>
                Passwort vergessen?
              </Link>
              <span class={this.state.responseFBClass}>
                {this.state.responseFB}
              </span>
            </div>
          </div>
          <div class={style.btnContainer}>
            <Button
              class={style.secondaryBtn}
              onClick={() => {
                route("/signup", true);
              }}
            >
              Registrieren
            </Button>
            <Button
              raised
              onClick={this.login}
              disabled={this.state.btnDisabled}
            >
              anmelden
            </Button>
          </div>
        </div>
      );
    }
    return (
      // Instruction after user tried to login and the email is not confirmed
      <div class={style.inputContainer}>
        <div class={style.loginLabel}>Registrierung abschließen</div>
        <span class={style.msg}>
          Deine E-Mail Adresse wurde noch nicht bestätigt. Bitte überprüfe deine
          Mails und folge den Anweisungen. Falls keine E-Mail vorhanden ist
          klicke auf "erneut senden".
        </span>
        <div class={style.btnContainer}>
          <Button
            class={style.secondaryBtn}
            onClick={() => {
              this.setState({ loginStatus: true });
            }}
          >
            Anmelden
          </Button>
          <Button raised onClick={this.sendMail}>
            erneut senden
          </Button>
        </div>
      </div>
    );
  };

  // Logo, Content
  render() {
    return (
      <div class={style.loginContent}>
        <Card class={style.card}>
          <div class={style.logoContainer}>
            <img
              class={style.logo}
              src="../../assets/breaking_bounds_logo.png"
            />
          </div>
          {this.renderContent()}
        </Card>
        <Footer />
      </div>
    );
  }
}
