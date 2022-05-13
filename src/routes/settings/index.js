import { h, Component } from "preact";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import style from "./style";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Auth from "../../components/state";
import "preact-material-components/List/style.css";
import "preact-material-components/Radio/style.css";
import Checkbox from "preact-material-components/Checkbox";
import Formfield from "preact-material-components/FormField";
import "preact-material-components/Checkbox/style.css";
import Snackbar from "preact-material-components/Snackbar";
import "preact-material-components/Snackbar/style.css";

export default class Settings extends Component {
  componentWillMount = () => {
    this.getConfiguration();
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleKey);
  };

  handleKey = (event) => {
    if (event.code === "Enter") {
      this.setConfiguration();
      document.removeEventListener("keyup", this.handleKey);
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  // API Request to load settings
  getConfiguration = () => {
    let that = this;
    let url = Auth.url + "/api/configurations";
    let xhttp = new XMLHttpRequest();

    xhttp.open("GET", url);
    xhttp.setRequestHeader("Accept", 'application/json"');
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if ([1, 2, 3, 4].includes(this.readyState)) {
        if (this.status === 200) {
          try {
            // Set Values in state to display them in textfields
            let response = JSON.parse(this.responseText);
            that.setState({ reminder: response.config.days_reminder });
            that.setState({ mailService: response.config.mail_server });
            that.setState({ mailPort: response.config.mail_port });
            that.setState({ ssl: response.config.mail_use_ssl });
            that.setState({ mailUsername: response.config.mail_username });
            that.setState({ regisCode: response.config.registration_code });

            // Snackbar MSG
            that.bar.MDComponent.show({
              message: `Einstellungen erfolgreich geladen`,
            });
          } catch (err) {}
        }
      } else {
        // Snackbar MSG
        that.bar.MDComponent.show({
          message: `Fehler beim Laden`,
        });
      }
    };

    xhttp.send();
  };

  // API Request to update settings
  setConfiguration = () => {
    let that = this;
    let url = Auth.url + "/api/configurations";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          // Snackbar MSG
          that.bar.MDComponent.show({
            message: `Einstellungen erfolgreich geändert`,
          });
        } else {
          // Snackbar MSG
          that.bar.MDComponent.show({
            message: `Fehler beim Ändern`,
          });
        }
      }
    };

    let data = `{
            "days_reminder": ${this.state.reminder},
			"mail_server": "${this.state.mailService}",
			"mail_port": ${this.state.mailPort},
			"mail_user_ssl" : ${this.state.ssl},
			"mail_username": "${this.state.mailUsername}",
			"mail_password": "${this.state.password}"
        }`;

    xhttp.send(data);
  };

  // Set state to true if ssl checked
  checkServer = () => {
    let checkbox = document.getElementsByName("serverCheck");
    this.setState({ ssl: checkbox[0].checked });
  };

  // API Request to send testmail
  checkConfig = () => {
    let that = this;
    let url = Auth.url + "/api/configurations/testmail";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if ([1, 2, 3, 4].includes(this.readyState)) {
        if (this.status === 200) {
          // Snackbar MSG
          that.bar.MDComponent.show({
            message: `E-Mail erfolgreich gesendet`,
          });
        } else {
          // Snackbar MSG
          that.bar.MDComponent.show({
            message: `Fehler beim Senden`,
          });
        }
      }
    };

    let data = `{
		"test_email_address": "${Auth.getUser().email}"
        }`;

    xhttp.send(data);
  };

  // API Request to generate registration code
  generateCode = () => {
    let that = this;
    let url = Auth.url + "/api/configurations/code";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("authorization", Auth.getUser().token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          try {
            let response = JSON.parse(this.responseText);
            that.setState({ regisCode: response.registration_code });
          } catch (err) {}

          // Snackbar MSG
          that.bar.MDComponent.show({
            message: `Code erfolgreich generiert`,
          });
        } else {
          // Snackbar MSG
          that.bar.MDComponent.show({
            message: `Code konnte nicht generiert werden`,
          });
        }
      }
    };

    xhttp.send();
  };

  // copy via clipboard
  copyCode = () => {
    let dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = this.state.regisCode;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    this.bar.MDComponent.show({
      message: `Code ${this.state.regisCode} kopiert`,
    });
  };

  // Render Settings View
  render() {
    return (
      <div class={style.page}>
        <span class={style.pageHeader}>Einstellungen</span>
        <div class={style.settingsContainer}>
          <div class={style.headerContainer}>
            <span class={style.header}>Erinnerungsintervall</span>
            <span class={style.subHeader}>
              Intervall innerhalb dessen die Spieler per E-Mail an eine neue
              Messung erinnert werden
            </span>
          </div>
          <div class={style.row}>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                label="Erinnerung in Tagen"
                value={this.state.reminder}
                onInput={(e) => {
                  this.setState({ reminder: e.target.value });
                }}
              />
              <span class={this.state.usernameFBClass}>
                {this.state.usernameFB}
              </span>
            </div>
          </div>
        </div>
        <div class={style.settingsContainer}>
          <div class={style.headerContainer}>
            <span class={style.header}>E-Mail-Server</span>
            <span class={style.subHeader}>
              Es ist wichtig, diesen Server zu konfigurieren, so dass E-Mail
              versendet werden können, z.B. für den Passwort-Reset und
              Benachrichtigungen
            </span>
          </div>
          <div class={style.row}>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                label="E-Mail-Server"
                value={this.state.mailService}
                onInput={(e) => {
                  this.setState({ mailService: e.target.value });
                }}
              />
              <span class={this.state.serverFBClass}>
                {this.state.serverFB}
              </span>
            </div>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                label="Port"
                value={this.state.mailPort}
                onInput={(e) => {
                  this.setState({ mailPort: e.target.value });
                }}
              />
              <span class={this.state.portFBClass}>{this.state.portFB}</span>
            </div>
          </div>
          <div class={style.row}>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                label="Benutzername"
                value={this.state.mailUsername}
                onInput={(e) => {
                  this.setState({ mailUsername: e.target.value });
                }}
              />
            </div>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                label="Passwort"
                type="password"
                value={this.state.password}
                onInput={(e) => {
                  this.setState({ password: e.target.value });
                }}
              />
            </div>
          </div>
          <div class={style.row}>
            <div class={style.checkContainer}>
              <span class={style.label}>SSL Verschlüsselung</span>
              <Formfield>
                <Checkbox
                  name="serverCheck"
                  checked={this.state.ssl}
                  onChange={() => {
                    this.checkServer();
                  }}
                />
              </Formfield>
            </div>
            <Button onClick={this.checkConfig}>Testmail senden</Button>
          </div>

          <div class={style.headerContainer}>
            <span class={style.header}>Registrierungscode</span>
            <span class={style.subHeader}>
              Damit sich ein Benutzer registrieren kann, ist ein
              Registrierungscode notwending.
            </span>
          </div>
          <div class={`${style.row} ${style.codeContainer}`}>
            <div class={style.displayCode}>
              <span>Code: {this.state.regisCode}</span>
              <button class={style.copyBtn}>
                <i
                  class={style.copyIcon}
                  aria-hidden="true"
                  onClick={this.copyCode}
                >
                  content_copy
                </i>
              </button>
            </div>

            <Button onClick={this.generateCode} class={style.codeBtn}>
              Code generieren
            </Button>
          </div>
          <div class={style.btnContainer}>
            <Button
              class={style.mrgnBttm}
              raised
              onClick={this.setConfiguration}
            >
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
      </div>
    );
  }
}
