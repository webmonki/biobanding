import { h, Component } from "preact";
import Card from "preact-material-components/Card";
import "preact-material-components/Card/style.css";
import "preact-material-components/Button/style.css";
import "preact-material-components/TextField/style.css";
import Button from "preact-material-components/Button";
import style from "./style";
import { route } from "preact-router";
import Auth from "../../components/state";
import TextField from "preact-material-components/TextField";

export default class Signup extends Component {
  componentWillMount = () => {
    this.setState({ btnDisabled: true });
    this.setState({ codeSet: false });
    this.setState({ code: "" });
  };

  componentDidMount = () => {
    if (this.state.codeSet) {
      this.handleChange();
      document.addEventListener("keyup", this.handleKey);
    }

    document.getElementById("code1").focus();
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  handleKey = (event) => {
    if (this.state.btnDisabled == false && event.code == "Enter") {
      this.signup();
      document.removeEventListener("keyup", this.handleKey);
    }
  };

  // Check Inputs and Enable Button
  handleChange = () => {
    this.setState({ username: document.getElementById("usernameInput").value });
    this.setState({ password: document.getElementById("passwordInput").value });
    this.setState({ email: document.getElementById("emailInput").value });
    this.setState({
      password2: document.getElementById("password2Input").value,
    });

    if (
      this.state.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) &&
      this.state.username.length > 2 &&
      this.state.username.length < 33 &&
      this.state.password.length > 3 &&
      this.state.password.length < 17 &&
      this.state.password === this.state.password2
    ) {
      this.setState({ btnDisabled: false });
    } else {
      this.setState({ btnDisabled: true });
    }
  };

  // API Request to sign up
  signup = () => {
    let that = this;
    let url = Auth.url + "/api/users/register";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          // Tells login view to show instructions
          that.props.setInstructions(true);

          // If Request is Ok go to Login
          route("/login", true);
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
            "username": "${this.state.username}",
            "email": "${this.state.email}",
            "password": "${this.state.password}",
			"registration_code": ${this.state.code},
			"is_admin": ${false}
        }`;

    xhttp.send(data);
  };

  // API Request to check registration code
  checkCode = () => {
    let that = this;
    let url = Auth.url + "/api/configurations/check_code";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
      if ([1, 2, 3, 4].includes(this.readyState)) {
        if (this.status === 200) {
          // if codeSet true show normal registration view
          that.setState({ codeSet: true });

          // empty Feedback
          that.setState({ responseFB: "" });
        } else {
          // if code is not correct
          try {
            // Set text for feedback
            let response = JSON.parse(this.responseText);

            that.setState({ responseFBClass: style.feedbackErr });
            that.setState({ responseFB: response.msg });

            // empty code input fields
            that.setState({ code: "" });
            that.setState({ code1: "" });
            that.setState({ code2: "" });
            that.setState({ code3: "" });
            that.setState({ code4: "" });

            // Focus first Feld
            document.getElementById("code1").focus();
          } catch (err) {}
        }
      }
    };

    let data = `{
		"registration_code": ${parseInt(this.state.code, 10)}
        }`;

    xhttp.send(data);
  };

  // Render registration view with validation in textfields
  renderContent = () => {
    // Normal registration form
    if (this.state.codeSet) {
      return (
        <Card class={style.card}>
          <div class={style.logoContainer}>
            <img class={style.logo} src="../../assets/StarsLogoTrans.png" />
          </div>
          <div class={style.inputContainer}>
            <div class={style.loginLabel}>Registrierung</div>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                id="usernameInput"
                label="Benutzername"
                value={this.state.editUsername}
                onKeyUp={(e) => {
                  this.handleChange();
                  this.setState({ editUsername: e.target.value });
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
                id="emailInput"
                label="E-Mail"
                value={this.state.email}
                onInput={(e) => {
                  this.handleChange();
                  this.setState({ email: e.target.value });
                  let val = e.target.value;
                  if (
                    val.match(
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
            <div class={style.input}>
              <TextField
                autocomplete="off"
                id="passwordInput"
                type="password"
                label="Passwort"
                value={this.state.password}
                onKeyUp={(e) => {
                  this.handleChange();
                  this.setState({ password: e.target.value });
                  let val = e.target.value;
                  if (val.length < 4) {
                    this.setState({ passwordFBClass: style.feedbackErr });
                    this.setState({ passwordFB: "Mindetsens 4 Zeichen" });
                  }
                  if (val.length > 16) {
                    this.setState({ passwordFBClass: style.feedbackErr });
                    this.setState({ passwordFB: "Maximal 16 Zeichen" });
                  }
                  if (val.length > 3 && val.length < 17) {
                    this.setState({ passwordFBClass: style.feedbackSucc });
                    this.setState({ passwordFB: "" });
                  }
                  if (this.state.password == this.state.password2) {
                    this.setState({ passwordSameFBClass: style.feedbackSucc });
                    this.setState({ passwordSameFB: "" });
                  } else {
                    this.setState({ passwordSameFBClass: style.feedbackErr });
                    this.setState({
                      passwordSameFB: "Passwörter stimmen nicht überein",
                    });
                  }
                }}
              />
              <span class={this.state.passwordFBClass}>
                {this.state.passwordFB}
              </span>
            </div>
            <div class={style.input}>
              <TextField
                autocomplete="off"
                id="password2Input"
                type="password"
                label="Passwort wiederholen"
                value={this.state.password2}
                onKeyUp={(e) => {
                  this.handleChange();
                  this.setState({ password2: e.target.value });
                  let val = e.target.value;
                  if (val.length < 4) {
                    this.setState({ password2FBClass: style.feedbackErr });
                    this.setState({ password2FB: "Mindetsens 4 Zeichen" });
                  }
                  if (val.length > 16) {
                    this.setState({ password2FBClass: style.feedbackErr });
                    this.setState({ password2FB: "Maximal 16 Zeichen" });
                  }
                  if (val.length > 3 && val.length < 17) {
                    this.setState({ password2FBClass: style.feedbackSucc });
                    this.setState({ password2FB: "" });
                  }
                  if (this.state.password === this.state.password2) {
                    this.setState({ passwordSameFBClass: style.feedbackSucc });
                    this.setState({ passwordSameFB: "" });
                  } else {
                    this.setState({ passwordSameFBClass: style.feedbackErr });
                    this.setState({
                      passwordSameFB: "Passwörter stimmen nicht überein",
                    });
                  }
                }}
              />
              <span class={this.state.password2FBClass}>
                {this.state.password2FB}
              </span>
            </div>
            <div class={style.pwVal}>
              <span class={this.state.passwordSameFBClass}>
                {this.state.passwordSameFB}
              </span>
            </div>
            <span class={this.state.responseFBClass}>
              {this.state.responseFB}
            </span>
            <div class={style.btnContainer}>
              <Button
                class={style.secondaryBtn}
                onClick={() => {
                  route("/login", true);
                }}
              >
                Anmelden
              </Button>
              <Button
                class={style.input}
                raised
                onClick={this.signup}
                disabled={this.state.btnDisabled}
              >
                registrieren
              </Button>
            </div>
          </div>
        </Card>
      );
    }
    // form to get registration code
    return (
      <Card class={style.card}>
        <div class={style.logoContainer}>
          <img class={style.logo} src="../../assets/breaking_bounds_logo.png" />
        </div>
        <div class={style.loginLabel}>Registrierungscode eingeben</div>
        <div class={style.codeInputRow}>
          <div class={style.codeInputContainer}>
            <input
              id={"code1"}
              class={style.codeInput}
              type="text"
              maxLength={1}
              autocomplete="off"
              value={this.state.code1}
              onInput={(e) => {
                this.setState({ code1: e.target.value });
                let code = this.state.code;
                code = code + e.target.value;
                this.setState({ code });

                document.getElementById("code2").focus();
              }}
            />
            <input
              id={"code2"}
              class={style.codeInput}
              type="text"
              maxLength={1}
              autocomplete="off"
              value={this.state.code2}
              onInput={(e) => {
                this.setState({ code2: e.target.value });
                let code = this.state.code;
                code = code + e.target.value;
                this.setState({ code });

                document.getElementById("code3").focus();
              }}
            />
            <input
              id={"code3"}
              class={style.codeInput}
              type="text"
              maxLength={1}
              autocomplete="off"
              value={this.state.code3}
              onInput={(e) => {
                this.setState({ code3: e.target.value });
                let code = this.state.code;
                code = code + e.target.value;
                this.setState({ code });

                document.getElementById("code4").focus();
              }}
            />
            <input
              id={"code4"}
              class={style.codeInput}
              type="text"
              maxLength={1}
              autocomplete="off"
              value={this.state.code4}
              onInput={(e) => {
                this.setState({ code4: e.target.value });
                let code = this.state.code;
                code = code + e.target.value;
                this.setState({ code });

                this.checkCode();
              }}
            />
          </div>
        </div>
        <div class={style.feedbackContainer}>
          <span class={this.state.responseFBClass}>
            {this.state.responseFB}
          </span>
        </div>
      </Card>
    );
  };

  render() {
    return this.renderContent();
  }
}
