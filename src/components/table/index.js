import { h, Component } from 'preact';
import style from './style';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import List from 'preact-material-components/List';
import Checkbox from 'preact-material-components/Checkbox';
import Formfield from 'preact-material-components/FormField';
import 'preact-material-components/Checkbox/style.css';

export default class Table extends Component {

	componentWillMount = () => {
		this.setPage(1);
		this.setState({ backBtnDisabled : true });
		this.setState({ forwardBtnDisabled : false });
	}

	setPage = (page) => {

		if (this.state.page != page) {
			this.setState({ page });
			this.disableButtons();
		}
	}

	createTableHeader = () => {

		if (this.props.data != undefined) {

			let cols = Object.keys(this.props.data[0]);

			if (this.props.editable) {
				let tableHeader = (
					<tr>
						<th></th>
						{cols.map((name) => <th>{name}</th>)}
					</tr>
				)
		
				return tableHeader;
			}
			else {
				let tableHeader = (
					<tr>
						{cols.map((name) => <th>{name}</th>)}
					</tr>
				)
		
				return tableHeader;
			}


		}
	}

	createTableBody = (page) => {

		if (this.props.data != undefined) {
			let indexEnd = page * this.props.pageSize
			let indexStart = indexEnd - this.props.pageSize
	
			let pageData = this.props.data.slice(indexStart, indexEnd)
	
			if (this.props.editable) {
				let tableBody = (
					<tbody>
						{pageData.map((row) => 
							<tr>
								<td>
									<div class={style.tdIconContainer}>
										<List.ItemGraphic onClick={() => this.props.clickEdit(row[this.props.idKey])} class={style.tdIcon}>edit</List.ItemGraphic>
										<Formfield>
											<Checkbox name='deleteCheck' value={row[this.props.idKey]}/>
										</Formfield>
									</div>
								</td>
								{Object.keys(row).map((key) =>
									<td>{row[key]}</td>
								)}
							</tr>
						)}
					</tbody>
				)
				return tableBody;
			}
			else {
				let tableBody = (
					<tbody>
						{pageData.map((row) => 
							<tr>
								{Object.keys(row).map((key) =>
									<td>{row[key]}</td>
								)}
							</tr>
						)}
					</tbody>
				)
				return tableBody;
			}

		}
	}

	disableButtons = () => {
		let totalPage = this.getPageCount();
		let currentPage = this.state.page;

		currentPage == 1 ? this.setState({ backBtnDisabled : true}) : this.setState({ backBtnDisabled : false });
		currentPage == totalPage ? this.setState({ forwardBtnDisabled : true }) : this.setState({ forwardBtnDisabled : false });
	}

	lowerPage = () => {
		this.setState({ page : this.state.page - 1})
		this.disableButtons();
	}

	increasePage = () => {
		this.setState({ page : this.state.page + 1})
		this.disableButtons();
	}

	createPageCounter = () =>  {
		if (this.props.data != undefined) {

			let pageCount = `${this.state.page}/${this.getPageCount()}`

			return pageCount
		}
	}

	getPageCount = () => {

		if (this.props.data != undefined) {
			let pageCount
			if (this.props.data.length == this.props.pageSize) {
				pageCount = '1';
			}
			if (this.props.data.length < this.props.pageSize) {
				pageCount = '1';
			}
			if (this.props.data.length > this.props.pageSize)  {
				pageCount = ((this.props.data.length / this.props.pageSize) + 1).toString().split('.')[0]
			}

			return pageCount;
		}
	}

	createBtn = (pageNumber) => {
		if (pageNumber == this.state.page) {

			return (				
				<div class={style.btnSelected} onClick={() => this.setPage(pageNumber)}>{pageNumber}</div>
			)
		}
		else {
			return (				
				<div class={style.btn} onClick={() => this.setPage(pageNumber)}>{pageNumber}</div>
			)
		}
	}

	createTablePagination = () => {

		if (this.props.data != undefined) {

			let pageNumbers = []

			for (var i = 0; i < parseInt(this.getPageCount(), 10); i++) {
				pageNumbers.push(i + 1);
			}

			let pagination = (
				<div class={style.paginationBar}>
					<div class={style.btn} disabled={true}>
						{this.createPageCounter()}
					</div>
					<button class={style.btn} onClick={this.lowerPage} disabled={this.state.backBtnDisabled}>
						<i class={`${"material-icons"} ${style.btnIcon}`} aria-hidden="true">chevron_left</i>
					</button>
					{pageNumbers.map((pageNumber) => 
						this.createBtn(pageNumber)
					)}
					<button class={style.btn} onClick={this.increasePage} disabled={this.state.forwardBtnDisabled}>
						<i class={`${"material-icons"} ${style.btnIcon}`} aria-hidden="true">chevron_right</i>
					</button>
				</div>
			)

			return pagination;
		}


	}
	
	render() {
		return (
			<div>
				<table>
					{this.createTableHeader()}
					{this.createTableBody(this.state.page)}
				</table>
				{this.createTablePagination()}
			</div>
		)
	}
}