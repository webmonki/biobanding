import { h, Component } from 'preact';
import { route } from 'preact-router';
import TopAppBar from 'preact-material-components/TopAppBar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/TopAppBar/style.css';
import 'preact-material-components/Theme/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Auth from '../state';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Select/style.css';
import NewMeasurementAdmin from '../dialogs/newMeasurementAdmin';
import NewMeasurementUser from '../dialogs/newMeasurementUser';

export default class Header extends Component {

	newMeasurementsDialogRef = dialog => (this.dialog = dialog);

	componentWillMount = () => {
		this.setState({ userIds : [] });
		this.getDialog();
	}

	componentWillUnmount = () => {
		document.removeEventListener('keyup', this.handleKey)
	}

	// Request to Log out user
	logOut = () => {
		let that = this;
		let url = Auth.url + '/api/users/logout';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					Auth.logout();
				}
			}

		};

		xhttp.send();
	}

	getPlayerDetails = () => {
		let that = this;
		let url = Auth.url + '/api/users/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);

		xhttp.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);

				let idList = [];
				response['userdetails'].forEach(user => {
					idList.push(user.userID);
				})

				that.setState({ userIds : idList });	
				that.getDialog();
			}
		}
		xhttp.send();	
	}

	getDataFromDialog = (height, sittingHeight, span, weight, chosenIndex) => {
		this.setState({ height });
		this.setState({ sittingHeight });
		this.setState({ span });
		this.setState({ weight });
		this.setState({ chosenIndex });

		this.sendMeasurement();
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

	getDialog = () => {
		let dialog
		if (Auth.check_admin()) {
			dialog = (
				<NewMeasurementAdmin
					reference={newMeasurementsDialog=>{this.newMeasurementsDialog=newMeasurementsDialog}}
					userIds={this.state.userIds}
					sendData={this.getDataFromDialog}
					header='Messung erstellen'
					subHeader='Anthropometrische Daten'/>
			)
		}
		else {
			dialog = (
				<NewMeasurementUser
					reference={newMeasurementsDialog=>{this.newMeasurementsDialog=newMeasurementsDialog}}
					sendData={this.getDataFromDialog}
					header='Messung erstellen'
					subHeader='Anthropometrische Daten'/>
			)
		}

		this.setState({ dialog });
	}


	render() {
		if (Auth.getUser()) {
			return (
				<div class={`${"mdc-theme--primary-bg"} ${style.topAppBar}`}>
					<span class={`${style.appTitle} ${style.white}`}>Astrostars biobanding</span>
					<div class={style.btnContainer}>
						<Button class={`${"mdc-button mdc-theme--primary-bg"} ${style.white}`} onClick={this.logOut}>
							<span class={style.white}>Abmelden</span>
						</Button>
						<Button raised class={`${"mdc-button mdc-theme--secondary-bg"} ${style.roundBtn}`} onClick={() => {
							this.getPlayerDetails();
							this.newMeasurementsDialog.MDComponent.show();
						}}>
							  <i class="material-icons mdc-button__icon mdc-theme--text-secondary-on-light" aria-hidden="true">add</i>
							  <span class="mdc-button__label mdc-theme--text-secondary-on-light">Messung</span>
						</Button>
					</div>
					{this.state.dialog}
				</div>
			);
		}
	}
}
