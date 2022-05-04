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

    this.setState({ newData: this.props.data });

    this.getPageSize();
  };

  componentDidMount = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }

    // if (this.state.newData !== this.props.data) {
    //   this.setState({ data: this.state.newData });
    // }
  };

  componentDidUpdate = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }

    // this.checkAll();
    this.toggleShowDelete();
  };

  toggleShowDelete = () => {
    let showDelete;

    if (this.state.checkList.length === 0) {
      showDelete = false;
    } else if (this.state.checkList.length > 0) {
      showDelete = true;
    }

    if (showDelete !== this.state.showDelete) {
      this.setState({ showDelete });
    }
  };

  setPage = (page) => {
    if (this.state.page !== page) {
      this.setState({ page });
    }
  };

  sortDescending = (data, key) => {
    if (typeof data[0][key] === "string") {
      data.sort((a, b) => a[key].localeCompare(b[key]));
    } else if (typeof data[0][key] === "number") {
      data.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
    }

    return data;
  };

  sortAscending = (data, key) => {
    if (typeof data[0][key] === "string") {
      data.sort((a, b) => b[key].localeCompare(a[key]));
    } else if (typeof data[0][key] === "number") {
      data.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
    }

    return data;
  };

  search = (val, data) => {
    let newData = [];

    let cols = Object.keys(data[0]);

    data.forEach((obj) => {
      let match = false;
      cols.forEach((col) => {
        if (col !== "id" && col !== "userID" && col !== "Id") {
          if (typeof obj[col] === "number") {
            if (obj[col].toString().match(val)) {
              match = true;
            }
          } else if (typeof obj[col] === "string") {
            if (obj[col].match(val)) {
              match = true;
            }
          }
        }
      });

      if (match) {
        newData.push(obj);
      }
    });

    return newData;
  };

  setSortParams = (dir, key) => {
    this.setState({ sortParams: {} });
    this.setState({ sortParams: { ...this.sortParams, dir, key } });
  };

  createTableHeader = () => {
    if (this.props.data !== undefined && this.props.data.length !== 0) {
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
                    this.checkAll(e.target.checked);
                  }}
                />
              </Formfield>
            </th>
            {cols.map((name) => {
              if (
                name === "Id" ||
                name === "userID" ||
                name === "collapse" ||
                name === "id"
              ) {
                return undefined;
              }

              return (
                <th>
                  <SortIcon colname={name} onClickSort={this.setSortParams} />
                </th>
              );
            })}
          </tr>
        );

        return tableHeader;
      }
      let tableHeader = (
        <tr>
          {cols.map((name) => {
            if (
              name === "Id" ||
              name === "userID" ||
              name === "collapse" ||
              name === "id"
            ) {
              return undefined;
            }
            return <th>{name}</th>;
          })}
        </tr>
      );

      return tableHeader;
    }
    let tableHeader = (
      <tr>
        <th>Keine Messungen vorhanden</th>
      </tr>
    );
    return tableHeader;
  };

  checkAll = (checkAll) => {
    let checkList = this.state.checkList;

    if (checkAll) {
      this.props.data.forEach((obj) => {
        if (!checkList.includes(obj[this.props.idKey])) {
          this.addToCheckList(obj[this.props.idKey]);
        }
      });
    } else {
      checkList = [];
    }

    this.setState({ checkList });
  };

  checkDelete = () => {
    let checkList = this.state.checkList;

    checkList.forEach((id) => {
      this.props.delete(id);
    });

    this.setState({ checkList: [] });
  };

  setSearchVal = (val) => {
    this.setState({ searchVal: val });
  };

  getData = () => {
    let sortParams = this.state.sortParams;
    let searchVal = this.state.searchVal;
    let data = this.props.data;

    if (sortParams !== undefined) {
      if (sortParams.dir) {
        data = this.sortDescending(data, sortParams.key);
      } else {
        data = this.sortAscending(data, sortParams.key);
      }
    }

    if (searchVal !== undefined) {
      data = this.search(searchVal, data);
    }

    return data;
  };

  getCheckState = (id) => {
    let checkList = this.state.checkList;

    return checkList.includes(id);
  };

  addToCheckList = (id) => {
    let checkList = this.state.checkList;

    if (checkList.includes(id)) {
      let index = checkList.indexOf(id);
      if (index !== -1) {
        checkList.splice(index, 1);
      }
    } else {
      checkList.push(id);
    }
    this.setState({ checkList });
  };

  getTableRowStyle = (id) => {
    let checkList = this.state.checkList;

    if (checkList.includes(id)) {
      return style.rowSelected;
    }

    return undefined;
  };

  getEditIconStyle = (id) => {
    let checkList = this.state.checkList;

    if (checkList.includes(id)) {
      return style.editIconSelected;
    }

    return style.editIcon;
  };

  getEditBtnStyle = (id) => {
    let checkList = this.state.checkList;

    if (checkList.includes(id)) {
      return style.editBtnSelected;
    }

    return style.editBtn;
  };

  renderSubTable = (id, row) => {
    let cols = Object.keys(this.props.data[0]);

    let data = row.collapse;

    if (data !== undefined) {
      let tableHeaders = Object.keys(data);

      return (
        <tr class={style.subTableRow} id={"subTableRow"}>
          <td colSpan={cols.length} class={style.subTableData}>
            <div class={style.subTableContainer} id={id}>
              <table class={style.subTable}>
                <tr>
                  {tableHeaders.map((header) => (
                    <th>{header}</th>
                  ))}
                </tr>
                <tr>
                  {tableHeaders.map((key) => (
                    <td>{data[key]}</td>
                  ))}
                </tr>
              </table>
            </div>
          </td>
        </tr>
      );
    }

    return undefined;
  };

  collapse = (id) => {
    let coll = document.getElementById(id);
    let collIcon = document.getElementById(id + "icon");

    if (coll.style.maxHeight) {
      coll.style.maxHeight = null;
      collIcon.innerHTML = "arrow_drop_down";
    } else {
      coll.style.maxHeight = coll.scrollHeight + "px";
      collIcon.innerHTML = "arrow_drop_up";
    }
    this.getPageSize();
  };

  getCollapseBtn = (key, row) => {
    if (row.collapse !== undefined) {
      return (
        <button onCLick={() => this.collapse(key)} class={style.menuBtn}>
          <i
            class={`${"material-icons"} ${style.menuBtnIcon}`}
            aria-hidden="true"
            id={key + "icon"}
          >
            arrow_drop_down
          </i>
        </button>
      );
    }

    return undefined;
  };

  renderTableContent = (key, row) => {
    return (
      <tr>
        <td id={"tableData"}>
          <div class={style.tdIconContainer}>
            <button
              onClick={() => {
                this.props.clickEdit(key);
              }}
              class={style.editBtn}
            >
              <i
                class={`${"material-icons"} ${style.editIcon}`}
                aria-hidden="true"
              >
                edit
              </i>
            </button>
            <Formfield>
              <Checkbox
                name="deleteCheck"
                value={key}
                checked={this.getCheckState(key)}
                onChange={(e) => {
                  this.addToCheckList(key);
                }}
              />
            </Formfield>
            {this.getCollapseBtn(key, row)}
          </div>
        </td>
        {Object.keys(row).map((key) => {
          if (
            key === "Id" ||
            key === "userID" ||
            key === "collapse" ||
            key === "id"
          ) {
            return undefined;
          }
          return <td>{row[key]}</td>;
        })}
      </tr>
    );
  };

  createTableBody = () => {
    let page = this.state.page;
    let data = this.getData();
    if (data !== undefined) {
      let indexEnd = page * this.state.pageSize;
      let indexStart = indexEnd - this.state.pageSize;

      let pageData = data.slice(indexStart, indexEnd);

      if (this.props.editable) {
        let tableBody = pageData.map((row) => {
          let key = row[this.props.idKey];
          return (
            <tbody>
              {this.renderTableContent(key, row)}
              {this.renderSubTable(key, row)}
            </tbody>
          );
        });
        return tableBody;
      }
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
  };

  lowerPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  increasePage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  createPageCounter = () => {
    if (this.state.data !== undefined) {
      let pageCount = `${this.state.page}/${this.getPageCount()}`;

      return pageCount;
    }
  };

  getPageSize = () => {
    let maxHeight = window.innerHeight;
    let tableData = document.getElementById("tableData");
    let subTable = document.getElementById("subTableRow");

    if (tableData !== null) {
      let dataHeight = tableData.offsetHeight;
      let subTableHeight = subTable.offsetHeight;
    }

    this.setState({ pageSize: this.props.pageSize });
  };

  getPageCount = () => {
    if (this.state.data !== undefined) {
      let pageCount;
      if (this.state.data.length === this.state.pageSize) {
        pageCount = 1;
      }
      if (this.state.data.length < this.state.pageSize) {
        pageCount = 1;
      }
      if (this.state.data.length > this.state.pageSize) {
        pageCount = (this.props.data.length / this.state.pageSize + 1)
          .toString()
          .split(".")[0];

        pageCount = parseInt(pageCount, 10);
      }

      return pageCount;
    }
  };

  createBtn = (pageNumber) => {
    if (pageNumber === this.state.page) {
      return (
        <div class={style.btnSelected} onClick={() => this.setPage(pageNumber)}>
          {pageNumber}
        </div>
      );
    }
    return (
      <div class={style.btn} onClick={() => this.setPage(pageNumber)}>
        {pageNumber}
      </div>
    );
  };

  disableBackBtn = () => {
    let currentPage = this.state.page;

    return currentPage === 1;
  };

  disableForwardBtn = () => {
    let totalPage = this.getPageCount();
    let currentPage = this.state.page;

    return currentPage === totalPage;
  };

  createTablePagination = () => {
    if (this.state.data !== undefined && this.state.data.length !== 0) {
      let pageNumbers = [];

      for (let i = 0; i < parseInt(this.getPageCount(), 10); i++) {
        pageNumbers.push(i + 1);
      }

      let pagination = (
        <div class={style.paginationBar}>
          <div class={style.btn} disabled>
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

  exportFile = () => {
    let data = this.props.data;
    let cols = Object.keys(this.props.data[0]);

    let csvString = [
      [cols.map((col) => col)],
      ...data.map((obj) => [...cols.map((col) => obj[col])]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    csvString = "data:text/csv;charset=utf-8," + csvString;

    let encodedUri = encodeURI(csvString);
    // window.open(encodedUri);

    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", this.props.title + ".csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  };

  getSelectedCount = () => this.state.checkList.length;

  render() {
    return (
      <div>
        <div>
          <Menu
            setSearchVal={this.setSearchVal}
            showDialog={this.props.showDialog}
            showDelete={this.state.showDelete}
            checkDelete={this.checkDelete}
            count={this.getSelectedCount()}
            exportFile={this.exportFile}
            title={this.props.title}
          />
        </div>

        <div class={style.tableContainer}>
          <table>
            {this.createTableHeader()}
            {this.createTableBody()}
          </table>
        </div>
        <div class={style.footerBar}>{this.createTablePagination()}</div>
      </div>
    );
  }
}
