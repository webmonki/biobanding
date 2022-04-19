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
import Table from '../../components/table';

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
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Benutzer erfolgreich geladen' });
				that.setState({ users : response['users:'] });
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
		let url = Auth.url + '/api/user/' + id
		let xhttp = new XMLHttpRequest();

		xhttp.open('DELETE', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Benutzer erflogreich gelöscht' });
				let newUserList = []
				that.state.users.forEach(user => {
					if (user.userID != id) {
						newUserList.push(user)
					}
				})
				that.setState({ users : newUserList });
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
		document.addEventListener('keyup', this.handleKeyEdit)

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
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Benutzer erfolgreich geändert' });

				let newUserList = []
				let editId = that.state.editId
				that.state.users.forEach(user => {
					if (user.userID != editId) {
						newUserList.push(user)
					}
					else {
						user.username = that.state.editUsername;
						user.email = that.state.editEmail;
						newUserList.push(user);
					}
				})
				that.setState({ users : newUserList });
				that.editUserDialog.MDComponent.close()


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

		let data = `{
			"username": "${ this.state.editUsername }",
			"email": "${ this.state.editEmail }"
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
				that.setState({ responseFBClass : style.feedbackSucc });
				that.setState({ responseFB : 'Benutzer erfolgreich angelegt' });

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
							<div class={style.input}>
								<TextField outlined label='Benutzername' class={style.fullWidth} value={this.state.editUsername} onKeyUp={e => {
									this.setState({ editUsername : e.target.value })
									let val = e.target.value
									if (val.length < 1) {
										this.setState({ usernameFBClass : style.feedbackErr })
										this.setState({ usernameFB : 'Mindestens 1 Zeichen'})
									}
									if (val.length > 32) {
										this.setState({ usernameFBClass : style.feedbackErr })
										this.setState({ usernameFB : 'Maximal 32 Zeichen'})
									}
									if (val.length > 0 && val.length < 33) {
										this.setState({ usernameFBClass : style.feedbackSucc })
										this.setState({ usernameFB : 'okay' })
									}
									this.getDialog();
								}}/>
								<span class={this.state.usernameFBClass}>{this.state.usernameFB}</span>
							</div>
							<div class={style.input}>
								<TextField outlined label='E-Mail' class={style.fullWidth} value={this.state.editEmail} onInput={e =>{
									this.setState({ editEmail : e.target.value });
									let val = e.target.value
									if (val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
										this.setState({ emailFBClass : style.feedbackSucc });
										this.setState({ emailFB : 'okay'})
									}
									else {
										this.setState({ emailFBClass : style.feedbackErr });
										this.setState({ emailFB : 'keine E-Mail'})
									}
									this.getDialog();
								}}/>
								<span class={this.state.emailFBClass}>{this.state.emailFB}</span>
							</div>
						</div>
					</div>
				</Dialog.Body>
				<Dialog.Footer class={style.footer}>
					<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
					<Dialog.FooterButton style={{color : 'white'}} class="mdc-button mdc-theme--primary-bg" raised accept={true}>Speichern</Dialog.FooterButton>
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
							<div class={style.input}>
								<TextField outlined label='Benutzername' class={style.fullWidth} value={this.state.username} onKeyUp={e => {
									this.setState({ username : e.target.value })
									let val = e.target.value
									if (val.length < 1) {
										this.setState({usernameFBClass : style.feedbackErr})
										this.setState({ usernameFB : 'Mindestens 1 Zeichen'})
									}
									if (val.length > 32) {
										this.setState({usernameFBClass : style.feedbackErr })
										this.setState({ usernameFB : 'Maximal 32 Zeichen'})
									}
									if (val.length > 0 && val.length < 33) {
										this.setState({usernameFBClass : style.feedbackSucc })
										this.setState({usernameFB : 'okay'})
									}
									this.getDialog();
								}}/>
								<span class={this.state.usernameFBClass}>{this.state.usernameFB}</span>
							</div>
							<div class={style.input}>
								<TextField outlined label='E-Mail' value={this.state.email} class={style.fullWidth} onInput={e =>{
									this.setState({ email : e.target.value });
									let val = e.target.value
									if (val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
										this.setState({ emailFBClass : style.feedbackSucc });
										this.setState({ emailFB : 'okay'})
									}
									else {
										this.setState({ emailFBClass : style.feedbackErr });
										this.setState({ emailFB : 'keine E-Mail'})
									}
									this.getDialog();
								}}/>
								<span class={this.state.emailFBClass}>{this.state.emailFB}</span>
							</div>
						</div>
						<div class={style.row}>
							<div class={style.input}>
								<TextField type='password' outlined label='Passwort' class={style.fullWidth} onKeyUp={e => {
									this.setState({ password : e.target.value })
									let val = e.target.value;
									if (val.length < 4) {
										this.setState({ passwordFBClass : style.feedbackErr });
										this.setState({ passwordFB : 'Mindetsens 4 Zeichen'})
									}
									if (val.length > 16) {
										this.setState({ passwordFBClass : style.feedbackErr });
										this.setState({ passwordFB : 'Maximal 16 Zeichen'})
									}
									if (val.length > 3 && val.length < 17) {
										this.setState({ passwordFBClass : style.feedbackSucc });
										this.setState({ passwordFB : 'Länge okay'})
									}
									if (this.state.password == this.state.password2) {
										this.setState({ passwordSameFBClass : style.feedbackSucc })
										this.setState({ passwordSameFB : 'Passwörter stimmen überein'})
									}
									else {
										this.setState({ passwordSameFBClass : style.feedbackErr })
										this.setState({ passwordSameFB : 'Passwörter stimmen nicht überein'})
									}
									this.getDialog();
								}}/>
								<span class={this.state.passwordFBClass}>{this.state.passwordFB}</span>
							</div>
							<div class={style.input}>
								<TextField type='password' outlined label='Passwort' class={style.fullWidth} onKeyUp={e => {
									this.setState({ password2 : e.target.value })
									let val = e.target.value;
									if (val.length < 4) {
										this.setState({ password2FBClass : style.feedbackErr });
										this.setState({ password2FB : 'Mindetsens 4 Zeichen'})
									}
									if (val.length > 16) {
										this.setState({ password2FBClass : style.feedbackErr });
										this.setState({ password2FB : 'Maximal 16 Zeichen'})
									}
									if (val.length > 3 && val.length < 17) {
										this.setState({ password2FBClass : style.feedbackSucc });
										this.setState({ password2FB : 'Länge okay'})
									}
									if (this.state.password == this.state.password2) {
										this.setState({ passwordSameFBClass : style.feedbackSucc })
										this.setState({ passwordSameFB : 'Passwörter stimmen überein'})
									}
									else {
										this.setState({ passwordSameFBClass : style.feedbackErr })
										this.setState({ passwordSameFB : 'Passwörter stimmen nicht überein'})
									}
									this.getDialog();
								}}/>
								<span class={this.state.password2FBClass}>{this.state.password2FB}</span>
							</div>
						</div>
						<div class={style.pwVal}>
							<span class={this.state.passwordSameFBClass}>{this.state.passwordSameFB}</span>
						</div>
						<div class={style.switchContainer}>
							<label for='adminSwitch'>Admin</label>
							<Switch id='adminSwitch' onChange={() => {
								this.setState({ admin : document.getElementById('adminSwitch').checked })
							}}/>
						</div>
					</div>
				</Dialog.Body>
				<Dialog.Footer class={style.footer}>
					<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
					<Dialog.FooterButton style={{color : 'white'}} class="mdc-button mdc-theme--primary-bg" raised accept={true}>Speichern</Dialog.FooterButton>
				</Dialog.Footer>
			</Dialog>
			</div>
		)

		this.setState({ dialog });
	}


	showNewUserDialog = () => {
		this.newUserDialog.MDComponent.show();
		document.addEventListener('keyup', this.handleKey)
	}

	handleKey = (event) => {
		if(event.code == 'Enter') {
			this.sendData();
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	handleKeyEdit = (event) => {
		if(event.code == 'Enter') {
			this.editData();
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/users' fitPageSize={this.fitPageSize}/>
				<span class={style.pageHeader}>Benutzer</span>
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
					<Table editable={true} data={this.state.users} pageSize={11} clickEdit={this.showDialog} idKey='userID'/>
				</Card>
				<div class={style.feedbackContainer}>
					<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
				</div>
				{this.state.dialog}
			</div>
		);
	}
}