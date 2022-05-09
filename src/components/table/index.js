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

    this.setState({ subTableIndex: 7 });
    this.setState({ colsHidden: ["id", "Id", "userID"] });

    this.setState({ collapseList: {} });

    this.setState({ filterParams: [] });
    this.getPageSize();

    this.setState({ pages: {} });
    this.setPages();
    this.getCollapseList();
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
    this.collapseAll();
  };

  getCollapseList = () => {
    let collapseList = this.state.collapseList;

    if (this.props.data !== undefined) {
      this.props.data.forEach((d) => {
        collapseList[d[this.props.idKey]] = false;
      });
      this.setState({ collapseList });
    }
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

  setPages = () => {
    let data = this.props.data;
    let pageSize = this.props.pageSize;

    let pageCount = Math.ceil(data.length / pageSize);

    for (let i = 1; i <= pageCount; i++) {}
  };

  setPage = (page) => {
    if (this.state.page !== page) {
      this.setState({ page });
    }
  };

  getData = () => {
    let sortParams = this.state.sortParams;
    let filterParams = this.state.filterParams;
    let data = this.props.data;

    if (sortParams !== undefined) {
      if (sortParams.dir) {
        data = this.sortDescending(data, sortParams.key);
      } else {
        data = this.sortAscending(data, sortParams.key);
      }
    }

    filterParams.forEach((filter) => {
      if (filter.operator === 0) {
        data = this.search(filter.val, data, filter.col);
      } else if (filter.operator === 1) {
        data = this.searchLesserThan(filter.val, data, filter.col);
      } else if (filter.operator === 2) {
        data = this.searchGreaterThan(filter.val, data, filter.col);
      }
    });

    return data;
  };

  sortDescending = (data, key) => {
    let type = typeof data[0][key];
    if (type === "string") {
      data.sort((a, b) => a[key].localeCompare(b[key]));
    } else if (type === "number") {
      data.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
    } else if (type === "object") {
      data.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
    }

    return data;
  };

  sortAscending = (data, key) => {
    let type = typeof data[0][key];

    if (type === "string") {
      data.sort((a, b) => b[key].localeCompare(a[key]));
    } else if (type === "number") {
      data.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
    } else if (type === "object") {
      data.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
    }

    return data;
  };

  searchGreaterThan = (val, data, col) => {
    let type = typeof data[0][col];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      data.forEach((obj) => {
        let match = false;

        if (obj[col] > parseInt(val, 10)) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    } else if (type === "object") {
      data.forEach((obj) => {
        let match = false;

        if (obj[col] > val) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  searchLesserThan = (val, data, col) => {
    let type = typeof data[0][col];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      data.forEach((obj) => {
        let match = false;

        if (obj[col] < parseInt(val, 10)) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    } else if (type === "object") {
      data.forEach((obj) => {
        let match = false;

        if (obj[col] < val) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  search = (val, data, col) => {
    let type = typeof data[0][col];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      val = parseInt(val, 10);

      data.forEach((obj) => {
        let match = false;

        if (obj[col] === val) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    } else if (type === "string") {
      data.forEach((obj) => {
        let match = false;

        if (obj[col].match(val)) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    } else if (type === "object") {
      data.forEach((obj) => {
        let match = false;
        if (obj[col].toDateString() === val.toDateString()) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  setSortParams = (dir, key) => {
    this.setState({ sortParams: {} });
    this.setState({ sortParams: { ...this.sortParams, dir, key } });
  };

  getTableHeadStyle = (name) => {
    if (typeof this.props.data[0][name] === "string") {
      return style.alignLeft;
    } else if (typeof this.props.data[0][name] === "number") {
      return style.alignRight;
    } else if (typeof this.props.data[0][name] === "object") {
      return style.alignLeft;
    }
  };

  createSubTableHeader = (id) => {
    let cols = this.getRangeList(this.state.subTableIndex, this.getColCount());
    let divider;

    let tableHeader = (
      <tr>
        {cols.map((name) => {
          if (name === cols[0]) {
            divider = false;
          } else {
            divider = true;
          }
          if (this.state.colsHidden.includes(name)) {
            return undefined;
          }

          return (
            <th>
              <SortIcon
                colname={name}
                onClickSort={this.setSortParams}
                alignment={this.getTableHeadStyle(name)}
                id={id + name}
                divider={divider}
              />
            </th>
          );
        })}
      </tr>
    );

    return tableHeader;
  };

  createTableHeader = () => {
    let divider = true;
    if (this.props.data !== undefined && this.props.data.length !== 0) {
      let cols = this.getRangeList(0, this.state.subTableIndex);
      if (this.props.editable) {
        let tableHeader = (
          <tr>
            <th class={style.headerCellContainer}>
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
              if (this.state.colsHidden.includes(name)) {
                return undefined;
              }
              return (
                <th>
                  <SortIcon
                    colname={name}
                    onClickSort={this.setSortParams}
                    alignment={this.getTableHeadStyle(name)}
                    id={name}
                    divider={divider}
                  />
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
            if (this.state.colsHidden.includes(name)) {
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
        <th>Keine {this.props.title} vorhanden</th>
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

  getTableDataStyle = (data, key) => {
    if (typeof data[key] === "number") {
      return style.alignRight;
    }
    return style.alignLeft;
  };

  getColCount = () => {
    let cols = Object.keys(this.props.data[0]);

    return cols.length;
  };

  getCols = () => {
    if (this.props.data !== undefined) {
      let cols = Object.keys(this.props.data[0]);
      let newCols = [];

      cols.forEach((col) => {
        if (!this.state.colsHidden.includes(col)) {
          newCols.push(col);
        }
      });

      return newCols;
    }

    return [];
  };

  getRangeList = (start, end) => {
    if (end === undefined) {
      end = this.getColCount();
    }
    let cols = Object.keys(this.props.data[0]);
    let newCols = [];

    for (let i = start; i < end; i++) {
      if (!this.state.colsHidden.includes(cols[i])) newCols.push(cols[i]);
    }
    return newCols;
  };

  renderSubTable = (id, row) => {
    let cols = this.getRangeList(this.state.subTableIndex, undefined);
    let colLength = this.getRangeList(0, this.state.subTableIndex).length + 1;

    return (
      <tr class={style.subTableRow} id={"subTableRow"}>
        <td colSpan={colLength} class={style.subTableData}>
          <div class={style.subTableContainer} id={id + "row"}>
            <div class={style.subTableTitleContainer}>
              <span class={style.subTableTitle}>
                {this.props.subTableTitle}
              </span>
            </div>
            <table class={style.subTable}>
              {this.createSubTableHeader(id)}
              <tr>
                {cols.map((key) => (
                  <td class={this.getTableDataStyle(row, key)}>{row[key]}</td>
                ))}
              </tr>
            </table>
          </div>
        </td>
      </tr>
    );
  };

  collapseAll = () => {
    let collList = this.state.collapseList;
    let keys = Object.keys(collList);

    keys.forEach((key) => {
      if (collList[key]) {
        this.unCollapse(key);
      } else if (!collList[key]) {
        this.collapse(key);
      }
    });
  };

  collapse = (id) => {
    let coll = document.getElementById(id + "row");
    let collIcon = document.getElementById(id + "icon");

    if (coll) {
      coll.style.maxHeight = null;
      collIcon.innerHTML = "arrow_drop_down";
    }
  };

  unCollapse = (id) => {
    let coll = document.getElementById(id + "row");
    let collIcon = document.getElementById(id + "icon");

    if (coll) {
      coll.style.maxHeight = coll.scrollHeight + "px";
      collIcon.innerHTML = "arrow_drop_up";
    }
  };

  addToCollapseList = (id) => {
    let collList = this.state.collapseList;
    let keys = Object.keys(collList);

    keys.forEach((key) => {
      if (parseInt(key, 10) === id) {
        if (collList[id]) {
          collList[id] = false;
        } else if (!collList[id]) {
          collList[id] = true;
        }
      } else {
        collList[key] = false;
      }
    });

    this.setState({ collapseList: collList });
  };

  getCollapseBtn = (key) => {
    if (this.getColCount() > this.state.subTableIndex) {
      return (
        <button
          onCLick={() => this.addToCollapseList(key)}
          class={style.menuBtn}
        >
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
    let cols = this.getRangeList(0, this.state.subTableIndex);
    return (
      <tr id={key + "mainRow"}>
        <td id={"tableData"} class={style.btnsData}>
          <div class={style.tdBtnsContainer}>
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
            {this.getCollapseBtn(key)}
          </div>
        </td>
        {Object.keys(row).map((key) => {
          if (!cols.includes(key)) {
            return undefined;
          }
          if (key !== "Datum") {
            return <td class={this.getTableDataStyle(row, key)}>{row[key]}</td>;
          }
          let date = row[key];
          let day = date.getDay() + 1;
          if (day < 10) {
            day = "0" + day;
          }
          let month = date.getMonth() + 1;
          if (month < 10) {
            month = "0" + month;
          }
          let year = date.getFullYear();

          let output = month + "-" + day + "-" + year;
          return <td class={this.getTableDataStyle(row, key)}>{output}</td>;
        })}
      </tr>
    );
  };

  createTableBody = () => {
    let page = this.state.page;
    let data = this.getData();
    let pageSize = this.getPageSize();

    if (data !== undefined) {
      let indexEnd = page * pageSize;
      let indexStart = indexEnd - pageSize;

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
    // let pageSize = this.props.pageSize;

    let tables = document.getElementsByTagName("table");

    let tableCellHeight = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--global-table-cell-height");

    tableCellHeight = parseInt(tableCellHeight.replace("px", ""), 10);

    let topBarHeight = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--global-header-height");
    topBarHeight = parseInt(topBarHeight.replace("px", ""), 10);

    let mrgn = getComputedStyle(document.documentElement).getPropertyValue(
      "--global-page-mrgn"
    );
    mrgn = parseInt(mrgn.replace("px", ""), 10);

    let headerHeight = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--global-header-size");
    headerHeight = parseInt(headerHeight.replace("px", ""), 10);

    let pageHeaderHeight = document.getElementsByClassName("pageLarge");

    if (pageHeaderHeight.length === 0) {
      pageHeaderHeight = document.getElementsByClassName("pageSmall");
    }

    let vpHeight =
      window.innerHeight -
      (190 + topBarHeight + mrgn + headerHeight + tableCellHeight * 3);

    let pageSize = Math.floor(vpHeight / tableCellHeight);

    return pageSize;
  };

  getPageCount = () => {
    if (this.state.data !== undefined) {
      let pageCount;
      let pageSize = this.getPageSize();
      if (this.state.data.length === pageSize) {
        pageCount = 1;
      }
      if (this.state.data.length < pageSize) {
        pageCount = 1;
      }
      if (this.state.data.length > pageSize) {
        pageCount = (this.props.data.length / pageSize + 1)
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

    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", this.props.title + ".csv");
    document.body.appendChild(link);

    link.click();
  };

  getSelectedCount = () => this.state.checkList.length;

  getFilters = (id, col, operator, val) => {
    let filterParams = this.state.filterParams;
    let filterObj = { id, col, operator, val };
    let idList = [];

    filterParams.forEach((filter) => {
      idList.push(filter.id);
    });

    if (idList.includes(id)) {
      filterParams.forEach((filter) => {
        if (filter.id === id) {
          filter.col = col;
          filter.operator = operator;
          filter.val = val;
        }
      });
    } else {
      filterParams.push(filterObj);
    }

    this.setState({ filterParams });
  };

  deleteFilterParams = (id) => {
    let filterParams = this.state.filterParams;

    filterParams.forEach((filter) => {
      if (filter.id === id) {
        let index = filterParams.indexOf(filter);
        if (index !== -1) {
          filterParams.splice(index, 1);
        }
      }
    });

    this.setState({ filterParams });
  };

  render() {
    return (
      <div class={style.tableContentContainer}>
        <Menu
          setSearchVal={this.setSearchVal}
          showDialog={this.props.showDialog}
          showDelete={this.state.showDelete}
          checkDelete={this.checkDelete}
          count={this.getSelectedCount()}
          exportFile={this.exportFile}
          title={this.props.title}
          cols={this.getCols()}
          data={this.props.data}
          getFilters={this.getFilters}
          deleteFilterParams={this.deleteFilterParams}
        />
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
