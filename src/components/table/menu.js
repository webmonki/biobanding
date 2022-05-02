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

  getSelectedCountMsg = () => {
    let msg = this.props.count.toString();
    if (this.props.count === 1) {
      if (this.props.title === "Messungen") {
        msg = msg + " Messung ausgewählt";

        return msg;
      }
    }

    msg = msg + " " + this.props.title + " ausgewählt";

    return msg;
  };

  render() {
    let content;
    if (this.props.showDelete) {
      content = (
        <div class={style.deleteContainer} onClick={this.props.checkDelete}>
          <span class={style.selectedCount}>{this.getSelectedCountMsg()}</span>
          <i class={style.deleteIcon} aria-hidden="true">
            delete
          </i>
        </div>
      );
    } else {
      content = (
        <div class={style.searchContainer}>
          <div class={style.menuHeight}>
            <TextField
              autocomplete="off"
              label="Suche"
              outlined
              value={this.state.search}
              onKeyUp={(e) => {
                let val = e.target.value;
                this.setState({ search: val });
                this.props.setSearchVal(val);
              }}
            />
          </div>

          <div class={style.menuBtnContainer}>
            <button class={style.menuBtn} onClick={this.props.exportFile}>
              <i
                class={`${"material-icons"} ${style.menuBtnIcon}`}
                aria-hidden="true"
              >
                file_download
              </i>
            </button>
            <button class={style.menuBtn} onClick={this.props.showDialog}>
              <i
                class={`${"material-icons"} ${style.menuBtnIcon}`}
                aria-hidden="true"
              >
                add
              </i>
            </button>
          </div>
        </div>
      );
    }
    return <div>{content}</div>;
  }
}
