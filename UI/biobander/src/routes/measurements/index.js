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
				{createTable(data, editable, this.showDialog, this.checkDelete)}
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
			}
			else {
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
				that.setState({ measurements : response['userdetails'] });
				that.showTable(false);
			}
			else {
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
				that.setState({ measurements : response['measurements:'] });
				that.showTable(true);
			}
			else {
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
		this.setState({ editId : id });
		this.editDialog.MDComponent.show();
	}

	getDialog = () => {
		let dialog = (
			<Dialog class={style.dialog} ref={editDialog=>{this.editDialog=editDialog;}} onAccept={() => {
				this.editData();
				location.reload();
			}} onCancel={() => {
				document.removeEventListener('keyup', this.handleKey)
			}}>
				<Dialog.Header>Neue Messung erstellen</Dialog.Header>
				<Dialog.Body>
					<div class={style.inputContainer}>
						<span class={style.subHeader}>Anthropometrische Daten</span>
						<div class={style.row}>
							<TextField outlined label='Größe' class={style.input} onKeyUp={e => {
								this.setState({ height: e.target.value });
							}}/>
							<TextField outlined label='Größe im Sitzen' class={style.input} onKeyUp={e => {
								this.setState({ sittingHeight : e.target.value });
							}}/>
						</div>
						<div class={style.row}>
							<TextField outlined label='Arm Spannweite' class={style.input} onKeyUp={e => {
								this.setState({ span : e.target.value });
							}}/>
							<TextField outlined label='Gewicht' class={style.input} onKeyUp={e => {
								this.setState({ weight : e.target.value });
							}}/>
						</div>
					</div>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
					<Dialog.FooterButton raised accept={true}>Speichern</Dialog.FooterButton>
				</Dialog.Footer>
			</Dialog>
		)

		this.setState({ dialog });
	}

	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/measurements' fitPageSize={this.fitPageSize}/>
				<div>
					{this.state.btn}
				</div>
				<Card class={style.card}>
					{this.state.content}
				</Card>
				{this.state.dialog}
			</div>
		);
	}
}