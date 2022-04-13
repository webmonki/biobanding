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


export default class Header extends Component {


	componentWillMount = () => {
		this.setState({ userIds : [] });
		this.setState({ chosenIndex : 0 });
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

	sendMeasurement = () => {

		let id;
		Auth.check_admin() ? id = this.state.userIds[this.state.chosenIndex] : id = Auth.getUser().id;

		let that = this;
		let url = Auth.url + '/api/user/' + id + '/anthropometric';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			}
			else {
			}
		};

		let today = new Date();

		let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

		let data = `{
			"userID": ${ this.state.userIds[this.state.chosenIndex] },
			"date_measured": "${ date }",
			"height": ${ this.state.height },
			"sitting_height": ${ this.state.sittingHeight },
			"body_span": ${ this.state.span },
			"weight": ${ this.state.weight }
		}`;

		xhttp.send(data);
	}

	getDialog = () => {
		let dialog
		if (Auth.check_admin()) {
			dialog = (
				<Dialog class={style.dialog} ref={newMeasurementsDialog=>{this.newMeasurementsDialog=newMeasurementsDialog;}} onAccept={() => {
					this.sendMeasurement();
					location.reload();
				}} onCancel={() => {
				}}>
					<Dialog.Header>Neue Messung erstellen</Dialog.Header>
					<Dialog.Body>
						<div class={style.inputContainer}>
							<span class={style.subHeader}>Anthropometrische Daten</span>
							<Select class={style.selectId} outlined selectedIndex={this.state.chosenIndex} onChange={(e) => {
								this.setState({ chosenIndex : e.target.selectedIndex });
							}}>
								{this.state.userIds.map((id) => <Select.Item>{id}</Select.Item>)}
							</Select>
							<div class={style.row}>
							<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} type='number' outlined label='Größe' onKeyUp={e => {
										this.setState({ height: e.target.value });
										let val = e.target.value;
										if (val < 0) {
											this.setState({ heightFBClass : style.feedbackErr });
											this.setState({ heightFB : 'Mindestens 0'})
										}
										if (val > 300) {
											this.setState({ heightFBClass : style.feedbackErr });
											this.setState({ heightFB : 'Maximal 300' });
										}
										if (val >= 0 && val <= 300) {
											this.setState({ heightFBClass : style.feedbackSucc });
											this.setState({ heightFB : 'okay' });
										}
										this.getDialog();
									}}/>
									<span class={this.state.heightFBClass}>{this.state.heightFB}</span>
								</div>
								<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} outlined label='Größe im Sitzen' onKeyUp={e => {
										this.setState({ sittingHeight : e.target.value });
										let val = e.target.value;
										if (val < 0) {
											this.setState({ sittingFBClass : style.feedbackErr });
											this.setState({ sittingFB : 'Mindestens 0'})
										}
										if (val > 300) {
											this.setState({ sittingFBClass : style.feedbackErr });
											this.setState({ sittingFB : 'Maximal 300'})
										}
										if (val >= 0 && val <= 300) {
											this.setState({ sittingFBClass : style.feedbackSucc });
											this.setState({ sittingFB : 'okay' });
										}
										this.getDialog();
									}}/>
									<span class={this.state.sittingFBClass}>{this.state.sittingFB}</span>
								</div>
							</div>
							<div class={style.row}>
							<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} outlined label='Arm Spannweite' onKeyUp={e => {
											this.setState({ span : e.target.value });
											let val = e.target.value;
											if (val < 0) {
												this.setState({ spanFBClass : style.feedbackErr });
												this.setState({ spanFB : 'Mindestens 0'})
											}
											if (val > 300) {
												this.setState({ spanFBClass : style.feedbackErr });
												this.setState({ spanFB : 'Maximal 300'})
											}
											if (val >= 0 && val <= 300) {
												this.setState({ spanFBClass : style.feedbackSucc });
												this.setState({ spanFB : 'okay' });
											}
											this.getDialog();
										}}/>
									<span class={this.state.spanFBClass}>{this.state.spanFB}</span>
								</div>
								<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} outlined label='Gewicht' onKeyUp={e => {
										this.setState({ weight : e.target.value });
										if (val < 0) {
											this.setState({ weightFBClass : style.feedbackErr });
											this.setState({ weightFB : 'Mindestens 0'})
										}
										if (val > 300) {
											this.setState({ weightFBClass : style.feedbackErr });
											this.setState({ weightFB : 'Maximal 300'})
										}
										if (val >= 0 && val <= 300) {
											this.setState({ weightFBClass : style.feedbackSucc });
											this.setState({ weightFB : 'okay' });
										}
										this.getDialog();
									}}/>
									<span class={this.state.weightFBClass}>{this.state.weightFB}</span>
								</div>
							</div>
						</div>
					</Dialog.Body>
					<Dialog.Footer class={style.footer}>
						<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
						<Dialog.FooterButton raised accept={true}>Speichern</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			)
		}
		else {
			dialog = (
				<Dialog class={style.dialog} ref={newMeasurementsDialog=>{this.newMeasurementsDialog=newMeasurementsDialog;}} onAccept={() => {
					this.sendMeasurement();
					location.reload();
				}} onCancel={() => {
				}}>
					<Dialog.Header>Neue Messung erstellen</Dialog.Header>
					<Dialog.Body>
						<div class={style.inputContainer}>
							<span class={style.subHeader}>Anthropometrische Daten</span>
							<div class={style.row}>
								<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} type='number' outlined label='Größe' onKeyUp={e => {
										this.setState({ height: e.target.value });
										let val = e.target.value;
										if (val < 0) {
											this.setState({ heightFBClass : style.feedbackErr });
											this.setState({ heightFB : 'Mindestens 0'})
										}
										if (val > 300) {
											this.setState({ heightFBClass : style.feedbackErr });
											this.setState({ heightFB : 'Maximal 300' });
										}
										if (val >= 0 && val <= 300) {
											this.setState({ heightFBClass : style.feedbackSucc });
											this.setState({ heightFB : 'okay' });
										}
										this.getDialog();
									}}/>
									<span class={this.state.heightFBClass}>{this.state.heightFB}</span>
								</div>
								<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} outlined label='Größe im Sitzen' onKeyUp={e => {
										this.setState({ sittingHeight : e.target.value });
										let val = e.target.value;
										if (val < 0) {
											this.setState({ sittingFBClass : style.feedbackErr });
											this.setState({ sittingFB : 'Mindestens 0'})
										}
										if (val > 300) {
											this.setState({ sittingFBClass : style.feedbackErr });
											this.setState({ sittingFB : 'Maximal 300'})
										}
										if (val >= 0 && val <= 300) {
											this.setState({ sittingFBClass : style.feedbackSucc });
											this.setState({ sittingFB : 'okay' });
										}
										this.getDialog();
									}}/>
									<span class={this.state.sittingFBClass}>{this.state.sittingFB}</span>
								</div>
							</div>
							<div class={style.row}>
								<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} outlined label='Arm Spannweite' onKeyUp={e => {
											this.setState({ span : e.target.value });
											let val = e.target.value;
											if (val < 0) {
												this.setState({ spanFBClass : style.feedbackErr });
												this.setState({ spanFB : 'Mindestens 0'})
											}
											if (val > 300) {
												this.setState({ spanFBClass : style.feedbackErr });
												this.setState({ spanFB : 'Maximal 300'})
											}
											if (val >= 0 && val <= 300) {
												this.setState({ spanFBClass : style.feedbackSucc });
												this.setState({ spanFB : 'okay' });
											}
											this.getDialog();
										}}/>
									<span class={this.state.spanFBClass}>{this.state.spanFB}</span>
								</div>
								<div class={style.input}>
									<TextField class={style.fullWidth} min={0} max={300} outlined label='Gewicht' onKeyUp={e => {
										this.setState({ weight : e.target.value });
										if (val < 0) {
											this.setState({ weightFBClass : style.feedbackErr });
											this.setState({ weightFB : 'Mindestens 0'})
										}
										if (val > 300) {
											this.setState({ weightFBClass : style.feedbackErr });
											this.setState({ weightFB : 'Maximal 300'})
										}
										if (val >= 0 && val <= 300) {
											this.setState({ weightFBClass : style.feedbackSucc });
											this.setState({ weightFB : 'okay' });
										}
										this.getDialog();
									}}/>
									<span class={this.state.weightFBClass}>{this.state.weightFB}</span>
								</div>
							</div>
						</div>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
						<Dialog.FooterButton raised accept={true}>Speichern</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			)
		}

		this.setState({ dialog });
	}

	handleKey = (event) => {
		if(event.code == 'Enter') {
			this.sendMeasurement;
			document.removeEventListener('keyup', this.handleKey)
		}
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
							let that = this;
							document.addEventListener('keyup', function(event){
								that.handleKey(event);
							})
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
