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

export default class UserEdit extends Component{


	
	componentWillMount = () => {
		this.setState({ measurements : [] });

		this.setState({ measureId: '' });
		this.setState({ height: '' });
		this.setState({ sittingHeight: '' });
		this.setState({ bodySpan: '' });
		this.setState({ weight: '' });
		this.setState({ date: '' });
		this.setState({ result: '' });

		this.setState({ sendBtnClass : style.btnDisabled });
		this.setState({ sendBtnDisabled : true });

		this.setState({ editBtnClass : style.btnDisabled });
		this.setState({ editBtnDisabled : true });


		this.getData();
	}

	getData = () => {
		console.log("GET")
		let that = this;
		let url = Auth.url + '/api/user/' + Auth.getUser().id + '/anthropometric';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if([0,1,2,3,4].includes(this.readyState)) {

				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						sessionStorage.setItem('measurements', JSON.stringify(response['measurements:']));
						that.setState({ measurements : response['measurements:'] });
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					let idList = [];
					that.state.measurements.forEach(measurement => {
						idList.push(measurement.id)
					});
					that.setState({ currentIds : idList });
					that.setState({ feedbackClass: style.feedbackSucc });

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
	sendData = () => {

		let that = this;
		let url = Auth.url + '/api/user/' + Auth.getUser().id + '/anthropometric';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if ([0,1,2,3,4].includes(this.readyState)) {
					
				if (this.status === 200) {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackSucc });
					that.setState({ currentPage : undefined });
					that.getData();
					that.showTable();


				}
			}
		};

		let today = new Date();

		let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

		let data = `{
			"userID": ${ Auth.getUser().id },
			"date_measured": "${ date }",
			"height": ${ this.state.height },
			"sitting_height": ${ this.state.sittingHeight },
			"body_span": ${ this.state.bodySpan },
			"weight": ${ this.state.weight }
		}`;

		xhttp.send(data);
	}

	delete = (id) => {

		let that = this;
		let url = Auth.url + '/api/measurement/' + id;
		let xhttp = new XMLHttpRequest();

		xhttp.open('DELETE', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {

			if ([0,1,2,3,4].includes(this.readyState)) {
					
				if (this.status === 200) {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackSucc });

					that.setState({ currentDelete : '' });
					that.setState({ currentPage : undefined });

					let newMeasureList = []
					that.state.measurements.forEach(measure => {
						if (measure.id != id) {
							newMeasureList.push(measure)
						}
					})
					sessionStorage.setItem('measurements', JSON.stringify(newMeasureList));
					that.setState({ measurements : newMeasureList });
					that.showTable();


				}
				else {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackErr });
				}
			}
		};

		xhttp.send();

	}

	editData = () => {
		console.log("EDIT: ", this.state.currentEdit)
		let that = this;
		let url = Auth.url + '/api/measurement/' + this.state.currentEdit;
		let xhttp = new XMLHttpRequest();

		xhttp.open('PUT', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if ([0,1,2,3,4].includes(this.readyState)) {
					
				if (this.status === 200) {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					// that.state.measurements.forEach(measure => {
					// 	if (measure.id == that.state.currentEdit) {

					// 		measure.height = that.state.height;
					// 		measure.sittingHeight = that.state.sittingHeight;
					// 		measure.bodySpan = that.state.bodySpan;
					// 		measure.weight = that.state.weight;
					// 		measure.result = that.state.result;
					// 		measure.date = that.state.date;

					// 	}
					// })

					that.setState({ feedbackClass: style.feedbackSucc });
					that.setState({ currentEdit : undefined });
					that.getData();
					// that.showTable();


				}

			}
		};
		let today = new Date();

		let month = '';

		if ((today.getMonth() + 1) < 10) {
			month = '0' + (today.getMonth() + 1)
		}
		else {
			month = today.getMonth() + 1
		}

		let day = '';
		if(today.getDate() < 10) {
			day = '0' + (today.getDate());
		} else {
			day = today.getDate();
		}

		let date = today.getFullYear() + '-' + month + '-' + day;

		let data = `{
			"date_measured": "${ date }",
			"height": ${ this.state.height },
			"sitting_height": ${ this.state.sittingHeight },
			"body_span": ${ this.state.bodySpan },
			"weight": ${ this.state.weight }
		}`;

		xhttp.send(data);
	}


	handleChangeNew = () => {
		this.setState({ height: document.getElementById('inputHeight').value });
		this.setState({ sittingHeight: document.getElementById('inputSittingHeight').value });
		this.setState({ bodySpan: document.getElementById('inputSpan').value });
		this.setState({ weight: document.getElementById('inputWeight').value });

		if (
			this.state.height !== '' && this.state.sittingHeight !== '' &&
			this.state.bodySpan !== '' && this.state.weight !== ''
		) {
			this.setState({ sendBtnDisabled: false });
			this.setState({ sendBtnClass: style.btnEnabled });
		}
		else {
			this.setState({ sendBtnDisabled: true });
			this.setState({ sendBtnClass: style.btnDisabled });
		}
		
		this.handleClickNew();
	}

	handleClickNew = () => {

		let content = (
			<div class={style.newContainer}>
				<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				<Input inputId="inputHeight" inputLabel="Größe" onChange={this.handleChangeNew}/>
				<Input inputId="inputSittingHeight" inputLabel="Größe im Sitzen" onChange={this.handleChangeNew} />
				<Input inputId="inputSpan" inputLabel="Körperspannweite" onChange={this.handleChangeNew} />
				<Input inputId="inputWeight" inputLabel="Gewicht" onChange={this.handleChangeNew} />
				<div class={style.btnContainer}>
					<Button raised class={this.state.sendBtnClass} onClick={this.sendData} disabled={this.state.sendBtnDisabled}>Erstellen</Button>
					<Button raised class={style.btnEnabled} onClick={this.showTable}>
						<List.ItemGraphic class={style.btnIcon}>arrow_back</List.ItemGraphic>
					</Button>
				</div>
			</div>
		);

		this.setState({ content });
	};

	handleChangeEdit = () => {
		this.setState({ height: document.getElementById('inputEditHeight').value });
		this.setState({ sittingHeight: document.getElementById('inputEditSittingHeight').value });
		this.setState({ bodySpan: document.getElementById('inputEditSpan').value });
		this.setState({ weight: document.getElementById('inputEditWeight').value });


		if (
			this.state.height !== '' && this.state.sittingHeight !== '' &&
			this.state.bodySpan !== '' && this.state.weight !== '' && this.state.currentIds.length != 0
		) {
			this.setState({ editBtnDisabled: false });
			this.setState({ editBtnClass: style.btnEnabled });
		}
		else {
			this.setState({ editBtnDisabled: true });
			this.setState({ editBtnClass: style.btnDisabled });
		}
		
		this.handleClickEdit();
	};

	handleClickEdit = (id) => {

		if (id != undefined) {
			this.setState({ currentEdit : id });
		}

		let content = (
			<div class={style.newContainer}>
				<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				<div class={style.editDropdown}>
					<Dropdown
						class={style.deleteDropDown}
						ddId={'editIdDropdown'}
						data={this.state.currentIds}
						dropdownClick={this.handleEditDropDownClick}
						selected={this.state.currentEdit}
						/>
				</div>
				<Input inputId="inputEditHeight" inputLabel="Größe" onChange={this.handleChangeEdit}/>
				<Input inputId="inputEditSittingHeight" inputLabel="Größe im Sitzen" onChange={this.handleChangeEdit} />
				<Input inputId="inputEditSpan" inputLabel="Körperspannweite" onChange={this.handleChangeEdit} />
				<Input inputId="inputEditWeight" inputLabel="Gewicht" onChange={this.handleChangeEdit} />
				<div class={style.btnContainer}>
					<Button raised class={this.state.editBtnClass} onClick={this.editData} disabled={this.state.editBtnDisabled}>Ändern</Button>
					<Button raised class={style.btnEnabled} onClick={this.showTable}>
						<List.ItemGraphic class={style.btnIcon}>arrow_back</List.ItemGraphic>
					</Button>
				</div>
			</div>
		)

		this.setState({ content });
	};


	showTable = () => {
		
		let cols = ['Messung Nr.', 'Datum', 'Größe', 'Größe sitzend', 'Körper Spannweite', 'Gewicht', 'Ergebnis']

		let tableHeader = (
				<tr>
					<th class={style.thIconContainer} onClick={this.handleClickNew}>
						<List.ItemGraphic class={style.thIcon}>add_circle_outline</List.ItemGraphic>
					</th>
					{cols.map((name) => <th>{name}</th>)}
				</tr>
		)
		
		if (this.state.measurements.length == 0) {
			var data = JSON.parse(sessionStorage.measurements);
		}
		else {
			var data = this.state.measurements
		}


		let tableBody = (
			<tbody>
				{data.map((row) => 
					<tr>
						<td>
							<div class={style.tdIconContainer}>
								<List.ItemGraphic onClick={() => this.handleClickEdit(row.id)} class={style.tdIcon}>edit</List.ItemGraphic>
								<List.ItemGraphic onClick={() => this.delete(row.id)} class={style.tdIcon}>delete</List.ItemGraphic>
							</div>
						</td>
						<td>{row.id}</td>
						<td>{row.date_measured}</td>
						<td>{row.height}</td>
						<td>{row.sitting_height}</td>
						<td>{row.body_span}</td>
						<td>{row.weight}</td>
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
			<div class={style.tableContainer}>
				{table}
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
