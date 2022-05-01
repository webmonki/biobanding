import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";

export default class Menu extends Component {
  componentWillMount = () => {
    this.setState({ containerDelete: style.dontDisplay });
    this.setState({ containerAddSearch: style.searchContainer });
  };

  render() {
    let content;
    if (this.props.showDelete) {
      content = (
        <div class={style.deleteContainer} onClick={this.props.checkDelete}>
          <i class={style.deleteIcon} aria-hidden="true">
            delete
          </i>
        </div>
      );
    } else {
      content = (
        <div class={style.searchContainer}>
          <TextField
            autocomplete="off"
            outlined
            label="Suche"
            value={this.state.search}
            onKeyUp={(e) => {
              let val = e.target.value;
              this.setState({ search: val });
              this.props.setSearchVal(val);
            }}
          />
          <Button class={style.roundBtn} raised onClick={this.props.showDialog}>
            <i
              class="material-icons mdc-button__icon mdc-theme-on-primary"
              aria-hidden="true"
            >
              add
            </i>
            <span class="mdc-button__label mdc-theme-on-primary">
              erstellen
            </span>
          </Button>
        </div>
      );
    }
    return <div>{content}</div>;
  }
}
