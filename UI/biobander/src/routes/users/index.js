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
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';

export default class Users extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });
		this.setState({ admin : false });

		this.getData();
		this.getDialog();
	}

	componentWillUnmount = () => {
		document.removeEventListener('keyup', this.handleKey)
	}

	fitPageSize = (large) => {
		large ? this.setState({pageClass : style.pageLarge }) : this.setState({pageClass : style.pageSmall})
	}

	showTable = (editable) => {
		
		let data = this.state.users

		let content = (
			<div class={style.tableContainer}>
				{createTable(data, editable, this.showDialog, this.checkDelete)}
			</div>
		);
		this.setState({ content });
	};

	getData = () => {
		let that = this;
		let url = Auth.url + '/api/users';
		let xhttp = new XMLHttpRequest();
	
		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				that.setState({ users : response['users:'] });
				that.state.users.forEach(user => {
					user.id = user.userID
				})
				that.showTable(true);
			}
			else {
			}
		};
		xhttp.send();
	}

	delete = (id) => {

		let that = this;
		let url = Auth.url + '/api/user/' + id
		let xhttp = new XMLHttpRequest();

		xhttp.open('DELETE', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let newUserList = []
				that.state.users.forEach(user => {
					if (user.id != id) {
						newUserList.push(user)
					}
				})
				that.setState({ users : newUserList });
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

		this.state.users.forEach(user => {
			if (user.userID == id){
				this.setState({ editUsername : user.username });
				this.setState({ editEmail : user.email });
			}
		})

		this.getDialog();

		this.editUserDialog.MDComponent.show();
	}

	editData = () => {
		let that = this;
		let url = Auth.url + '/api/user/' + this.state.editId;
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

		let data = `{
			"username": "${ this.state.username }",
			"email": "${ this.state.email }"
		}`;

		xhttp.send(data);
	}

	sendData = () => {		
		let that = this;
		let url = Auth.url + '/api/users/register';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				console.log(response)
			}
			else {
				let response = JSON.parse(this.responseText);
				console.log(response)
			}
		};

		let data =  `{
            "username": "${this.state.username}",
            "email": "${this.state.email}",
            "password": "${this.state.password}",
			"is_admin": ${this.state.admin}
        }`;


		xhttp.send(data);
	}

	getDialog = () => {
		let dialog = (
			<div>
				<Dialog class={style.dialog} ref={editUserDialog=>{this.editUserDialog=editUserDialog;}} onAccept={() => {
				this.editData();
				location.reload();
			}} onCancel={() => {
				document.removeEventListener('keyup', this.handleKey)
			}}>
				<Dialog.Header>Benutzer bearbeiten</Dialog.Header>
				<Dialog.Body>
					<div class={style.inputContainer}>
						<span class={style.subHeader}>Benutzer Daten</span>
						<div class={style.row}>
							<TextField outlined label='Benutzername' class={style.input} value={this.state.editUsername} onKeyUp={e =>
								this.setState({ username : e.target.value })}/>
							<TextField outlined label='E-Mail' class={style.input} value={this.state.editEmail} onKeyUp={e => 
								this.setState({ email : e.target.value })}/>
						</div>
					</div>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
					<Dialog.FooterButton raised accept={true}>Speichern</Dialog.FooterButton>
				</Dialog.Footer>
			</Dialog>
			<Dialog class={style.dialog} ref={newUserDialog=>{this.newUserDialog=newUserDialog}} onAccept={() => {
				this.sendData();
				location.reload();
			}} onCancel={() => {
				document.removeEventListener('keyup', this.handleKey)
			}}>
				<Dialog.Header>Neuen Benutzer anlegen</Dialog.Header>
				<Dialog.Body>
					<div class={style.inputContainer}>
						<span class={style.subHeader}>Login Daten</span>
						<div class={style.row}>
							<TextField outlined label='Benutzername' class={style.input} onKeyUp={e =>
								this.setState({ username : e.target.value })} />
							<TextField outlined label='E-Mail' class={style.input} onKeyUp={e =>
								this.setState({ email : e.target.value})} />
						</div>
						<div class={style.row}>
							<TextField outlined label='Passwort' class={style.input} onKeyUp={e =>
								this.setState({ password : e.target.value })}/>
							<TextField outlined label='Passwort wiederholen' class={style.input} onKeyUp={e =>
								this.setState({ password2 : e.target.value })}/>
						</div>
						<div class={style.switchContainer}>
							<label for='adminSwitch'>Admin</label>
							<Switch id='adminSwitch' onChange={() => {
								this.setState({ admin : document.getElementById('adminSwitch').checked })
							}}/>
						</div>
					</div>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
					<Dialog.FooterButton raised accept={true}>Erstellen</Dialog.FooterButton>
				</Dialog.Footer>
			</Dialog>
			</div>
		)

		this.setState({ dialog });
	}


	showNewUserDialog = () => {
		this.newUserDialog.MDComponent.show();
		let that = this;
		document.addEventListener('keyup', function(event){
			that.handleKey(event);
		})
	}

	handleKey = (event) => {
		if(event.code == 'Enter') {
			this.sendData();
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/users' fitPageSize={this.fitPageSize}/>
				<div class={style.btnContainer}>
					<Button class={style.deleteBtn} onClick={this.checkDelete}>
						<List.ItemGraphic class={`${"mdc-theme--primary"} ${style.icon}`}>delete</List.ItemGraphic>
					</Button>
					<Button raised class={`${"mdc-button mdc-theme--primary-bg"} ${style.roundBtn}`} onClick={this.showNewUserDialog}>
							  <i class="material-icons mdc-button__icon mdc-theme-on-primary" aria-hidden="true">add</i>
							  <span class="mdc-button__label mdc-theme-on-primary">erstellen</span>
						</Button>
				</div>
				<Card class={style.card}>
					{this.state.content}
				</Card>
				{this.state.dialog}
			</div>
		);
	}
}