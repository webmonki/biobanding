import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";

export default class SortIcon extends Component {
  componentWillMount = () => {
    this.setState({ arrow: "" });
  };

  handleIconClick = () => {
    if (this.state.arrow === "arrow_downward") {
      this.setState({ arrow: "arrow_upward" });
      this.props.onClickSort(true, this.props.colname);
    } else if (this.state.arrow === "arrow_upward") {
      this.setState({ arrow: "arrow_downward" });
      this.props.onClickSort(false, this.props.colname);
    } else if (this.state.arrow === "") {
      this.setState({ arrow: "arrow_downward" });
      this.props.onClickSort(false, this.props.colname);
    }
  };

  handleOutsideClick = (event) => {
    if (document.getElementById(this.props.colname).contains(event.target)) {
      // DO NOTHING
    } else {
      window.removeEventListener("click", this.handleOutsideClick);
      this.setState({ arrow: "" });
    }
  };

  getIcon = () => {
    if (this.state.arrow !== "") {
      return (
        <i class={"material-icons"} aria-hidden="true">
          {this.state.arrow}
        </i>
      );
    }
    return <div class={style.placeholder} />;
  };

  render() {
    return (
      <div
        id={this.props.colname}
        class={`${this.props.alignment} ${style.headerCell}`}
        onCLick={() => {
          window.addEventListener("click", this.handleOutsideClick);
          this.handleIconClick();
        }}
      >
        <span>{this.props.colname}</span>

        {this.getIcon()}
      </div>
    );
  }
}
