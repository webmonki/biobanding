import { h, Component } from "preact";
import style from "./style";
import "preact-material-components/TextField/style.css";
import "preact-material-components/Select/style.css";
import Dialog from "preact-material-components/Dialog";
import "preact-material-components/Dialog/style.css";
import TextField from "preact-material-components/TextField";

export default class EditUser extends Component {
  handleKey = (event) => {
    if (event.code === "Enter") {
      this.props.sendData(this.props.username, this.props.email);
      document.removeEventListener("keyup", this.handleKey);
    }
  };

  render() {
    return (
      <Dialog
        class={style.dialog}
        ref={this.props.reference}
        onAccept={() => {
          this.props.sendData(this.props.username, this.props.email);
        }}
        onCancel={() => {}}
      >
        <Dialog.Header>Benutzer bearbeiten</Dialog.Header>
        <Dialog.Body>
          <div class={style.inputContainer}>
            <span class={style.subHeader}>Benutzer Daten</span>
            <div class={style.row}>
              <div class={style.input}>
                <TextField
                  autocomplete="off"
                  label="Benutzername"
                  class={style.fullWidth}
                  value={this.props.username}
                  onKeyUp={(e) => {
                    document.addEventListener("keyup", this.handleKey);
                    let val = e.target.value;
                    this.props.username = val;
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
                  label="E-Mail"
                  class={style.fullWidth}
                  value={this.props.email}
                  onInput={(e) => {
                    let val = e.target.value;
                    this.props.email = val;

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
                <span class={this.state.emailFBClass}>
                  {this.state.emailFB}
                </span>
              </div>
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer class={style.footer}>
          <Dialog.FooterButton cancel>Abbrechen</Dialog.FooterButton>
          <Dialog.FooterButton
            style={{ color: "white" }}
            class="mdc-button mdc-theme--primary-bg"
            raised
            accept
          >
            Speichern
          </Dialog.FooterButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
