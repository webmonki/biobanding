import { h, Component } from "preact";
import style from "./style";
import "preact-material-components/TextField/style.css";
import "preact-material-components/Select/style.css";
import Dialog from "preact-material-components/Dialog";
import "preact-material-components/Dialog/style.css";

export default class ConfirmDialog extends Component {
  render() {
    return (
      <Dialog
        class={style.confirmDialog}
        ref={this.props.reference}
        onAccept={() => {
          this.props.deleteAccount();
        }}
      >
        <Dialog.Header class={style.confirm}>
          {this.props.dialogHeader}
        </Dialog.Header>
        <Dialog.Body />
        <Dialog.Footer class={style.confirm}>
          <Dialog.FooterButton cancel>Abbrechen</Dialog.FooterButton>
          <Dialog.FooterButton
            style={{ color: "white" }}
            class="mdc-button mdc-theme--primary-bg"
            raised
            accept
          >
            Löschen
          </Dialog.FooterButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
