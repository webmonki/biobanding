import { h, Component } from "preact";
import Card from "preact-material-components/Card";
import "preact-material-components/Card/style.css";
import "preact-material-components/Button/style.css";
import "preact-material-components/TextField/style.css";
import Button from "preact-material-components/Button";
import style from "./style";
import { route } from "preact-router";
import Auth from "../../components/state";
import { Link } from "preact-router/match";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";

export default class Signup extends Component {
  componentWillMount = () => {
    this.setState({ btnDisabled: true });
  };

  componentDidMount = () => {
    this.handleChange();
    document.addEventListener("keyup", this.handleKey);
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

  // Send Request
  signup = () => {
    let that = this;
    let url = Auth.url + "/api/users/register";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
      if ([1, 2, 3, 4].includes(this.readyState)) {
        if (this.status === 200) {
          // If Request is Ok go to Login
          that.props.setInstructions(true);
          route("/login", true);
        } else {
          try {
            let response = JSON.parse(this.responseText);
            if (response.msg == "Token is invalid") {
              Auth.logout();
              location.reload();
            }
            that.setState({ responseFBClass: style.feedbackErr });
            that.setState({ responseFB: response.msg });
          } catch (err) {}
        }
      } else {
        this.setState({ signupResponse: "Ups, something went wrong" });
      }
    };

    let data = `{
            "username": "${this.state.username}",
            "email": "${this.state.email}",
            "password": "${this.state.password}",
			"is_admin": ${false}
        }`;

    xhttp.send(data);
  };

  render() {
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
              outlined
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
              outlined
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
              outlined
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
              outlined
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
}
