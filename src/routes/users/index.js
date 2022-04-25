import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import Navbar from '../../components/navbar/navbar';
import Auth from '../../components/state';
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
import EditUser from '../../components/dialogs/editUser';
import NewUser from '../../components/dialogs/newUser';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';

export default class Users extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });

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
				// that.setState({ responseFBClass : style.feedbackSucc });
				// that.setState({ responseFB : 'Benutzer erfolgreich geladen' });
				that.setState({ users : response['users:'] });
				that.showTable(true)
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
				// that.setState({ responseFBClass : style.feedbackSucc });
				// that.setState({ responseFB : 'Benutzer erflogreich gelöscht' });
				that.bar.MDComponent.show({
					message: `Benutzer erfolgreich gelöscht`
				})
				that.getData();
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

	showSnackbar = (text) => {
		this.bar.MDComponent.show({
			message: text
		})
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
				// that.setState({ responseFBClass : style.feedbackSucc });
				// that.setState({ responseFB : 'Benutzer erfolgreich geändert' });



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
				that.bar.MDComponent.show({
					message: 'Benutzer erfolgreich geändert'
				})




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
				// that.setState({ responseFBClass : style.feedbackSucc });
				// that.setState({ responseFB : 'Benutzer erfolgreich angelegt' });
				that.bar.MDComponent.show({
					message: 'Benutzer erfolgreich angelegt'
				})
				that.getData();
				that.newUserDialog.MDComponent.close();
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

	getDataFromDialogForEdit = (username, email) => {
		this.setState({ editUsername : username });
		this.setState({ editEmail : email })

		this.editData();
	}

	getDataFromDialogForNew = (username, email, password, admin) => {
		this.setState({ username });
		this.setState({ email });
		this.setState({ password });
		this.setState({ admin });

		this.sendData();
	}

	getDialog = () => {
		let dialog = (
			<div>
				<EditUser
					reference={editUserDialog=>{this.editUserDialog=editUserDialog;}}
					sendData={this.getDataFromDialogForEdit}
					username={this.state.editUsername}
					email={this.state.editEmail} />
				<NewUser
					reference={newUserDialog=>{this.newUserDialog=newUserDialog;}}
					sendData={this.getDataFromDialogForNew} />
			</div>
		)

		this.setState({ dialog });
	}


	showNewUserDialog = () => {
		this.newUserDialog.MDComponent.show();
	}

	showTable = (editable) => {
		
		let content = (
			<div class={style.tableContainer}>
				<Table editable={editable} data={this.state.users} pageSize={11} clickEdit={this.showDialog} idKey='userID'/>
			</div>
		);
		this.setState({ content });
	};

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
					{this.state.content}
				</Card>
				<div class={style.feedbackContainer}>
					<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
				</div>
				<div class={style.mySnackbar}>
					<Snackbar ref={bar => {this.bar=bar}} />
				</div>
				<Snackbar ref={sbar => {this.sbar=sbar}} />
				{this.state.dialog}
			</div>
		);
	}
}