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

  collapseFilterContainer = () => {
    let coll = document.getElementById("filterContainer");

    if (coll.style.maxHeight) {
      coll.style.maxHeight = null;
    } else {
      coll.style.maxHeight = coll.scrollHeight + "px";
    }
  };

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
  };

  addFilter = () => {
    let filterList = this.state.filterList;
    let keys = Object.keys(filterList);

    let filter = (
      <Filter
        cols={this.props.cols}
        deleteFilter={this.deleteFilter}
        id={keys.length + 1 + "filter"}
        data={this.props.data}
        getFilters={this.props.getFilters}
      />
    );

    filterList.push(filter);

    this.setState({ filterList });
  };

  renderFilterList = () => {
    let filterList = this.state.filterList;

    let content = (
      <div>
        <div class={style.filterListContainer}>
          {filterList.map((filter) => (
            <div>{filter}</div>
          ))}
        </div>
        <div class={style.addFilterContainer}>
          <button class={style.menuBtn} onClick={this.addFilter}>
            <i
              class={`${"material-icons"} ${style.menuBtnIcon}`}
              aria-hidden="true"
            >
              add_circle_outline
            </i>
          </button>
        </div>
      </div>
    );

    return content;
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
        <div class={style.menuContainer}>
          <div class={style.filterContentContainer}>
            <button
              class={style.menuBtn}
              onClick={this.collapseFilterContainer}
            >
              <i
                class={`${"material-icons"} ${style.menuBtnIcon}`}
                aria-hidden="true"
              >
                filter_list
              </i>
            </button>
            <div id={"filterContainer"} class={style.filterContainer}>
              {this.renderFilterList()}
            </div>
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
                add_circle_outline
              </i>
            </button>
          </div>
        </div>
      );
    }
    return <div>{content}</div>;
  }
}
