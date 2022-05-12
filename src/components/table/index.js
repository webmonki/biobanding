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
    // Anfangsseite für pagination
    this.setPage(1);

    // Daten als State weil props nicht verändert werden können
    this.setState({ data: this.props.data });

    this.setState({ containerAddSearch: style.searchContainer });

    // Wenn wahr wird Delete Container angezeigt
    this.setState({ showDelete: false });

    // Wenn wahr ist die Checkbox im TabellenKopf gechecked und alle anderen Checkboxes auch
    this.setState({ checked: false });

    // Liste für die gecheckten checkboxes
    this.setState({ checkList: [] });

    // Ab welche spalte die Untertabelle beginnen soll
    this.setState({ subTableIndex: 7 });

    // Spalten die nicht angezeigt werden sollen
    this.setState({ colsHidden: ["id", "Id", "userID"] });

    // Speichert welche Reihen Collapsed sind
    this.setState({ collapseList: {} });

    // Liste nach welcher die Daten gefilter werden
    this.setState({ filterParams: [] });

    // Gibt die Anzahl der Spalten pro Seite  wieder
    this.getPageSize();

    // Füllt die collapseList mit allen Spalten und setzt false
    this.getCollapseList();
  };

  // Weiss nicht warum... sollte auch geändert werden
  componentDidMount = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
  };

  // Wenn sich die Daten ändern (tabelle geupdated)
  componentDidUpdate = () => {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }

    // Zeigt den DeleteContainer
    this.toggleShowDelete();

    // Collapsed die SubTableRows
    this.collapseAll();
  };

  // Erzeugt die Liste für die Spalten welche collapsen
  // wahr = offen
  getCollapseList = () => {
    let collapseList = this.state.collapseList;

    if (this.props.data !== undefined) {
      this.props.data.forEach((d) => {
        collapseList[d[this.props.idKey]] = false;
      });
      this.setState({ collapseList });
    }
  };

  // Wenn etwas in der Checklist steht, also eine Spalte gecheckt ist
  // zeige Delete Container
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

  // Setzt die Seite für die Pagination
  setPage = (page) => {
    if (this.state.page !== page) {
      this.setState({ page });
    }
  };

  // Gibt die Daten wieder und filtert diese wenn etwas in FilterParams steht
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

    // Jeden Filter auf die Daten anwenden
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

  // Alle Daten einer Reihe die größer sind als val
  searchGreaterThan = (val, data, chosenIndex) => {
    let cols = this.getCols();
    let type = typeof data[0][cols[chosenIndex]];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      data.forEach((obj) => {
        let match = false;

        if (obj[cols[chosenIndex]] > parseInt(val, 10)) {
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

        if (obj[cols[chosenIndex]] > val) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  // Alle Daten einer Reihe die kleiner sind als val
  searchLesserThan = (val, data, chosenIndex) => {
    let cols = this.getCols();
    let type = typeof data[0][cols[chosenIndex]];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      data.forEach((obj) => {
        let match = false;

        if (obj[cols[chosenIndex]] < parseInt(val, 10)) {
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

        if (obj[cols[chosenIndex]] < val) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  // Sucht gleiche Zahlenwerte oder Daten die Zeichenkette enthalten
  search = (val, data, chosenIndex) => {
    let cols = this.getCols();

    let type = typeof data[0][cols[chosenIndex]];
    let newData = [];

    if (val === "") {
      return data;
    }

    if (type === "number") {
      val = parseInt(val, 10);

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
        if (obj[cols[chosenIndex]].toDateString() === val.toDateString()) {
          match = true;
        }

        if (match) {
          newData.push(obj);
        }
      });

      return newData;
    }
  };

  // Setzt die Parameter für die Sortierung
  setSortParams = (dir, key) => {
    this.setState({ sortParams: {} });
    this.setState({ sortParams: { ...this.sortParams, dir, key } });
  };

  // Für Text alignment in Tabelle
  getTableHeadStyle = (name) => {
    if (typeof this.props.data[0][name] === "string") {
      return style.alignLeft;
    } else if (typeof this.props.data[0][name] === "number") {
      return style.alignRight;
    } else if (typeof this.props.data[0][name] === "object") {
      return style.alignLeft;
    }
  };

  // Tabellenkopf in Untertabelle
  createSubTableHeader = (id) => {
    let cols = this.getRangeList(this.state.subTableIndex, this.getColCount());
    let divider;

    let tableHeader = (
      // divider = kleine Linie in TabellenKopf zwischen den Spalten
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
              {/* Spalten Name mit Icon Pfeil hoch oder Runter um Sortierrichtung anzuzeigen */}
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

  // Erzeugt den Kopf der Tabelle
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
                  {/* Spalten Name mit Icon Pfeil hoch oder Runter um Sortierrichtung anzuzeigen */}
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

    // Tabelle wenn keine  Daten vorhanden sind
    let tableHeader = (
      <tr>
        <th>Keine {this.props.title} vorhanden</th>
      </tr>
    );
    return tableHeader;
  };

  // Setzt jedes Häcken in allen Checkboxen jeder Reihe
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

  // Jedes Element in checkList wird gelöscht
  checkDelete = () => {
    let checkList = this.state.checkList;

    checkList.forEach((id) => {
      this.props.delete(id);
    });

    this.setState({ checkList: [] });
  };

  // Gibt zurück ob sich Element in der Checkliste befindet
  getCheckState = (id) => {
    let checkList = this.state.checkList;

    return checkList.includes(id);
  };

  // Addiert oder entfernt Element aus Checklist
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

  // Text Alignment der Zellen
  getTableDataStyle = (data, key) => {
    if (typeof data[key] === "number") {
      return style.alignRight;
    }
    return style.alignLeft;
  };

  // Gibt Anzahl der Spalten
  getColCount = () => {
    let cols = Object.keys(this.props.data[0]);

    return cols.length;
  };

  // Gibt die Namen der Spalten
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

  // Gibt die Spalten die in angegebener Range liegen
  // Zum Aufteilen in Tabelle und Untertabelle
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

  // Erzeugt Untertabelle
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

  // Collapse Reihen abhängig von collapseList
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

  // Schließt Reihe (Collapse)
  collapse = (id) => {
    let coll = document.getElementById(id + "row");
    let collIcon = document.getElementById(id + "icon");

    if (coll) {
      coll.style.maxHeight = null;
      collIcon.innerHTML = "arrow_drop_down";
    }
  };

  // Öffnet Reihe (Uncollapse)
  unCollapse = (id) => {
    let coll = document.getElementById(id + "row");
    let collIcon = document.getElementById(id + "icon");

    if (coll) {
      coll.style.maxHeight = coll.scrollHeight + "px";
      collIcon.innerHTML = "arrow_drop_up";
    }
  };

  // Element zur Collapselist hinzufügen oder entfernen
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

  // Button mit Icon Pfeil hoch oder runter jenachdem ob Reihe Collapsed ist
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

  // Tabellen Spalten
  renderTableContent = (key, row) => {
    let cols = this.getRangeList(0, this.state.subTableIndex);
    return (
      <tr id={key + "mainRow"}>
        <td id={"tableData"} class={style.btnsData}>
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

        {/* Zellen Erzeugen */}
        {Object.keys(row).map((key) => {
          if (!cols.includes(key)) {
            return undefined;
          }
          if (key !== "Datum") {
            return <td class={this.getTableDataStyle(row, key)}>{row[key]}</td>;
          }

          // Datum formatieren
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
          return <td class={this.getTableDataStyle(row, key)}>{output}</td>;
        })}
      </tr>
    );
  };

  // Tabellen Gerüst um die Spalten
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

  // Anzeige Welche Seite in Pagination
  createPageCounter = () => {
    if (this.state.data !== undefined) {
      let pageCount = `${this.state.page}/${this.getPageCount()}`;

      return pageCount;
    }
  };

  // Wieviele Spalten pro Seite
  getPageSize = () => {
    let pageSize = this.props.pageSize;

    return pageSize;
  };

  // Wieviele Seiten insgesamt
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

  // Pagination Button mit Seiten Nummer
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

  // Pagination zurück Button enable oder disable
  disableBackBtn = () => {
    let currentPage = this.state.page;

    return currentPage === 1;
  };

  // Pagination vorwärts Button enable oder disable
  disableForwardBtn = () => {
    let totalPage = this.getPageCount();
    let currentPage = this.state.page;

    return currentPage === totalPage;
  };

  // Erstellt die Pagination
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

  // Exportiert die Daten in CSV Datei mit angewendeten Filtern
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

  // Wieviele Reihen ausgewählt sind
  getSelectedCount = () => this.state.checkList.length;

  // Fügt Filter Hinzu
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

  // Bearbeiten einen bestehenden Filter
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

  // Löscht einen Filter
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

  // Render Tabelle
  render() {
    return (
      <div class={style.tableContentContainer}>
        {/* Menu ist die Spalte über dem Tabellen Kopf mit export, hinzufügen und Filter */}
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
