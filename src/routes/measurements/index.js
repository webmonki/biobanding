import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import Navbar from '../../components/navbar/navbar';
import Auth from '../../components/state';
import createTable from '../../components/table/table';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import Dialog from 'preact-material-components/Dialog';
import 'preact-material-components/Dialog/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import 'preact-material-components/List/style.css';
import List from 'preact-material-components/List';
import Drawer from 'preact-material-components/Drawer';
import 'preact-material-components/Drawer/style.css';
import Table from '../../components/table';
import NewMeasurementAdmin from '../../components/dialogs/newMeasurementAdmin';
import NewMeasurementUser from '../../components/dialogs/newMeasurementUser';

export default class Measurements extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });


		if (Auth.check_admin()) {
			this.getOverview();
		}
		else {
			this.getMeasurements();
		}
	}

	componentWillUnmount = () => {
		document.removeEventListener('keyup', this.handleKey)
	}


	fitPageSize = (large) => {
		large ? this.setState({pageClass : style.pageLarge }) : this.setState({pageClass : style.pageSmall})
	}

	showTable = (editable) => {
		
		let data = this.state.measurements

		let content = (
			<div class={style.tableContainer}>
				<Table editable={editable} data={data} pageSize={11} clickEdit={this.showDialog} idKey='measureID' />
			</div>
		);
		this.setState({ content });
	};

	editData = () => {
		let that = this;
		let url = Auth.url + '/api/measurement/' + this.state.editId;
		let xhttp = new XMLHttpRequest();

		xhttp.open('PUT', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);


		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Messung erfolgreich geändert' });
				location.reload();
			}
			else {
				try {
					let response = JSON.parse(this.responseText);
					if (response.msg == 'Token is invalid') {
						Auth.logout();
						location.reload();
					}
				}
				catch (err) {}
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
			"body_span": ${ this.state.span },
			"weight": ${ this.state.weight }
		}`;

		xhttp.send(data);
	}

	getOverview = () => {
		let that = this;
		let url = Auth.url + '/api/users/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);


		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Übersicht erfolgreich geladen' });
				that.setState({ measurements : response['userdetails'] });
				let idList = [];
				response['userdetails'].forEach(user => {
					idList.push(user.userID);
				})
				that.setState({ userIds : idList });
				that.showTable(true);
				that.getDialog();
			}
			else {
				try {
					let response = JSON.parse(this.responseText);
					if (response.msg == 'Token is invalid') {
						Auth.logout();
						location.reload();
					}
				}
				catch (err) {}
			}
		};
		xhttp.send();
	}

	getMeasurements = () => {
		let that = this;
		let url = Auth.url + '/api/user/' + Auth.getUser().id + '/anthropometric';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);


		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Messungen erfolgreich geladen' });
				that.setState({ measurements : response['measurements:'] });
				that.showTable(true);
				that.getDialog();
			}
			else {
				try {
					let response = JSON.parse(this.responseText);
					if (response.msg == 'Token is invalid') {
						Auth.logout();
						location.reload();
					}
				}
				catch (err) {}
			}
		};
		xhttp.send();
	}

	delete = (id) => {

		let that = this;
		let url = Auth.url + '/api/measurement/' + id;
		let xhttp = new XMLHttpRequest();

		xhttp.open('DELETE', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Messung erfolgreich gelöscht' });
				
				let newMeasureList = []
				that.state.measurements.forEach(measure => {
					if (measure.id != id) {
						newMeasureList.push(measure)
					}
				})
				that.setState({ measurements : newMeasureList });
				that.showTable(true);
			}
			else {
				try {
					let response = JSON.parse(this.responseText);
					if (response.msg == 'Token is invalid') {
						Auth.logout();
						location.reload();
					}
				}
				catch (err) {}
			}
		};

		xhttp.send();

	}

	sendMeasurement = () => {
		console.log("SEND")

		let id;
		Auth.check_admin() ? id = this.state.userIds[this.state.chosenIndex] : id = Auth.getUser().id;

		console.log("ID: ", id)
		let that = this;
		let url = Auth.url + '/api/user/' + id + '/anthropometric';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				console.log(response)
				location.reload();

			}
			else {
				let response = JSON.parse(this.responseText);
				console.log(response)
			}
		};

		let today = new Date();

		let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

		let data = `{
			"userID": ${ id },
			"date_measured": "${ date }",
			"height": ${ this.state.height },
			"sitting_height": ${ this.state.sittingHeight },
			"body_span": ${ this.state.span },
			"weight": ${ this.state.weight }
		}`;

		console.log(data)

		xhttp.send(data);
	}

	checkDelete = () => {
		let checkboxes = document.getElementsByName('deleteCheck')
		
		checkboxes.forEach(cb => {
			if (cb.checked) {
				this.delete(cb.value)
			}
		})
	}

	showDialog = (id) => {
		document.addEventListener('keyup', this.handleKey)

		console.log('ID: ', id)

		this.setState({ editId : id });
		
		this.state.measurements.forEach(measurement => {
			if (measurement.id == id) {
				this.setState({ height : measurement.height })
				this.setState({ sittingHeight : measurement.sitting_height })
				this.setState({ span : measurement.body_span })
				this.setState({ weight : measurement.weight })
			}
		})

		this.measurementsEditDialog.MDComponent.show();
	}

	handleKey = (event) => {
		console.log("EVENT")
		if(event.code == 'Enter') {
			this.editData();
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	getDataFromDialogforNew = (height, sittingHeight, span, weight, chosenIndex) => {
		this.setState({ height });
		this.setState({ sittingHeight });
		this.setState({ span });
		this.setState({ weight });
		this.setState({ chosenIndex });

		this.sendMeasurement();
	}

	getDataFromDialogForEdit = (height, sittingHeight, span, weight, chosenIndex) => {
		this.setState({ height });
		this.setState({ sittingHeight });
		this.setState({ span });
		this.setState({ weight });
		this.setState({ chosenIndex });

		this.editData();
	}

	getDialog = () => {
		let dialog

		if (Auth.check_admin()) {
			dialog = (
				<NewMeasurementAdmin
					reference={newMeasurementsDialog=>{this.newMeasurementsDialog=newMeasurementsDialog}}
					userIds={this.state.userIds}
					sendData={this.getDataFromDialogforNew}/>
			)
		}
		else {
			dialog = (
				<NewMeasurementUser
					reference={newMeasurementsDialog=>{this.newMeasurementsDialog=newMeasurementsDialog}}
					sendData={this.getDataFromDialogforNew} />
			)
		}

		let editDialog = (
			<NewMeasurementUser
			reference={measurementsEditDialog=>{this.measurementsEditDialog=measurementsEditDialog}}
			sendData={this.getDataFromDialogForEdit} />
		)


		this.setState({ dialog });
		this.setState({ editDialog });
	}

	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/measurements' fitPageSize={this.fitPageSize}/>
				<span class={style.pageHeader}>Messungen</span>
				<div class={style.btnContainer}>
					<Button class={style.deleteBtn} onClick={this.checkDelete}>
						<List.ItemGraphic class={`${"mdc-theme--primary"} ${style.deleteIcon}`}>delete</List.ItemGraphic>
					</Button>
					<Button raised class={`${"mdc-button mdc-theme--primary-bg"} ${style.roundBtn}`} onClick={() => {
						this.newMeasurementsDialog.MDComponent.show();
						document.addEventListener('keyup', this.handleKey)
					}}>
						<i class="material-icons mdc-button__icon mdc-theme-on-primary" aria-hidden="true">add</i>
						<span class="mdc-button__label mdc-theme-on-primary">erstellen</span>
					</Button>
				</div>
				<Card class={style.card}>
					{this.state.content}
				</Card>
				<div class={style.feedbackContainer}>
					<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
				</div>
				{this.state.dialog}
				{this.state.editDialog}
			</div>
		);
	}
}