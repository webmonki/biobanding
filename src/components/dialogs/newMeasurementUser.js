import { h, Component } from "preact";
import style from "./style";
import "preact-material-components/TextField/style.css";
import Select from "preact-material-components/Select";
import "preact-material-components/Select/style.css";
import Dialog from "preact-material-components/Dialog";
import "preact-material-components/Dialog/style.css";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";

export default class NewMeasurementUser extends Component {
  state = { formValues: {} };
  componentWillMount = () => {
    this.setState({ header: this.props.header });
    this.setState({ msg: [] });
    this.setState({ disabled: true });
  };

  handleKey = (event) => {
    if (event.code === "Enter") {
      this.onAccept();
      document.removeEventListener("keyup", this.handleKey);
    }
  };

  onAccept = () => {
    this.props.sendData(
      this.state.formValues.height,
      this.state.formValues.sittingHeight,
      this.state.formValues.span,
      this.state.formValues.weight
    );

    this.resetFormValues();
  };

  resetFormValues = () => {
    this.setState({
      formValues: {},
    });
  };

  getFormValue = (name) => {
    if (this.state.formValues[name] !== undefined) {
      return this.state.formValues[name];
    }

    return this.props.formValues && this.props.formValues[name];
  };

  setFormValue = (name, value) => {
    this.setState({
      formValues: { ...this.state.formValues, [name]: value },
    });
  };

  validateInput = () => {
    let height = this.getFormValue("height");
    let sittingHeight = this.getFormValue("sittingHeight");
    let span = this.getFormValue("span");
    let weight = this.getFormValue("weight");

    let msg = [];

    if (sittingHeight > height * 0.5) {
      msg.push("Das Verhältnis von Sitzgröße zu Größe ist nicht plausibel");
      this.setState({ disabled: true });
    }

    if (span > height * 1.15) {
      msg.push("Das Verhältnis von Spannweite zu Größe ist nicht plausibel");
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

    this.setState({ msg });
  };

  getBtnStyle = () => {
    if (this.state.disabled) {
      return style.btnDisabled;
    }

    return style.btnEnabled;
  };

  render() {
    return (
      <Dialog
        class={style.dialog}
        ref={this.props.reference}
        onAccept={this.onAccept}
        onCancel={this.resetFormValues}
      >
        <Dialog.Header>{this.props.header}</Dialog.Header>
        <Dialog.Body>
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
                  outlined
                  label="Größe"
                  value={this.getFormValue("height")}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);

                    let val = e.target.value;
                    this.setFormValue("height", val);

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
                  outlined
                  label="Größe im Sitzen"
                  value={this.getFormValue("sittingHeight")}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);
                    let val = e.target.value;
                    this.setFormValue("sittingHeight", val);
                    if (val < 0) {
                      this.setState({ sittingFBClass: style.feedbackErr });
                      this.setState({ sittingFB: "Mindestens 00" });
                      this.setState({ disabled: true });
                    }
                    if (val > 125) {
                      this.setState({ sittingFBClass: style.feedbackErr });
                      this.setState({
                        sittingFB: "Deine Sitzgröße ist nicht plausibel",
                      });
                      this.setState({ disabled: true });
                    }
                    if (val >= 0 && val <= 125) {
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
                  outlined
                  label="Arm Spannweite"
                  value={this.getFormValue("span")}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);
                    let val = e.target.value;
                    this.setFormValue("span", val);
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
                    if (val >= 60 && val <= 300) {
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
                  outlined
                  label="Gewicht"
                  value={this.getFormValue("weight")}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);
                    let val = e.target.value;
                    this.setFormValue("weight", val);
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
            <div class={style.feedbackContainer}>
              {this.state.msg.map((msg) => (
                <p class={style.feedbackErr}>{msg}</p>
              ))}
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer class={style.footer}>
          <Dialog.FooterButton cancel>Abbrechen</Dialog.FooterButton>
          <Dialog.FooterButton
            raised
            accept
            class={this.getBtnStyle()}
            disabled={this.state.disabled}
          >
            Speichern
          </Dialog.FooterButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
