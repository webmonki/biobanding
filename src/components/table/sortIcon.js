import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";

export default class SortIcon extends Component {
  componentWillMount = () => {
    this.setState({ arrow: "arrow_downward" });
    this.setState({ thIconClass: style.dontDisplay });
  };

  handleIconClick = () => {
    if (this.state.arrow === "arrow_downward") {
      this.setState({ arrow: "arrow_upward" });
      this.props.desc(this.props.colname);
    } else if (this.state.arrow === "arrow_upward") {
      this.setState({ arrow: "arrow_downward" });
      this.props.asc(this.props.colname);
    }
  };

  handleOutsideClick = (event) => {
    if (document.getElementById(this.props.colname).contains(event.target)) {
      // DO NOTHING
    } else {
      window.removeEventListener("click", this.handleOutsideClick);
      this.setState({ thIconClass: style.dontDisplay });
    }
  };

  render() {
    return (
      <div
        id={this.props.colname}
        class={style.headerCell}
        onCLick={() => {
          this.setState({ thIconClass: style.thIcon });
          window.addEventListener("click", this.handleOutsideClick);
          this.handleIconClick();
        }}
      >
        {this.props.colname}
        <List.ItemGraphic class={this.state.thIconClass}>
          {this.state.arrow}
        </List.ItemGraphic>
      </div>
    );
  }
}
