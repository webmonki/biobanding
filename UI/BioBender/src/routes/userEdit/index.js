import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js';
import List from 'preact-material-components/List';
import resize from '../../components/resize';
import createTable from '../../components/table/table';

export default class UserEdit extends Component{


	
	componentWillMount = () => {
		this.setState({ users : [] });

		this.setState({ username : '' });
		this.setState({ email : '' });
		this.setState({ password : '' });
		this.setState({ password2 : '' });

		this.setState({ sendBtnClass : style.btnDisabled });
		this.setState({ sendBtnDisabled : true });

		this.setState({ editBtnClass : style.btnDisabled });
		this.setState({ editBtnDisabled : true });

		this.getData();
	}
	
	start_resizeEvent = () => {
		resize('userContainer', 'userResizeBtn')
	};

	getData = () => {
		let that = this;
		let url = Auth.url + '/api/users';
		let xhttp = new XMLHttpRequest();
	
		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);
	
		xhttp.onreadystatechange = function() {
	
	
			if([0,1,2,3,4].includes(this.readyState)) {
	
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						sessionStorage.setItem('users', JSON.stringify(response['users:']));
						that.setState({ users : response['users:'] });
						that.setState({ feedback: response.msg });
					}
					catch(err) {}
	
	
					let idList = [];
					that.state.users.forEach(user => {
						idList.push(user.userID)
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

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch(err) {}
	
				}
			}
		}
		xhttp.send();
	}

	sendData = () => {
		this.setState({ admin : document.getElementById('admin_check').checked });
		
		let that = this;
		let url = Auth.url + '/api/users/register';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');

		xhttp.onreadystatechange = function() {


			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					// If Request is Ok go to Login
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch (err) {}


					that.setState({ feedbackClass: style.feedbackSucc });
					that.setState({ currentPage : undefined });
					that.getData();
					that.showTable();

				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
						that.setState({ feedbackClass : style.feedbackErr });

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch (err) {}

				}
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

	delete = (id) => {

		let that = this;
		let url = Auth.url + '/api/user/' + id
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

					let newUserList = []
					that.state.users.forEach(user => {
						if (user.userID != id) {
							newUserList.push(user)
						}
					})
					sessionStorage.setItem('users', JSON.stringify(newUserList));
					that.setState({ users : newUserList });
					that.showTable();


				}
				else {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackErr });
					that.handleClickDelete();
				}
			}
		};
		xhttp.send();
	}

	editData = () => {
		let that = this;
		let url = Auth.url + '/api/user/' + this.state.currentEdit;
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

					that.state.users.forEach(user => {
						if (user.userID == that.state.currentEdit) {
							user.username = that.state.username
							user.email = that.state.email
						}
					})

					that.setState({ feedbackClass: style.feedbackSucc });
					that.setState({ currentEdit : undefined });
					that.showTable();


				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackErr });
					that.handleClickEdit();
				}
			}
		};

		let data = `{
			"username": "${ this.state.username }",
			"email": "${ this.state.email }"
		}`;

		xhttp.send(data);
	};

	handleChangeNew = () => {
		this.setState({ username: document.getElementById('inputName').value });
		this.setState({ email: document.getElementById('inputEmail').value });
		this.setState({ password: document.getElementById('inputPassword1').value });
		this.setState({ password2: document.getElementById('inputPassword2').value });

		if (this.state.password !== this.state.password2) {
			this.setState({ feedback: 'Passwörter stimmen nicht überein.' });
			this.setState({ feedbackClass : style.feedbackErr });
		}
		else {
			this.setState({ feedback: '' });
		}


		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		) && this.state.username.length > 2 && this.state.username.length < 33 && this.state.password.length > 3 && this.state.password.length < 17 &&
		this.state.password === this.state.password2) {
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
				<Input inputId="inputName" inputLabel="Benutzername" type="username" onChange={this.handleChangeNew}/>
				<Input inputId="inputEmail" inputLabel="E-Mail" type="email" onChange={this.handleChangeNew} />
				<Input inputId="inputPassword1" inputLabel="Passwort" type="password" onChange={this.handleChangeNew} />
				<Input inputId="inputPassword2" inputLabel="Passwort wiederholen" type="password" onChange={this.handleChangeNew} />
				<div class={style.checkbox}>
					<input type="checkbox" id="admin_check" name="admin_check" />
					<label class={style.checkboxLabel} for="admin_check">Admin</label>
				</div>
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
		this.setState({ username: document.getElementById('inputEditName').value });
		this.setState({ email: document.getElementById('inputEditEmail').value });


		if (this.state.name !== '' && this.state.email !== '' && this.state.currentIds.length != 0) {
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
				<div class={style.changeLabel}>BenutzerId: {id}</div>
				<Input inputId="inputEditName" inputLabel="Benutzername" type="username" onChange={this.handleChangeEdit}/>
				<Input inputId="inputEditEmail" inputLabel="E-mail" type="email" onChange={this.handleChangeEdit} />
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


	showTable = () => {;
		
		if (this.state.users.length == 0) {
			try {
				var data = JSON.parse(sessionStorage.users);
			}
			catch (err) {}
		}
		else {
			var data = this.state.users
		}


		let content = (
				<div class={style.tableContainer}>
					{createTable(data, true, this.handleClickNew, this.handleClickEdit, this.delete)}
				</div>
		);
		this.setState({ content });
	};


	render() {
		return (
				<Card class={style.card}>
						{this.state.content}
						<div class={style.resizeUI} id='userResizeBtn' onMouseDown={this.start_resizeEvent}>
							<List.ItemGraphic class={style.resizeIcon}>unfold_more</List.ItemGraphic>
						</div>
				</Card>
		);
	}
}