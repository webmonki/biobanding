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
  componentDidMount = () => {
    this.setState({ boolBtnIcon: "check" });
  };
  // Creates operator for filter determined by typeof cellcontent
  // Operator 0 : = , 1 = < , 2 = >
  getOperators = () => {
    let col = this.props.cols[this.props.chosenIndex];
    let data;

    if (this.props.data !== undefined) {
      data = this.props.data[0];
    } else {
      data = undefined;
    }

    let type = typeof data[col];
    // Operator for Boolean
    if (type === "boolean") {
      if (this.state.operator !== 0) {
        this.setState({ operator: 0 });
        this.props.updateFilter(this.props.id, undefined, undefined, false);
      }

      return <button class={style.operatorBtn}>=</button>;
    }

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

            // add to filterList which is applied to data
            this.props.updateFilter(
              this.props.id,
              undefined,
              this.state.operator,
              undefined
            );
          }}
        >
          {this.getOperatorSign()}
        </button>
      );
    }
  };

  getOperatorSign = () => {
    let operator = this.props.operator;

    if (operator === 0) {
      return "=";
    } else if (operator === 1) {
      return "<";
    } else if (operator === 2) {
      return ">";
    }
  };

  // get InputField determined by type of columncells
  getInputField = () => {
    let col = this.props.cols[this.props.chosenIndex];
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
          value={this.props.value}
          onInput={(e) => {
            this.props.updateFilter(
              this.props.id,
              undefined,
              undefined,
              e.target.value
            );
          }}
        />
      );
    } else if (type === "number") {
      return (
        <TextField
          type="number"
          autocomplete="off"
          outlined
          value={this.props.value}
          onInput={(e) => {
            this.props.updateFilter(
              this.props.id,
              undefined,
              undefined,
              e.target.value
            );
          }}
        />
      );
    } else if (type === "object") {
      let date;
      if (typeof this.props.value === "object") {
        let year = this.props.value.getFullYear();
        let month = this.props.value.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        let day = this.props.value.getDate();
        if (day < 10) {
          day = "0" + day;
        }

        date = year + "-" + month + "-" + day;
      }
      return (
        <TextField
          class={style.filterDatePicker}
          autocomplete="off"
          outlined
          type="date"
          value={date}
          onInput={(e) => {
            let dateString = e.target.value;
            dateString = dateString.replace('"', "");
            dateString = dateString.replace('"', "");

            let parts = dateString.split("-");

            if (parts.length === 3) {
              if (parts[0].length === 4 && parts[0][0] !== "0") {
                let newDate = new Date(parts[0], parts[1] - 1, parts[2]);

                this.props.updateFilter(
                  this.props.id,
                  undefined,
                  undefined,
                  newDate
                );
              }
            }
          }}
        />
      );
    } else if (type === "boolean") {
      {
        return this.getBoolBtn();
      }
    }
  };

  handleBoolBtnClick = () => {
    let icon = this.state.boolBtnIcon;

    if (icon === "check") {
      this.props.updateFilter(this.props.id, undefined, undefined, false);
      icon = "clear";
    } else if (icon === "clear") {
      this.props.updateFilter(this.props.id, undefined, undefined, true);
      icon = "check";
    }

    this.setState({ boolBtnIcon: icon });
  };

  getBoolBtnStyle = () => {
    let icon = this.state.boolBtnIcon;

    if (icon === "check") {
      return style.trueIcon;
    } else if (icon === "clear") {
      return style.falseIcon;
    }
  };

  getBoolBtn = () => {
    return (
      <div class={style.boolBtnContainer}>
        <button class={style.operatorBtn}>
          <i
            class={`${"material-icons"} ${this.getBoolBtnStyle()}`}
            onClick={this.handleBoolBtnClick}
          >
            {this.state.boolBtnIcon}
          </i>
        </button>
      </div>
    );
  };

  // To Celect the column on which the filter will be applied
  renderDrowpdown = () => (
    <select
      class={style.filterSelect}
      outlined
      selectedIndex={this.props.chosenIndex}
      onChange={(e) => {
        this.props.updateFilter(
          this.props.id,
          e.target.selectedIndex,
          undefined,
          undefined
        );
      }}
    >
      {this.props.cols.map((col) => (
        <option>{col}</option>
      ))}
    </select>
  );

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
        {this.renderDrowpdown()}
        <div class={style.operatorContainer}>{this.getOperators()}</div>
        {this.getInputField()}
      </div>
    );
  }
}
