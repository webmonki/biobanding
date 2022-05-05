import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Select from "preact-material-components/Select";
import "preact-material-components/Select/style.css";

export default class Filter extends Component {
  componentWillMount = () => {
    this.setState({ chosenIndex: 0 });
  };

  hanldeChange = () => {
    this.props.getFilters(
      this.props.id,
      this.props.cols[this.state.chosenIndex],
      this.state.operator,
      this.state.value
    );
  };

  getOperators = () => {
    let col = this.props.cols[this.state.chosenIndex];
    let data;

    if (this.props.data !== undefined) {
      data = this.props.data[0];
    } else {
      data = undefined;
    }

    let type = typeof data[col];

    if (type === "string") {
      if (this.state.operator !== 0) {
        this.setState({ operator: 0 });
      }
      return <div>enthält</div>;
    } else if (type === "number") {
      return (
        <Select
          outlined
          onChange={(e) => {
            this.setState({ operator: e.target.selectedIndex });
            this.hanldeChange();
          }}
        >
          <Select.Item>ist gleich</Select.Item>
          <Select.Item>kleiner als</Select.Item>
          <Select.Item>größer als</Select.Item>
        </Select>
      );
    }
  };

  getInputField = () => {
    let col = this.props.cols[this.state.chosenIndex];
    let data;

    if (this.props.data !== undefined) {
      data = this.props.data[0];
    } else {
      data = undefined;
    }

    let type = typeof data[col];

    if (type === "string") {
      return (
        <TextField
          type="text"
          outlined
          onInput={(e) => {
            this.setState({ value: e.target.value });
            this.hanldeChange();
          }}
        />
      );
    } else if (type === "number") {
      return (
        <TextField
          type="number"
          outlined
          onInput={(e) => {
            this.setState({ value: e.target.value });
            this.hanldeChange();
          }}
        />
      );
    }
  };

  render() {
    return (
      <div class={style.filter}>
        <button
          class={style.menuBtn}
          onClick={() => this.props.deleteFilter(this.props.id)}
        >
          <i
            class={`${"material-icons"} ${style.menuBtnIcon}`}
            aria-hidden="true"
          >
            cancel
          </i>
        </button>
        <Select
          outlined
          selectedIndex={this.state.chosenIndex}
          onChange={(e) => {
            this.setState({ chosenIndex: e.target.selectedIndex });
            this.setState({ value: "" });
          }}
        >
          {this.props.cols.map((col) => (
            <Select.Item>{col}</Select.Item>
          ))}
        </Select>
        {this.getOperators()}
        {this.getInputField()}
      </div>
    );
  }
}
