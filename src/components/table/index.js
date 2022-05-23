import { h, Component } from "preact";
import style from "./style";
import Checkbox from "preact-material-components/Checkbox";
import Formfield from "preact-material-components/FormField";
import "preact-material-components/Checkbox/style.css";
import SortIcon from "./sortIcon";
import Menu from "./menu";

export default class Table extends Component {
  componentWillMount = () => {
    // set initial page of pagination
    this.setPage(1);

    // Data set as state because props cant be changed
    this.setState({ data: this.props.data });

    this.setState({ containerAddSearch: style.searchContainer });

    // If true, delete container will be shown
    this.setState({ showDelete: false });

    // If true, check all checkboxes
    this.setState({ checked: false });

    // List of checked checkboxes
    this.setState({ checkList: [] });

    // at which column begins the subtable
    this.getSubtableIndex();

    // columns  that shall not be displayed
    this.setState({ colsHidden: ["id", "Id", "userID", "UserId"] });

    // List if rows that are open (uncollapsed)
    this.setState({ collapseList: {} });

    // List to filter the data
    this.setState({ filterParams: [] });

    // Count of rows per page
    this.getPageSize();

    // Fills collapseList with all calumns and set them to false
    this.getCollapseList();

    // Eventlistener for resizing
    window.addEventListener("resize", this.handleWindowResize);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.handleWindowResize);
  };

  // To handle viewport resizes
  handleWindowResize = (event) => {
    this.getSubtableIndex();
  };

  // at which column begins the subtable
  // subTableIndex : 4 === 2 columns
  getSubtableIndex = () => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    let topCount = 4;

    if (this.props.title === "Benutzer") {
      topCount = 2;
    }

    let index = Math.ceil(vw / 140);

    if (index <= topCount) {
      this.setState({ subTableIndex: topCount });
    } else {
      this.setState({ subTableIndex: index - 1 });
    }
  };

  // Weiss nicht warum... sollte auch geändert werden
  componentDidMount = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
  };

  // When new data comes in (tabelle geupdated)
  componentDidUpdate = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }

    // show the deleteContainer if showDelete is true
    this.toggleShowDelete();

    // open or collapse the row that are true in collapseList
    this.collapseAll();
  };

  // Create a list if objects with row id and bool
  // true = open(uncollapsed)
  getCollapseList = () => {
    let collapseList = this.state.collapseList;

    if (this.props.data !== undefined) {
      this.props.data.forEach((d) => {
        collapseList[d[this.props.idKey]] = false;
      });
      this.setState({ collapseList });
    }
  };

  // if something is in checklist show delete container
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

  // Sets page of pagination
  setPage = (page) => {
    if (this.state.page !== page) {
      this.setState({ page });
    }
  };

  // returs the data, filtered data if FilterParams isnt empty
  getData = () => {
    let sortParams = this.state.sortParams;
    let filterParams = this.state.filterParams;
    let data = this.props.data;

    // Auf oder Absteigend sortieren
    if (sortParams !== undefined) {
      if (sortParams.dir) {
        data = this.sortDescending(data, sortParams.key);
      } else {
        data = this.sortAscending(data, sortParams.key);
      }
    }

    // apply every filter to data
    filterParams.forEach((filter) => {
      if (filter.operator === 0) {
        data = this.search(filter.val, data, filter.chosenIndex);
      } else if (filter.operator === 1) {
        data = this.searchLesserThan(filter.val, data, filter.chosenIndex);
      } else if (filter.operator === 2) {
        data = this.searchGreaterThan(filter.val, data, filter.chosenIndex);
      }
    });

    return data;
  };

  sortDescending = (data, key) => {
    let type = typeof data[0][key];
    if (type === "string") {
      data.sort((a, b) => a[key].localeCompare(b[key]));
    } else if (type === "number" || type === "boolean") {
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
    } else if (type === "number" || type === "boolean") {
      data.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
    } else if (type === "object") {
      data.sort((a, b) => (a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0));
    }

    return data;
  };

  // return a list with every row, where the cellvalue is greater than val
  searchGreaterThan = (val, data, chosenIndex) => {
    let cols = this.getCols();
    let type = typeof data[0][cols[chosenIndex]];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      val = parseFloat(val, 10);

      data.forEach((obj) => {
        let match = false;

        if (obj[cols[chosenIndex]] > val) {
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

        let date = obj[cols[chosenIndex]];

        if (date.getTime() > val.getTime()) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  // return a list with every row, where the cellvalue is smaller than val
  searchLesserThan = (val, data, chosenIndex) => {
    let cols = this.getCols();
    let type = typeof data[0][cols[chosenIndex]];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      data.forEach((obj) => {
        val = parseFloat(val, 10);

        let match = false;

        if (obj[cols[chosenIndex]] < val) {
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

        let date = obj[cols[chosenIndex]];

        if (date.getTime() < val.getTime()) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  // returns list of rows, where cellvalue matches val
  search = (val, data, chosenIndex) => {
    let cols = this.getCols();

    let type = typeof data[0][cols[chosenIndex]];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      val = parseFloat(val, 10);

      data.forEach((obj) => {
        let match = false;

        if (obj[cols[chosenIndex]] === val) {
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

        if (obj[cols[chosenIndex]].match(val)) {
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
        let date = obj[cols[chosenIndex]];

        if (date.getTime() === val.getTime()) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    } else if (type === "boolean") {
      data.forEach((obj) => {
        let match = false;
        if (obj[cols[chosenIndex]] === val) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  // Params for sorting, descending, ascending and the column
  setSortParams = (dir, key) => {
    this.setState({ sortParams: {} });
    this.setState({ sortParams: { ...this.sortParams, dir, key } });
  };

  // text alignment in table header
  getTableHeadStyle = (name) => {
    if (typeof this.props.data[0][name] === "string") {
      return style.alignLeft;
    } else if (typeof this.props.data[0][name] === "number") {
      return style.alignRight;
    } else if (typeof this.props.data[0][name] === "object") {
      return style.alignLeft;
    } else if (typeof this.props.data[0][name] === "boolean") {
      return style.alignRight;
    }
  };

  // create the table header of the suntable
  createSubTableHeader = (id) => {
    let cols = this.getRangeList(this.state.subTableIndex, this.getColCount());
    let divider;

    let tableHeader = (
      // divider = small line between header cells
      <tr class={style.subTableContentRow}>
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
            <th class={style.subTableHeaderCell}>
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

  getDeleteCheckboxForHeader = () => {
    if (this.props.deletable) {
      return (
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
      );
    }
  };

  // creates header row of main table
  createTableHeader = () => {
    let divider = true;
    if (this.props.data !== undefined && this.props.data.length !== 0) {
      let cols = this.getRangeList(0, this.state.subTableIndex);
      if (this.props.editable) {
        let tableHeader = (
          <tr>
            <th class={`${style.headerCellContainer} ${style.tableFixHead}`}>
              {this.getDeleteCheckboxForHeader()}
            </th>
            {cols.map((name) => {
              if (this.state.colsHidden.includes(name)) {
                return undefined;
              }
              return (
                <th class={style.subTableRow}>
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
      return tableHeader;
    }

    // Table if no data are available
    let tableHeader = (
      <tr>
        <th>Keine {this.props.title} vorhanden</th>
      </tr>
    );
    return tableHeader;
  };

  // check every checkbox
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

  // delete every element in checkList from the data and empty List
  // delete comes from view and is the API Request to delete data
  checkDelete = () => {
    let checkList = this.state.checkList;

    checkList.forEach((id) => {
      this.props.delete(id);
    });

    this.setState({ checkList: [] });
  };

  // Checks if an element is in checklist
  getCheckState = (id) => {
    let checkList = this.state.checkList;

    return checkList.includes(id);
  };

  // adds or removes element from CheckList
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

  // textalignment of cells
  getTableDataStyle = (data, key) => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    if (vw > 768) {
      if (typeof data[key] === "number" || typeof data[key] === "boolean") {
        return style.alignRight;
      }
    }

    return style.alignLeft;
  };

  // returns count of columns
  getColCount = () => {
    let cols = Object.keys(this.props.data[0]);

    return cols.length;
  };

  // returns the columnnames
  getCols = () => {
    if (this.props.data !== undefined && this.props.data.length !== 0) {
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

  // Returns the columnnames in a range to divide them into main- and subtable
  getRangeList = (start, end) => {
    if (end === undefined) {
      end = this.getColCount();
    }
    let cols = Object.keys(this.props.data[0]);
    let newCols = [];

    for (let i = start; i < end; i++) {
      if (!this.state.colsHidden.includes(cols[i]) && cols[i] !== undefined)
        newCols.push(cols[i]);
    }
    return newCols;
  };

  // create subtable
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
              <tr class={style.subTableContentRow}>
                {cols.map((key) => {
                  if (row[key] === true) {
                    return (
                      <td
                        class={`${this.getTableDataStyle(row, key)} ${
                          style.subTableCell
                        }`}
                        id={id + key}
                      >
                        <i class={`${"material-icons"} ${style.trueIcon}`}>
                          check
                        </i>
                      </td>
                    );
                  }

                  if (row[key] === false) {
                    return (
                      <td
                        class={`${this.getTableDataStyle(row, key)} ${
                          style.subTableCell
                        }`}
                        id={id + key}
                      >
                        <i class={`${"material-icons"} ${style.falseIcon}`}>
                          clear
                        </i>
                      </td>
                    );
                  }

                  return (
                    <td
                      class={`${this.getTableDataStyle(row, key)} ${
                        style.subTableCell
                      }`}
                      id={id + key}
                    >
                      {row[key]}
                    </td>
                  );
                })}
              </tr>
            </table>
          </div>
        </td>
      </tr>
    );
  };

  // Opens(uncollapse) or closes(collape) the rows determined by bools in collapseList
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

  // close row (Collapse)
  collapse = (id) => {
    let coll = document.getElementById(id + "row");
    let collIcon = document.getElementById(id + "icon");

    if (coll && collIcon) {
      coll.style.maxHeight = null;
      collIcon.innerHTML = "arrow_drop_down";
    }
  };

  // open row (Uncollapse)
  unCollapse = (id) => {
    let coll = document.getElementById(id + "row");
    let collIcon = document.getElementById(id + "icon");

    if (coll) {
      coll.style.maxHeight = coll.scrollHeight + "px";
      collIcon.innerHTML = "arrow_drop_up";
    }
  };

  // adds or removes element from collapseList
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

  // Button that triggers collapse. With arrow that shows if collapsed or not
  getCollapseBtn = (key) => {
    if (this.getColCount() > this.state.subTableIndex) {
      return (
        <button
          onCLick={() => this.addToCollapseList(key)}
          class={style.editBtnColl}
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

  collapseTdBtnsContainer = (key) => {
    let coll = document.getElementById(key + "tdBtnsContainer");

    if (coll.style.maxHeight === "0px" || coll.style.maxHeight === "") {
      coll.style.maxHeight = "120px";
      coll.style.display = "flex";
    } else {
      coll.style.maxHeight = "0px";
      coll.style.display = "none";
    }
  };

  getDeleteCheckboxForRow = (key) => {
    if (this.props.deletable) {
      return (
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
      );
    }
  };

  getTdBtnsContainer = (key) => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    let content;

    if (vw < 768) {
      content = (
        <div>
          <button
            onClick={() => {
              this.collapseTdBtnsContainer(key);
            }}
            class={style.editBtn}
          >
            <i
              class={`${"material-icons"} ${style.editIcon}`}
              aria-hidden="true"
            >
              more_vert
            </i>
          </button>
          <div class={style.tdBtnsContainer} id={key + "tdBtnsContainer"}>
            {/* Edit Button */}
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

            {/* CheckBox */}
            {this.getDeleteCheckboxForRow(key)}
            {this.getCollapseBtn(key)}
          </div>
        </div>
      );
    } else {
      content = (
        <div class={style.tdBtnsContainer}>
          {/* Edit Button */}
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

          {/* CheckBox */}
          {this.getDeleteCheckboxForRow(key)}
          {this.getCollapseBtn(key)}
        </div>
      );
    }

    return content;
  };

  // Table columns
  renderTableContent = (id, row) => {
    let cols = this.getRangeList(0, this.state.subTableIndex);

    return (
      <tr id={id + "mainRow"}>
        <td id={"tableData"} class={style.btnsData}>
          {this.getTdBtnsContainer(id)}
        </td>

        {/* create cells */}
        {Object.keys(row).map((key) => {
          if (!cols.includes(key)) {
            return undefined;
          }
          if (key === "Datum") {
            // format date
            let date = row[key];
            let day = date.getDate();
            if (day < 10) {
              day = "0" + day;
            }
            let month = date.getMonth() + 1;
            if (month < 10) {
              month = "0" + month;
            }
            let year = date.getFullYear();

            let output = month + "-" + day + "-" + year;
            return (
              <td id={id + key} class={this.getTableDataStyle(row, key)}>
                {output}
              </td>
            );
          }
          if (row[key] === true) {
            return (
              <td id={id + key} class={this.getTableDataStyle(row, key)}>
                <i class={`${"material-icons"} ${style.trueIcon}`}>check</i>
              </td>
            );
          }

          if (row[key] === false) {
            return (
              <td id={id + key} class={this.getTableDataStyle(row, key)}>
                <i class={`${"material-icons"} ${style.falseIcon}`}>clear</i>
              </td>
            );
          }

          return (
            <td id={id + key} class={this.getTableDataStyle(row, key)}>
              {row[key]}
            </td>
          );
        })}
      </tr>
    );
  };

  // tablebody without rows
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
              {/* create tablerows */}
              {this.renderTableContent(key, row)}

              {/* create subtable */}
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

  // Displayes an which page the user is at. For Example: 1/4
  createPageCounter = () => {
    if (this.state.data !== undefined) {
      let pageCount = `${this.state.page}/${this.getPageCount()}`;

      return pageCount;
    }
  };

  // rows per page
  getPageSize = () => {
    let pageSize = this.props.pageSize;

    return pageSize;
  };

  // count of pages
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

  // Button to switch to another page with page number
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

  // Pagination backbutton disableing
  disableBackBtn = () => {
    let currentPage = this.state.page;

    return currentPage === 1;
  };

  // Pagination forwardbutonn disableing
  disableForwardBtn = () => {
    let totalPage = this.getPageCount();
    let currentPage = this.state.page;

    return currentPage === totalPage;
  };

  lastPage = () => {
    this.setState({ page: this.getPageCount() });
  };

  firstPage = () => {
    this.setState({ page: 1 });
  };

  // create pagination
  createTablePagination = () => {
    if (this.state.data !== undefined && this.state.data.length !== 0) {
      let pageNumbers = [];

      for (let i = 0; i < parseInt(this.getPageCount(), 10); i++) {
        pageNumbers.push(i + 1);
      }

      let pagination = (
        <div class={style.paginationBar}>
          <button
            class={`${"material-icons"} ${style.btn}`}
            onClick={this.firstPage}
            disabled={this.disableBackBtn()}
          >
            <i
              class={`${"material-icons"} ${style.btnIcon}`}
              aria-hidden="true"
            >
              first_page
            </i>
          </button>

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
          <div class={style.btn} disabled>
            {this.createPageCounter()}
          </div>

          {/* 
          {pageNumbers.map((pageNumber) => (
            <div class={style.pageNumberBtn}>{this.createBtn(pageNumber)}</div>
          ))} */}

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

          <button
            class={`${"material-icons"} ${style.btn}`}
            onClick={this.lastPage}
            disabled={this.disableForwardBtn()}
          >
            <i
              class={`${"material-icons"} ${style.btnIcon}`}
              aria-hidden="true"
            >
              last_page
            </i>
          </button>
        </div>
      );

      return pagination;
    }
  };

  // export data to csv with filters applied
  exportFile = () => {
    let data = this.getData();
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

  // How many checkboxes are checked
  getSelectedCount = () => this.state.checkList.length;

  // add Filter to filterParams
  addFilter = () => {
    let filterList = this.state.filterParams;
    let id;
    let i = 0;

    let loop = true;
    let match = false;

    // get Unique Id for Filter
    while (loop) {
      if (filterList.length === 0) {
        loop = false;
        id = 0;
      }

      filterList.forEach((filter) => {
        if (i + "filter" === filter.id) {
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

    id = id + "filter";
    let filter = { id, chosenIndex: 0, operator: 0, val: "" };

    this.setState({ filterParams: [...this.state.filterParams, filter] });
  };

  // update existing filter
  updateFilter = (id, chosenIndex, operator, val) => {
    let filterParams = this.state.filterParams;
    let filterObj = { id, chosenIndex, operator, val };
    let idList = [];

    filterParams.forEach((filter) => {
      idList.push(filter.id);
    });

    if (idList.includes(id)) {
      filterParams.forEach((filter) => {
        if (filter.id === id) {
          if (chosenIndex !== undefined) {
            filter.chosenIndex = chosenIndex;
          }

          if (operator !== undefined) {
            filter.operator = operator;
          }

          if (val !== undefined) {
            filter.val = val;
          }
        }
      });
    } else {
      filterParams.push(filterObj);
    }

    this.setState({ filterParams });
  };

  // delete filter from filterParams
  deleteFilter = (id) => {
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

  // render table
  render() {
    return (
      <div class={style.tableContentContainer}>
        {/* Menu is the row above the tableheader, with add- and exportbutton and filter-options */}
        <Menu
          showDialog={this.props.showDialog}
          showDelete={this.state.showDelete}
          checkDelete={this.checkDelete}
          count={this.getSelectedCount()}
          exportFile={this.exportFile}
          title={this.props.title}
          cols={this.getCols()}
          data={this.props.data}
          updateFilter={this.updateFilter}
          deleteFilter={this.deleteFilter}
          filters={this.state.filterParams}
          addFilter={this.addFilter}
        />
        <div class={style.tableContainer}>
          <table class={style.table}>
            {this.createTableHeader()}
            {this.createTableBody()}
          </table>
        </div>
        <div class={style.footerBar}>{this.createTablePagination()}</div>
      </div>
    );
  }
}
