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

  // Collapse filter Container
  collapseFilterContainer = () => {
    let coll = document.getElementById("filterContainer");

    if (coll.style.maxHeight) {
      coll.style.maxHeight = null;
    } else {
      coll.style.maxHeight = "fit-content";
    }
  };

  showIds = () => {
    let filterList = this.state.filterList;

    filterList.forEach((filter) => console.log(filter.attributes.id));
    console.log("---------------------------");
  };

  // Delete a Filter from Filterlist
  deleteFilter = (id) => {
    this.props.deleteFilterParams(id);
    let filterList = this.state.filterList;

    filterList.forEach((filter) => {
      if (filter.attributes.id === id) {
        let index = filterList.indexOf(filter);
        if (index !== -1) {
          filterList.splice(index, 1);
        }
      }
    });

    this.setState({ filterList });
    this.showIds();
  };

  // Add a Filter to Filterlist
  addFilter = () => {
    let filterList = this.state.filterList;
    let keys = Object.keys(filterList);
    let id;
    let i = 0;

    let loop = true;
    let match = false;

    while (loop) {
      if (filterList.length === 0) {
        loop = false;
        id = 0;
      }

      filterList.forEach((filter) => {
        if (i + "filter" === filter.attributes.id) {
          match = true;
        }
      });

      if (match) {
        i++;
        match = false;
      } else {
        id = i;
        loop = false;
      }
    }

    let filter = (
      <Filter
        cols={this.props.cols}
        deleteFilter={this.deleteFilter}
        id={id + "filter"}
        data={this.props.data}
        getFilters={this.props.getFilters}
      />
    );

    filterList.push(filter);

    this.setState({ filterList });

    this.showIds();
  };

  renderFilterList = () => {
    let filterList = this.state.filterList;

    let content = (
      <div id={"filterContainer"} class={style.filterContainer}>
        <div class={style.addFilterContainer}>
          {/* Add Filter Button */}
          <button class={style.menuBtn} onClick={this.addFilter}>
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
            <div>{filter}</div>
          ))}
        </div>
      </div>
    );

    return content;
  };

  // Return visibility of the filter Counter Icon
  getVisibility = () => {
    let length = this.state.filterList.length;

    if (length > 0) {
      return "visible";
    }
    return "hidden";
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
            <button
              class={style.invertBtn}
              onClick={this.collapseFilterContainer}
            >
              <i
                class={`${"material-icons"} ${style.invertIcon}`}
                aria-hidden="true"
              >
                filter_list
              </i>
            </button>
            {/* Filter Count */}
            <div
              class={style.filterCountContainer}
              onCLick={this.collapseFilterContainer}
              style={{ visibility: this.getVisibility() }}
            >
              {this.state.filterList.length}
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
