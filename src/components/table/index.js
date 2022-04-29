import { h, Component } from "preact";
import style from "./style";
import Button from "preact-material-components/Button";
import "preact-material-components/Button/style.css";
import List from "preact-material-components/List";
import Checkbox from "preact-material-components/Checkbox";
import Formfield from "preact-material-components/FormField";
import "preact-material-components/Checkbox/style.css";
import SortIcon from "./sortIcon";
import Menu from "./menu";

export default class Table extends Component {
  componentWillMount = () => {
    this.setPage(1);
    this.setState({ data: this.props.data });
    this.setState({ containerAddSearch: style.searchContainer });
    this.setState({ showDelete: false });
    this.setState({ checked: false });

    this.setState({ checkList: [] });
  };

  componentDidMount = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }

    if (this.state.newData !== this.props.data) {
      this.setState({ data: this.state.newData });
    }
  };

  componentDidUpdate = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
    this.checkAll();
    this.toggleShowDelete();
  };

  toggleShowDelete = () => {
    let showDelete;

    if (this.state.checkList.length == 0) {
      showDelete = false;
    } else if (this.state.checkList.length > 0) {
      showDelete = true;
    }

    if (showDelete != this.state.showDelete) {
      this.setState({ showDelete });
    }
  };

  setPage = (page) => {
    if (this.state.page != page) {
      this.setState({ page });
    }
  };

  sortDescending = (key) => {
    let data = this.state.data;

    if (typeof data[0][key] === "string") {
      data.sort((a, b) => a[key].localeCompare(b[key]));
    } else if (typeof data[0][key] === "number") {
      data.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
    }

    this.setState({ data });
  };

  sortAscending = (key) => {
    let data = this.state.data;

    if (typeof data[0][key] === "string") {
      data.sort((a, b) => b[key].localeCompare(a[key]));
    } else if (typeof data[0][key] === "number") {
      data.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
    }

    this.setState({ data });
  };

  search = (val) => {
    let newData = [];

    this.setState({ data: this.props.data });
    let cols = Object.keys(this.state.data[0]);

    this.state.data.forEach((data) => {
      let match = false;
      cols.forEach((col) => {
        if (col != "id" && col != "userID") {
          if (typeof data[col] == "number") {
            if (data[col].toString().match(val)) {
              match = true;
            }
          } else if (typeof data[col] == "string") {
            if (data[col].match(val)) {
              match = true;
            }
          }
        }
      });

      if (match) {
        newData.push(data);
      }
    });

    this.setState({ newData });
  };

  createTableHeader = () => {
    if (this.props.data != undefined && this.props.data.length != 0) {
      let cols = Object.keys(this.props.data[0]);

      if (this.props.editable) {
        let tableHeader = (
          <tr>
            <th>
              <Formfield class={style.checkAll}>
                <Checkbox
                  name="deleteCheckAll"
                  checked={this.state.checked}
                  value={"c"}
                  onClick={(e) => {
                    this.setState({ checked: e.target.checked });

                    if (e.target.checked) {
                      this.handleChecks(undefined, true);
                    } else {
                      this.handleChecks(undefined, false);
                    }
                  }}
                />
              </Formfield>
            </th>
            {cols.map((name) => {
              if (name === "id" || name === "userID") {
                return undefined;
              } else {
                return (
                  <th>
                    <SortIcon
                      colname={name}
                      desc={this.sortDescending}
                      asc={this.sortAscending}
                    />
                  </th>
                );
              }
            })}
          </tr>
        );

        return tableHeader;
      } else {
        let tableHeader = (
          <tr>
            {cols.map((name) => {
              if (name === "id" || name === "userID") {
                return undefined;
              } else {
                return <th>{name}</th>;
              }
            })}
          </tr>
        );

        return tableHeader;
      }
    } else {
      let tableHeader = (
        <tr>
          <th>Keine Messungen vorhanden</th>
        </tr>
      );
      return tableHeader;
    }
  };

  handleChecks = (val, checkAll) => {
    let checkboxes = document.getElementsByName("deleteCheck");
    let checkList = this.state.checkList;

    if (checkAll != undefined) {
      if (checkAll) {
        checkboxes.forEach((cb) => {
          if (!checkList.includes(cb.value)) {
            checkList.push(cb.value);
          }
        });
      } else if (!checkAll) {
        checkList = [];
      }
    }

    if (val != undefined) {
      if (checkList.includes(val)) {
        var index = checkList.indexOf(val);
        if (index !== -1) {
          checkList.splice(index, 1);
        }
      } else {
        checkList.push(val.toString());
      }
    }

    this.setState({ checkList });
  };

  checkAll = () => {
    let checkboxes = document.getElementsByName("deleteCheck");
    let checkList = this.state.checkList;

    if (checkList.length > 0) {
      checkboxes.forEach((cb) => {
        if (checkList.includes(cb.value)) {
          cb.checked = true;
        }
      });
    } else {
      if (this.state.checked === true) {
        this.setState({ checked: false });
      }
      let multiCheck = document.getElementsByName("deleteCheckAll");
      multiCheck.checked = false;
      checkboxes.forEach((cb) => {
        cb.checked = false;
      });
    }
  };

  checkDelete = () => {
    let checkboxes = document.getElementsByName("deleteCheck");

    checkboxes.forEach((cb) => {
      if (cb.checked) {
        this.props.delete(cb.value);
      }
    });

    this.setState({ checkList: [] });
  };

  createTableBody = (page) => {
    if (this.state.data != undefined) {
      let indexEnd = page * this.props.pageSize;
      let indexStart = indexEnd - this.props.pageSize;

      let pageData = this.state.data.slice(indexStart, indexEnd);

      if (this.props.editable) {
        let tableBody = (
          <tbody>
            {pageData.map((row) => {
              return (
                <tr>
                  <td>
                    <div class={style.tdIconContainer}>
                      <Button
                        onClick={() =>
                          this.props.clickEdit(row[this.props.idKey])
                        }
                      >
                        <List.ItemGraphic
                          class={`${"mdc-theme--primary"} ${style.tdIcon}`}
                        >
                          edit
                        </List.ItemGraphic>
                      </Button>
                      <Formfield>
                        <Checkbox
                          name="deleteCheck"
                          value={row[this.props.idKey]}
                          onClick={(e) => {
                            this.handleChecks(
                              row[this.props.idKey].toString(),
                              undefined
                            );
                          }}
                        />
                      </Formfield>
                    </div>
                  </td>
                  {Object.keys(row).map((key) => {
                    if (key === "id" || key === "userID") {
                      return undefined;
                    } else {
                      return <td>{row[key]}</td>;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        );
        return tableBody;
      } else {
        let tableBody = (
          <tbody>
            {pageData.map((row) => (
              <tr>
                {Object.keys(row).map((key) => (
                  <td>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        );
        return tableBody;
      }
    }
  };

  disableButtons = () => {
    let totalPage = this.getPageCount();
    let currentPage = this.state.page;

    if (totalPage == 1) {
      this.setState({ backBtnDisabled: true });
      this.setState({ forwardBtnDisabled: true });
    } else {
      currentPage == 1
        ? this.setState({ backBtnDisabled: true })
        : this.setState({ backBtnDisabled: false });
      currentPage == totalPage
        ? this.setState({ forwardBtnDisabled: true })
        : this.setState({ forwardBtnDisabled: false });
    }
  };

  lowerPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  increasePage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  createPageCounter = () => {
    if (this.state.data != undefined) {
      let pageCount = `${this.state.page}/${this.getPageCount()}`;

      return pageCount;
    }
  };

  getPageCount = () => {
    if (this.state.data != undefined) {
      let pageCount;
      if (this.state.data.length == this.props.pageSize) {
        pageCount = "1";
      }
      if (this.state.data.length < this.props.pageSize) {
        pageCount = "1";
      }
      if (this.state.data.length > this.props.pageSize) {
        pageCount = (this.props.data.length / this.props.pageSize + 1)
          .toString()
          .split(".")[0];
      }

      return pageCount;
    }
  };

  createBtn = (pageNumber) => {
    if (pageNumber == this.state.page) {
      return (
        <div class={style.btnSelected} onClick={() => this.setPage(pageNumber)}>
          {pageNumber}
        </div>
      );
    } else {
      return (
        <div class={style.btn} onClick={() => this.setPage(pageNumber)}>
          {pageNumber}
        </div>
      );
    }
  };

  disableBackBtn = () => {
    let currentPage = this.state.page;

    if (currentPage == 1) {
      return true;
    } else {
      return false;
    }
  };

  disableForwardBtn = () => {
    let totalPage = this.getPageCount();
    let currentPage = this.state.page;

    if (currentPage == totalPage) {
      return true;
    } else {
      return false;
    }
  };

  createTablePagination = () => {
    if (this.state.data != undefined && this.state.data.length != 0) {
      let pageNumbers = [];

      for (var i = 0; i < parseInt(this.getPageCount(), 10); i++) {
        pageNumbers.push(i + 1);
      }

      let pagination = (
        <div class={style.paginationBar}>
          <div class={style.btn} disabled={true}>
            {this.createPageCounter()}
          </div>
          <button
            class={style.btn}
            onClick={this.lowerPage}
            disabled={this.disableBackBtn()}
          >
            <i
              class={`${"material-icons"} ${style.btnIcon}`}
              aria-hidden="true"
            >
              chevron_left
            </i>
          </button>
          {pageNumbers.map((pageNumber) => this.createBtn(pageNumber))}
          <button
            class={style.btn}
            onClick={this.increasePage}
            disabled={this.disableForwardBtn()}
          >
            <i
              class={`${"material-icons"} ${style.btnIcon}`}
              aria-hidden="true"
            >
              chevron_right
            </i>
          </button>
        </div>
      );

      return pagination;
    }
  };

  render() {
    return (
      <div>
        <Menu
          search={this.search}
          showDialog={this.props.showDialog}
          showDelete={this.state.showDelete}
          checkDelete={this.checkDelete}
        />
        <table>
          {this.createTableHeader()}
          {this.createTableBody(this.state.page)}
        </table>
        {this.createTablePagination()}
      </div>
    );
  }
}
