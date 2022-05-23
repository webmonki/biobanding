import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";
import TextField from "preact-material-components/TextField";
import "preact-material-components/TextField/style.css";
import Select from "preact-material-components/Select";
import "preact-material-components/Select/style.css";
import Filter from "./filter";

export default class Menu extends Component {
  componentWillMount = () => {
    this.setState({ containerDelete: style.dontDisplay });
    this.setState({ containerAddSearch: style.searchContainer });
    this.setState({ filterList: [] });
    this.setState({ filterCount: 0 });
  };

  componentDidMount = () => {
    this.closeFilterContainer();
  };

  componentWillUnmount = () => {
    window.removeEventListener("click", this.handleOutsideClick);
  };

  handleOutsideClick = (event) => {
    let container = document.getElementById(
      this.props.title + "filterContainer"
    );
    let btn = document.getElementById(this.props.title + "openFilterBtn");
    if (container.contains(event.target) || btn.contains(event.target)) {
    } else {
      this.collapseFilterContainer();
    }
  };

  // Count meassage of selected rows for delete
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

  closeFilterContainer = () => {
    let coll = document.getElementById(this.props.title + "filterContainer");
    let addContainer = document.getElementById(
      this.props.title + "addFilterContainer"
    );

    coll.style.maxHeight = null;
    addContainer.style.display = "none";
  };

  // Collapse filter Container
  collapseFilterContainer = () => {
    let coll = document.getElementById(this.props.title + "filterContainer");
    let addContainer = document.getElementById(
      this.props.title + "addFilterContainer"
    );

    if (coll.style.maxHeight === "fit-content") {
      coll.style.maxHeight = null;
      addContainer.style.display = "none";
      window.removeEventListener("click", this.handleOutsideClick);
    } else {
      coll.style.maxHeight = "fit-content";
      addContainer.style.display = "flex";
      window.addEventListener("click", this.handleOutsideClick);
    }
  };

  renderFilterList = () => {
    let filterList = this.props.filters;

    let content = (
      <div
        id={this.props.title + "filterContainer"}
        class={style.filterContainer}
      >
        <div
          id={this.props.title + "addFilterContainer"}
          class={style.addFilterContainer}
        >
          {/* Add Filter Button */}
          <button class={style.menuBtn} onClick={this.props.addFilter}>
            <i
              class={`${"material-icons"} ${style.menuBtnIcon}`}
              aria-hidden="true"
            >
              add_circle
            </i>
          </button>
        </div>
        {/* Container in which the Filters will be rendered */}
        <div class={style.filterListContainer}>
          {filterList.map((filter) => (
            <div>
              <Filter
                cols={this.props.cols}
                deleteFilter={this.props.deleteFilter}
                id={filter.id}
                data={this.props.data}
                updateFilter={this.props.updateFilter}
                chosenIndex={filter.chosenIndex}
                operator={filter.operator}
                value={filter.val}
                setData={this.setData}
              />
            </div>
          ))}
        </div>
      </div>
    );

    return content;
  };

  // Return visibility of the filter Counter Icon
  getVisibility = () => {
    let length = this.props.filters.length;

    if (length > 0) {
      return "visible";
    }
    return "hidden";
  };

  renderFilterButton = () => {
    if (this.props.cols.length > 0) {
      return (
        <button
          id={this.props.title + "openFilterBtn"}
          class={style.invertBtn}
          onClick={() => {
            this.collapseFilterContainer();
          }}
        >
          <i
            class={`${"material-icons"} ${style.invertIcon}`}
            aria-hidden="true"
          >
            filter_list
          </i>
        </button>
      );
    }

    return undefined;
  };

  render() {
    let content;
    if (this.props.showDelete) {
      // Delete Button
      content = (
        <div class={style.deleteContainer} onClick={this.props.checkDelete}>
          <span class={style.selectedCount}>{this.getSelectedCountMsg()}</span>
          <i class={style.deleteIcon} aria-hidden="true">
            delete
          </i>
        </div>
      );
    } else {
      // Table Menu Bar
      content = (
        <div class={style.menuContainer}>
          <div class={style.filterContentContainer}>
            {/* Button to open Filterlist */}
            {this.renderFilterButton()}
            {/* Filter Count */}
            <div
              class={style.filterCountContainer}
              onCLick={this.collapseFilterContainer}
              style={{ visibility: this.getVisibility() }}
            >
              {this.props.filters.length}
            </div>
            {/* Filter list */}
            {this.renderFilterList()}
          </div>

          {/* Add and Export Button */}
          <div class={style.menuBtnContainer}>
            <button class={style.invertBtn} onClick={this.props.exportFile}>
              <i
                class={`${"material-icons"} ${style.invertIcon}`}
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
                add_circle
              </i>
            </button>
          </div>
        </div>
      );
    }
    return <div>{content}</div>;
  }
}
