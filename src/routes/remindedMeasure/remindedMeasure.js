import style from "./style";
import { h, Component } from "preact";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Card from "preact-material-components/Card";
import "preact-material-components/Card/style.css";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import Auth from "../../components/state";
import { route } from "preact-router";
import Snackbar from "preact-material-components/Snackbar";

export default class RemindedMeasurement extends Component {
  componentWillMount = () => {
    // gets token from URL
    let queryString = window.location.search;

    let urlParams = new URLSearchParams(queryString);

    let token = urlParams.get("token");

    this.setState({ token });

    this.validateInput();
  };

  componentDidMount = () => {
    document.addEventListener("keyup", this.handleKey);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keyup", this.handleKey);
  };

  handleKey = (event) => {
    if (this.state.disabled === false && event.code === "Enter") {
      this.sendData();
    }
  };

  validateInput = () => {
    let height = this.state.height;
    let sittingHeight = this.state.sittingHeight;
    let span = this.state.span;
    let weight = this.state.weight;

    this.setState({ disabled: false });

    if (sittingHeight > height * 0.5) {
      this.setState({ disabled: true });
    }

    if (span > height * 1.15) {
      this.setState({ disabled: true });
    }

    if (height === "" || height === undefined) {
      this.setState({ disabled: true });
    }

    if (sittingHeight === "" || sittingHeight === undefined) {
      this.setState({ disabled: true });
    }

    if (span === "" || span === undefined) {
      this.setState({ disabled: true });
    }

    if (weight === "" || weight === undefined) {
      this.setState({ disabled: true });
    }
  };

  // Opens snackbar with given text, if error true text will be red else green
  showSnackbar = (text, error) => {
    let sbText = document.getElementsByClassName("mdc-snackbar__text");
    let errorColor = "#B1262D";
    let successColor = "#3C9052";

    if (error) {
      sbText[0].style.color = errorColor;
    } else {
      sbText[0].style.color = successColor;
    }

    this.bar.MDComponent.show({
      message: text,
    });
  };

  sendData = () => {
    let that = this;
    let url = Auth.url + "/api/measurements/reminder";
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", url);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("authorization", this.state.token);

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        that.showSnackbar("Messung erfolgreich angelegt");
      } else if (this.status !== 200) {
        that.showSnackbar("Fehler beim Anlegen der Messung", true);
      }
    };

    let today = new Date();

    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    let data = `{
			"date_measured": "${date}",
			"height": ${this.state.height},
			"sitting_height": ${this.state.sittingHeight},
			"body_span": ${this.state.span},
			"weight": ${this.state.weight}
		}`;

    xhttp.send(data);
  };

  render() {
    return (
      <div class={style.page}>
        <Card class={style.card}>
          <div class={style.headerContainer}>
            <span class={style.header}>Messung erstellen</span>
            <span class={style.subHeader}>Anthropometrische Daten</span>
          </div>
          <div class={style.inputContainer}>
            <span class={style.subHeader}>{this.props.subHeader}</span>
            <div class={style.row}>
              <div class={style.input}>
                <TextField
                  autocomplete="off"
                  type="number"
                  class={style.fullWidth}
                  min={90}
                  max={300}
                  label="Größe"
                  value={this.state.height}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);

                    let val = e.target.value;
                    this.setState({ height: val });

                    if (val < 90) {
                      this.setState({ heightFBClass: style.feedbackErr });
                      this.setState({ heightFB: "Mindestens 90" });
                      this.setState({ disabled: true });
                    }
                    if (val > 250) {
                      this.setState({ heightFBClass: style.feedbackErr });
                      this.setState({
                        heightFB:
                          "Deine eingegebene Größe ist  nicht plausibel",
                      });
                      this.setState({ disabled: true });
                    }
                    if (val >= 90 && val <= 300) {
                      this.setState({ heightFBClass: style.feedbackSucc });
                      this.setState({ heightFB: "" });
                      this.setState({ disabled: false });
                    }
                    this.validateInput();
                  }}
                />
                <span class={this.state.heightFBClass}>
                  {this.state.heightFB}
                </span>
              </div>
              <div class={style.input}>
                <TextField
                  autocomplete="off"
                  type="number"
                  class={style.fullWidth}
                  min={0}
                  max={300}
                  label="Größe im Sitzen"
                  value={this.state.sittingHeight}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);
                    let val = e.target.value;
                    this.setState({ sittingHeight: val });
                    let height = this.state.height;

                    if (val < 0) {
                      this.setState({ sittingFBClass: style.feedbackErr });
                      this.setState({ sittingFB: "Mindestens 0" });
                      this.setState({ disabled: true });
                    }
                    if (val > 125) {
                      this.setState({ sittingFBClass: style.feedbackErr });
                      this.setState({
                        sittingFB: "Maximal 125",
                      });
                      this.setState({ disabled: true });
                    }
                    if (val > height * 0.5) {
                      this.setState({ sittingFBClass: style.feedbackErr });
                      this.setState({
                        sittingFB: "Deine Sitzgröße ist nicht plausibel",
                      });
                      this.setState({ disabled: true });
                    }
                    if (val >= 0 && val <= 125 && val < height * 0.5) {
                      this.setState({ sittingFBClass: style.feedbackSucc });
                      this.setState({ sittingFB: "" });
                      this.setState({ disabled: false });
                    }

                    this.validateInput();
                  }}
                />
                <span class={this.state.sittingFBClass}>
                  {this.state.sittingFB}
                </span>
              </div>
            </div>
            <div class={style.row}>
              <div class={style.input}>
                <TextField
                  autocomplete="off"
                  type="number"
                  class={style.fullWidth}
                  min={60}
                  max={300}
                  label="Arm Spannweite"
                  value={this.state.span}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);
                    let val = e.target.value;
                    this.setState({ span: val });
                    let height = this.state.height;

                    if (val < 60) {
                      this.setState({ spanFBClass: style.feedbackErr });
                      this.setState({ spanFB: "Mindestens 60" });
                      this.setState({ disabled: true });
                    }
                    if (val > 300) {
                      this.setState({ spanFBClass: style.feedbackErr });
                      this.setState({ spanFB: "Maximal 300" });
                      this.setState({ disabled: true });
                    }
                    if (val > height * 1.15) {
                      this.setState({ spanFBClass: style.feedbackErr });
                      this.setState({
                        spanFB: "Deine Armspanne ist nicht plausibel",
                      });
                      this.setState({ disabled: true });
                    }

                    if (val >= 60 && val <= 300 && val < height * 1.15) {
                      this.setState({ spanFBClass: style.feedbackSucc });
                      this.setState({ spanFB: "" });
                      this.setState({ disabled: false });
                    }

                    this.validateInput();
                  }}
                />
                <span class={this.state.spanFBClass}>{this.state.spanFB}</span>
              </div>
              <div class={style.input}>
                <TextField
                  autocomplete="off"
                  type="number"
                  class={style.fullWidth}
                  min={0}
                  max={300}
                  label="Gewicht"
                  value={this.state.weight}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);
                    let val = e.target.value;
                    this.setState({ weight: val });
                    if (val < 0) {
                      this.setState({ weightFBClass: style.feedbackErr });
                      this.setState({ weightFB: "Mindestens 0" });
                      this.setState({ disabled: true });
                    }
                    if (val > 300) {
                      this.setState({ weightFBClass: style.feedbackErr });
                      this.setState({ weightFB: "Maximal 300" });
                      this.setState({ disabled: true });
                    }
                    if (val >= 0 && val <= 300) {
                      this.setState({ weightFBClass: style.feedbackSucc });
                      this.setState({ weightFB: "" });
                      this.setState({ disabled: false });
                    }

                    this.validateInput();
                  }}
                />
                <span class={this.state.weightFBClass}>
                  {this.state.weightFB}
                </span>
              </div>
            </div>
          </div>
          <div class={style.row}>
            <Button
              onClick={() => {
                route("/login", true);
              }}
            >
              Anmelden
            </Button>
            <Button
              raised
              onClick={this.sendData}
              disabled={this.state.disabled}
            >
              Speichern
            </Button>
          </div>
        </Card>
        <div id="mySnackbar">
          <Snackbar
            ref={(bar) => {
              this.bar = bar;
            }}
          />
        </div>
      </div>
    );
  }
}
