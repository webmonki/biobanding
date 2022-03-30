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

export default class Evaluation extends Component{


	
	componentWillMount = () => {
		this.getData();
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

					that.showTable();
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
		}
		xhttp.send();
	}

	
	showTable = () => {;
		
		let cols = ['BenutzerId', 'Benutzername', 'Vorname', 'Nachname', 'E-Mail', 'Geburtstag', 'Geschlecht', 'Größe', 'Ergebnis']

		let tableHeader = (
				<tr>
					{cols.map((name) => <th>{name}</th>)}
				</tr>
		)
		
		if (this.state.details.length == 0) {
			var data = JSON.parse(sessionStorage.details);
		}
		else {
			var data = this.state.details
		}


		let tableBody = (
			<tbody>
				{data.map((row) => 
					<tr>
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
				<div class={style.tableContainer}>
					{table}
				</div>
			</div>
		);
		this.setState({ content });
	};


	render() {
		return (
				<Card class={style.card}>
						{this.state.content}
				</Card>
		);
	}
}