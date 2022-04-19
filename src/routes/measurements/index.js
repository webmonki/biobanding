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

export default class Measurements extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });

		let btn = (
			<Button class={style.deleteBtn} onClick={this.checkDelete}>
				<List.ItemGraphic class={`${"mdc-theme--primary"} ${style.deleteIcon}`}>delete</List.ItemGraphic>
			</Button>
		)

		if (Auth.check_admin()) {
			this.getOverview();
			this.setState({ btn : undefined });
		}
		else {
			this.getMeasurements();
			this.setState({ btn });
		}

		this.getDialog();
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
				<Table editable={editable} data={data} pageSize={11} clickEdit={this.showDialog} idKey='id' />
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
				that.showTable(false);
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

		this.setState({ editId : id });
		
		this.state.measurements.forEach(measurement => {
			if (measurement.id == id) {
				this.setState({ height : measurement.height })
				this.setState({ sittingHeight : measurement.sitting_height })
				this.setState({ span : measurement.body_span })
				this.setState({ weight : measurement.weight })
			}
		})

		this.getDialog();
		this.editDialog.MDComponent.show();
	}

	handleKey = (event) => {
		console.log("EVENT")
		if(event.code == 'Enter') {
			this.editData();
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	getDialog = () => {
		let dialog = (
			<Dialog class={style.dialog} ref={editDialog=>{this.editDialog=editDialog;}} onAccept={() => {
				this.editData();
				location.reload();
			}} onCancel={() => {
				document.removeEventListener('keyup', this.handleKey)
			}}>
				<Dialog.Header>Messung bearbeiten</Dialog.Header>
				<Dialog.Body>
					<div class={style.inputContainer}>
						<span class={style.subHeader}>Anthropometrische Daten</span>
						<div class={style.row}>
								<div class={style.input}>
									<TextField type='number' class={style.fullWidth} min={0} max={300} outlined label='Größe' value={this.state.height} onKeyUp={e => {
										let val = e.target.value;
										this.setState({ height: val });

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
									<TextField type='number' class={style.fullWidth} min={0} max={300} outlined label='Größe im Sitzen' value={this.state.sittingHeight} onKeyUp={e => {
										let val = e.target.value;
										this.setState({ sittingHeight : val });

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
									<TextField type='number' class={style.fullWidth} min={0} max={300} outlined label='Arm Spannweite' value={this.state.span} onKeyUp={e => {
											let val = e.target.value;
											this.setState({ span : val });

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
									<TextField type='number' class={style.fullWidth} min={0} max={300} outlined label='Gewicht' value={this.state.weight} onKeyUp={e => {
										let val = e.target.value
										this.setState({ weight : val });

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
					<Dialog.FooterButton style={{color : 'white'}} class="mdc-button mdc-theme--primary-bg" raised accept={true}>Speichern</Dialog.FooterButton>
				</Dialog.Footer>
			</Dialog>
		)

		this.setState({ dialog });
	}

	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/measurements' fitPageSize={this.fitPageSize}/>
				<span class={style.pageHeader}>Messungen</span>
				<div class={style.btnContainer}>
					{this.state.btn}
				</div>
				<Card class={style.card}>
					{this.state.content}
				</Card>
				<div class={style.feedbackContainer}>
					<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
				</div>
				{this.state.dialog}
			</div>
		);
	}
}