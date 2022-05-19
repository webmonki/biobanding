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
import Footer from "../../components/footer";

export default class Reset extends Component {
  componentWillMount = () => {
    this.setState({ btnDisabled: true });

    // get token from URL
    let queryString = window.location.search;

    let urlParams = new URLSearchParams(queryString);

    let token = urlParams.get("token");

    this.setState({ token });
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
      this.sendNewPassword();
      document.removeEventListener("keyup", this.handleKey);
    }
  };

  // Check Inputs and Enable Button
  handleChange = () => {
    this.setState({ password: document.getElementById("passwordInput").value });
    this.setState({
      password2: document.getElementById("password2Input").value,
    });

    if (
      this.state.password.length > 3 &&
      this.state.password.length < 17 &&
      this.state.password === this.state.password2
    ) {
      this.setState({ btnDisabled: false });
    } else {
      this.setState({ btnDisabled: true });
    }
  };

  // API Request to send new password
  sendNewPassword = () => {
    let that = this;
    let url = Auth.url + "/api/user/reset";
    let xhttp = new XMLHttpRequest();

    xhttp.open("PUT", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onreadystatechange = function () {
      if ([1, 2, 3, 4].includes(this.readyState)) {
        if (this.status === 200) {
          route("login", true);
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
            "token": "${this.state.token}",
            "password": "${this.state.password}"
        }`;

    xhttp.send(data);
  };

  // Render Reset View with validation in textfields
  render() {
    return (
      <div class={style.resetContent}>
        <Card class={style.card}>
          <div class={style.logoContainer}>
            <img
              class={style.logo}
              src="../../assets/breaking_bounds_logo.png"
            />
          </div>
          <div class={style.inputContainer}>
            <div class={style.loginLabel}>Neues Passwort</div>
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
                onClick={this.sendNewPassword}
                disabled={this.state.btnDisabled}
              >
                senden
              </Button>
            </div>
          </div>
        </Card>
        <Footer />
      </div>
    );
  }
}
