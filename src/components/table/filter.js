import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Select from "preact-material-components/Select";
import "preact-material-components/Select/style.css";
import NewMeasurementAdmin from "../dialogs/newMeasurementAdmin";

export default class Filter extends Component {
  componentWillMount = () => {
    this.setState({ chosenIndex: 2 });
    this.setState({ operator: 0 });
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

    // Operator for Strings
    if (type === "string") {
      if (this.state.operator !== 0) {
        this.setState({ operator: 0 });
      }
      return <div>enthält</div>;

      // Operator for number and date-object
    } else if (type === "number" || type === "object") {
      return (
        <button
          class={style.operatorBtn}
          onClick={() => {
            let operator = this.state.operator;

            if (operator === 0 || operator === 1) {
              this.setState({ operator: this.state.operator + 1 });
            } else if (operator === 2) {
              this.setState({ operator: 0 });
            }

            this.hanldeChange();
          }}
        >
          {this.getOperatorSign()}
        </button>
      );
    }
  };

  getOperatorSign = () => {
    let operator = this.state.operator;

    if (operator === 0) {
      return "=";
    } else if (operator === 1) {
      return "<";
    } else if (operator === 2) {
      return ">";
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
          autocomplete="off"
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
          autocomplete="off"
          outlined
          onInput={(e) => {
            this.setState({ value: e.target.value });
            this.hanldeChange();
          }}
        />
      );
    } else if (type === "object") {
      return (
        <TextField
          class={style.filterDatePicker}
          autocomplete="off"
          outlined
          type="date"
          onInput={(e) => {
            let dateString = e.target.value;
            dateString = dateString.replace('"', "");
            dateString = dateString.replace('"', "");

            let parts = dateString.split("-");
            let newDate = new Date(parts[0], parts[1] - 1, parts[2]);
            this.setState({ value: newDate });

            this.hanldeChange();
          }}
        />
      );
    }
  };

  render() {
    return (
      <div class={style.filter}>
        {/* Cancel Button */}
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

        {/* dropdown to choose column */}
        <Select
          outlined
          selectedIndex={this.state.chosenIndex}
          onChange={(e) => {
            this.setState({ chosenIndex: e.target.selectedIndex });
            this.setState({ value: "" });
            this.hanldeChange();
          }}
        >
          {this.props.cols.map((col) => (
            <Select.Item>{col}</Select.Item>
          ))}
        </Select>
        <div class={style.operatorContainer}>{this.getOperators()}</div>
        {this.getInputField()}
      </div>
    );
  }
}
