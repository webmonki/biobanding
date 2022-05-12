import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";

export default class SortIcon extends Component {
  componentWillMount = () => {
    // Initial State Pfeil Runter aber nicht angezeigt
    this.setState({ arrow: "arrow_downward" });
    this.setState({ visibility: "hidden" });
  };

  // Toggles Icon Pfeil
  handleIconClick = () => {
    this.setState({ visibility: "visible" });
    if (this.state.arrow === "arrow_downward") {
      this.setState({ arrow: "arrow_upward" });
      this.props.onClickSort(true, this.props.colname);
    } else if (this.state.arrow === "arrow_upward") {
      this.setState({ arrow: "arrow_downward" });
      this.props.onClickSort(false, this.props.colname);
    }
  };

  // Wenn auserhalb des Elements geklickt wird, wird der Pfeil versteckt und der Eventlistener entfernt
  handleOutsideClick = (event) => {
    if (document.getElementById(this.props.id).contains(event.target)) {
      // DO NOTHING
    } else {
      window.removeEventListener("click", this.handleOutsideClick);
      this.setState({ visibility: "hidden" });
    }
  };

  // Linie zwischen den Spalten im Kopf
  getDivider = () => {
    if (this.props.divider) {
      return <div class={style.divider} />;
    }
    return undefined;
  };

  // erzeugt Spalten Name mit Pfeil und alignment
  getHeaderContent = () => {
    if (this.props.alignment === style.alignLeft) {
      return (
        <div class={style.headerCellContainer}>
          {this.getDivider()}
          <div
            id={this.props.id}
            class={`${this.props.alignment} ${style.headerCell}`}
            onCLick={() => {
              window.addEventListener("click", this.handleOutsideClick);
              this.handleIconClick();
            }}
          >
            <span class={style.colname}>{this.props.colname}</span>

            <i
              class={`${"material-icons"} ${style.sortIcon}`}
              aria-hidden="true"
              style={{ visibility: this.state.visibility }}
            >
              {this.state.arrow}
            </i>
          </div>
        </div>
      );
    }

    if (this.props.alignment === style.alignRight) {
      return (
        <div class={style.headerCellContainer}>
          {this.getDivider()}
          <div
            id={this.props.id}
            class={`${this.props.alignment} ${style.headerCell}`}
            onCLick={() => {
              window.addEventListener("click", this.handleOutsideClick);
              this.handleIconClick();
            }}
          >
            <i
              class={`${"material-icons"} ${style.sortIcon}`}
              aria-hidden="true"
              style={{ visibility: this.state.visibility }}
            >
              {this.state.arrow}
            </i>
            <span>{this.props.colname}</span>
          </div>
        </div>
      );
    }
  };

  render() {
    return this.getHeaderContent();
  }
}
