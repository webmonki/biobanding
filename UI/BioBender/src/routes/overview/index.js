import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head2 from '../../components/head/head2.js';
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js';
import List from 'preact-material-components/List';
import Dropdown from '../../components/dropdown/dropdown';

export default class Overview extends Component{

	state = ({ content : undefined });
	state = ({ details : undefined });
	state = ({ currentIds : undefined });

	state = ({ userID : ''});
	state = ({ username : '' });
	state = ({ firstname : '' });
	state = ({ lastname : '' });
	state = ({ email : '' });
	state = ({ bday : '' });
	state = ({ sex : '' });
	state = ({ height : '' });
	state = ({ result : '' });

	componentWillMount = () => {
		this.setState({ details : [] });
		this.getData();

		this.setState({ currentIds : [] });
	}

	back = () => {
		this.setState({ currentPage : this.state.currentPage - 1});
		this.handleClickView();
	}

	forward = () => {
		this.setState({ currentPage : this.state.currentPage + 1});
		this.handleClickView();
	}

	disableBackBtn = () => {
		this.setState({ backBtnClass : style.btnDisabled });
		this.setState({ backBtnDisabled : true });
		this.setState({ backIconClass : style.btnIconDisabled });
	}

	enableBackBtn = () => {
		this.setState({ backBtnClass : style.btnEnabled });
		this.setState({ backBtnDisabled : false });
		this.setState({ backIconClass : style.btnIcon });
	}

	disableForwardBtn = () => {
		this.setState({ forwardBtnClass : style.btnDisabled });
		this.setState({ forwardBtnDisabled : true });
		this.setState({ forwardIconClass : style.btnIconDisabled });
	}

	enableForwardBtn = () => {
		this.setState({ forwardBtnClass : style.btnEnabled });
		this.setState({ forwardBtnDisabled : false });
		this.setState({ forwardIconClass : style.btnIcon });
	}

	getData = () => {
		let that = this;
		let url = Auth.url + '/api/users/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if([0,1,2,3,4].includes(this.readyState)) {

				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						sessionStorage.setItem('details', JSON.stringify(response['userdetails']));
						that.setState({ details : response['userdetails'] });
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					let idList = [];
					that.state.details.forEach(detail => {
						idList.push(detail.userID)
					});
					that.setState({ currentIds : idList });
					that.setState({ feedbackClass: style.feedbackSucc });

					that.handleClickView();


				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
						that.setState({ feedbackClass: style.feedbackErr });
					}
					catch(err) {}

				}
			}
			else {
				this.setState({ loginResponse: 'Ups, something went wrong' });
			}
		}

		xhttp.send();
	}

	handleTableClick = (row) => {
		this.setState({ currentPage : row.userID - 1 });
		this.handleClickView();
	}

	showTable = () => {;
		
		let cols = ['BenutzerId', 'Benutzername', 'Vorname', 'Nachname', 'E-Mail', 'Geburtstag', 'Geschlecht', 'Größe', 'Ergebnis']

		let tableHeader = (
				<tr>
					{cols.map((name) => <th>{name}</th>)}
				</tr>
		)

		let data = JSON.parse(sessionStorage.details);

		let tableBody = (
			<tbody>
				{data.map((row) => 
					<tr onClick={() => this.handleTableClick(row)}>
						<td>{row.userID}</td>
						<td>{row.username}</td>
						<td>{row.firstname}</td>
						<td>{row.lastname}</td>
						<td>{row.email}</td>
						<td>{row.birthday}</td>
						<td>{row.sex_m_0_f_1}</td>
						<td>{row.height}</td>
						<td>{row.result}</td>
					</tr>
				)}
			</tbody>
		)

		let table = (
			<table id="measureTable">
				<thead>
					{tableHeader}
				</thead>
				{tableBody}
			</table>
		)


		let content = (
			<div class={style.viewContainer}>
				<div class={style.center}>
					<Button raised class={style.navBtn} onClick={this.handleClickView}>
						<div class={style.btnLabel}>
							<List.ItemGraphic class={style.btnIcon}>arrow_back</List.ItemGraphic>
							<div class={style.labelText}>Zurück</div>
						</div>
					</Button>
				</div>
				<div class={style.tableContainer}>
					{table}
				</div>
			</div>
		);
		this.setState({ content });
	};

	handleDropDownClick = (id) => {
		this.setState({ currentPage : this.state.currentIds.indexOf(id) })
		this.handleClickView();
	}

	handleClickView = () => {

		if (this.state.details.length == 0){
			try {
				this.setState({ details : JSON.parse(sessionStorage.details) });
				that.setState({ feedbackClass: style.feedbackSucc });
				that.setState({ feedback: "Daten erfolgreich geladen." });
			}
			catch(err) {
				this.setState({ feedback: "Keine Daten zum laden." });
				this.setState({ feedbackClass: style.feedbackErr });
				this.setState({ details : JSON.parse(sessionStorage.details) });
			}
		}


		let details = this.state.details

		if (this.state.currentPage == undefined && details.length > 0) {
			this.setState({ currentPage : details.length - 1 })
		}

		this.state.currentPage > 0 ? this.enableBackBtn() : this.disableBackBtn();
		this.state.currentPage < this.state.details.length - 1 ? this.enableForwardBtn() : this.disableForwardBtn();


		if (this.state.currentPage != undefined) {
			this.setState({ userID : details[this.state.currentPage].userID});
			this.setState({ username : details[this.state.currentPage].username });
			this.setState({ firstname: details[this.state.currentPage].firstname });
			this.setState({ lastname : details[this.state.currentPage].lastname });
			this.setState({ email : details[this.state.currentPage].email });
			this.setState({ bday: details[this.state.currentPage].birthday})
			this.setState({ sex : details[this.state.currentPage].sex_m_0_f_1 });
			this.setState({ height : details[this.state.currentPage].height });
			this.setState({ result : details[this.state.currentPage].result });
		}
		else {
			this.setState({ userID : '' });
			this.setState({ username : '' });
			this.setState({ firstname : '' });
			this.setState({ lastname : '' });
			this.setState({ email : '' });
			this.setState({ sex : '' });
			this.setState({ height : '' });
			this.setState({ result : '' });
		}
		

		let content = (
			<div class={style.viewContainer}>
				<div class={style.centerFB}>
					<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				</div>
				<div class={style.btnRow}>
					<Button raised class={this.state.backBtnClass} disabled={this.state.backBtnDisabled} onClick={this.back}>
						<List.ItemGraphic class={this.state.backIconClass}>arrow_back</List.ItemGraphic>
					</Button>
					<Button raised class={style.navBtn} onClick={this.showTable}>
						<div class={style.btnLabel}>
							<List.ItemGraphic class={style.btnIcon}>list</List.ItemGraphic>
							<div class={style.labelText}>Tabelle</div>
						</div>
					</Button>
					<Button raised class={this.state.forwardBtnClass} disabled={this.state.forwardBtnDisabled} onClick={this.forward}>
						<List.ItemGraphic class={this.state.forwardIconClass}>arrow_forward</List.ItemGraphic>
					</Button>
				</div>
				<div class={style.viewData}>
					<div class={style.data}>
						<div class={style.dataLabel}>BenutzerId: </div>
						<div class={style.dataContent}>
							<Dropdown
								ddId={'userIdDropdown'}
								data={this.state.currentIds}
								dropdownClick={this.handleDropDownClick}
								selected={this.state.currentIds[this.state.currentPage]}/>
						</div>
					</div>

					<div class={style.data}>
						<div class={style.dataLabel}>Benutzername: </div>
						<div class={style.dataContent}>{this.state.username}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Vorname: </div>
						<div class={style.dataContent}>{this.state.firstname}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Nachname: </div>
						<div class={style.dataContent}>{this.state.lastname}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>E-Mail: </div>
						<div class={style.dataContent}>{this.state.email}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Geburtstag: </div>
						<div class={style.dataContent}>{this.state.bday}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Geschlecht: </div>
						<div class={style.dataContent}>{this.state.sex}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Größe: </div>
						<div class={style.dataContent}>{this.state.height}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Ergebnis: </div>
						<div class={style.dataContent}>{this.state.result}</div>
					</div>
				</div>
			</div>
		);

		this.setState({ content });
		// this.setDropDown(this.state.currentPage + 1);
	};

	render() {
		return (
			<div class={style.layout}>
				<Card class={style.card}>
					<Head2 headText="Übersicht" />
					<div class={style.content}>
						{this.state.content}
					</div>
				</Card>
			</div>
		);
	}
}