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

export default class UserAdmin extends Component{
	state = ({ navNewClass : undefined });
	state = ({ navViewClass: undefined });
	state = ({ navEditClass : undefined });
	state = ({ navDeleteClass: undefined });
	
	state = ({ navTextNewClass : undefined });
	state = ({ navTextViewClass : undefined });
	state = ({ navTextEditClass : undefined });
	state = ({ navTextDeleteClass : undefined });
	
	state = ({ navIconNewClass : undefined });
	state = ({ navIconViewClass : undefined });
	state = ({ navIconEditClass :  undefined });
	state = ({ navIconDeleteClass : undefined });
	
	state = ({ userId : '' });
	state = ({ name : '' });
	state = ({ email : '' });
	state = ({ password : '' });
	state = ({ password2 : '' });
	state = ({ admin : false });
	
	
	state = ({ sendBtnClass : undefined });
	state = ({ sendBtnDisabled : undefined });

	state = ({ editBtnClass : undefined });
	state = ({ editBtnDisabled : undefined });
	
	state = ({ feedback : '' });
	state = ({ feedbackClass : undefined });
	
	state = ({ currentPage : undefined });
	state = ({ currentIds : undefined });
	state = ({ currentEdit : undefined });
	state = ({ currentDelete : undefined });

	state = ({ users : undefined });

	componentWillMount = () => {
		this.setState({ navNewClass: style.navNotSelected });
		this.setState({ navViewClass: style.navNotSelected });
		this.setState({ navEditClass: style.navNotSelected });
		this.setState({ navDeleteClass: style.navNotSelected });

		this.setState({ navIconNewClass: style.navIconNotSelected });
		this.setState({ navIconViewClass: style.navIconNotSelected });
		this.setState({ navIconEditClass: style.navIconNotSelected });
		this.setState({ navIconDeleteClass: style.navIconNotSelected });

		this.setState({ navTextNewClass: style.navTextNotSelected });
		this.setState({ navTextViewClass: style.navTextNotSelected });
		this.setState({ navTextEditClass: style.navTextNotSelected });
		this.setState({ navTextDeleteClass: style.navTextNotSelected });

		this.setState({ name : '' });
		this.setState({ email : '' });
		this.setState({ password : '' });
		this.setState({ password2 : '' });
		this.setState({ admin : false });

		this.setState({ users : [] });
		this.setState({ currentIds : [] });
		this.setState({ currentEdit: '' });
		this.setState({ currentDelete : '' });

		this.setState({ editBtnClass: style.btnDisabled });
		this.setState({ editBtnDisabled: true });

		this.setState({ sendBtnClass : style.btnDisabled });
		this.setState({ sendBtnDisabled : true });

		this.getData();

		this.handleClickView();
		this.showTable();
	}

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
			else {
				this.setState({ loginResponse: 'Ups, something went wrong' });
			}
		}
	
		xhttp.send();
	
	}
	
	back = () => {
		this.setState({ currentPage : this.state.currentPage - 1});
		this.handleClickView();
	}
	
	forward = () => {
		this.setState({ currentPage : this.state.currentPage + 1});
		this.handleClickView();
	}
	
	disableBackBtn = () => {
		this.setState({ backBtnClass : style.btnDisabled });
		this.setState({ backBtnDisabled : true });
		this.setState({ backIconClass : style.btnIconDisabled });
	}
	
	enableBackBtn = () => {
		this.setState({ backBtnClass : style.btnEnabled });
		this.setState({ backBtnDisabled : false });
		this.setState({ backIconClass : style.btnIcon });
	}
	
	disableForwardBtn = () => {
		this.setState({ forwardBtnClass : style.btnDisabled });
		this.setState({ forwardBtnDisabled : true });
		this.setState({ forwardIconClass : style.btnIconDisabled });
	}
	
	enableForwardBtn = () => {
		this.setState({ forwardBtnClass : style.btnEnabled });
		this.setState({ forwardBtnDisabled : false });
		this.setState({ forwardIconClass : style.btnIcon });
	}

	highlightViewTab = () => {
		this.setState({ navNewClass: style.navNotSelected });
		this.setState({ navViewClass: style.navSelected });
		this.setState({ navEditClass: style.navNotSelected });
		this.setState({ navDeleteClass: style.navNotSelected });


		this.setState({ navIconNewClass: style.navIconNotSelected });
		this.setState({ navIconViewClass: style.navIconSelected });
		this.setState({ navIconEditClass: style.navIconNotSelected });
		this.setState({ navIconDeleteClass: style.navIconNotSelected });

		this.setState({ navTextNewClass: style.navTextNotSelected });
		this.setState({ navTextViewClass: style.navTextSelected });
		this.setState({ navTextEditClass: style.navTextNotSelected });
		this.setState({ navTextDeleteClass: style.navTextNotSelected });
	}

	handleDropDownClick = (id) => {
		this.setState({ currentPage : this.state.currentIds.indexOf(id) })
		this.handleClickView();
	}


	handleTableClick = (row) => {
		this.setState({ currentPage : row.userID - 1 });
		this.handleClickView();
	}

	

	showTable = () => {;
		
		let cols = ['Benutzer ID', 'Benutzername', 'Email']

		let tableHeader = (
				<tr>
					<th class={style.thIconContainer} onClick={this.handleClickNew}>
						<List.ItemGraphic class={style.thIcon}>add_circle_outline</List.ItemGraphic>
					</th>
					{cols.map((name) => <th>{name}</th>)}
				</tr>
		)
		
		if (this.state.users.length == 0) {
			var data = JSON.parse(sessionStorage.users);
		}
		else {
			var data = this.state.users
		}

		console.log("DATA: ", data)

		let tableBody = (
			<tbody>
				{data.map((row) => 
					<tr onClick={() => this.handleTableClick(row)}>
						<td class={style.tdIconContainer}>
							<List.ItemGraphic class={style.tdIcon}>edit</List.ItemGraphic>
							<List.ItemGraphic onClick={() => this.delete(row.userID)} class={style.tdIcon}>delete</List.ItemGraphic>
						</td>
						<td>{row.userID}</td>
						<td>{row.username}</td>
						<td>{row.email}</td>
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
			<div class={style.viewContainer}>
				<div class={style.center}>
					<Button raised class={style.navBtn} onClick={this.handleClickView}>
						<div class={style.btnLabel}>
							<List.ItemGraphic class={style.btnIcon}>arrow_back</List.ItemGraphic>
							<div class={style.labelText}>Zurück</div>
						</div>
					</Button>
				</div>
				<div class={style.tableContainer}>
					{table}
				</div>
			</div>
		);
		this.setState({ content });
	};

	highlightEditTab = () => {
		this.setState({ navNewClass: style.navNotSelected });
		this.setState({ navViewClass: style.navNotSelected });
		this.setState({ navEditClass: style.navSelected });
		this.setState({ navDeleteClass: style.navNotSelected });


		this.setState({ navIconNewClass: style.navIconNotSelected });
		this.setState({ navIconViewClass: style.navIconNotSelected });
		this.setState({ navIconEditClass: style.navIconSelected });
		this.setState({ navIconDeleteClass: style.navIconNotSelected });

		this.setState({ navTextNewClass: style.navTextNotSelected });
		this.setState({ navTextViewClass: style.navTextNotSelected });
		this.setState({ navTextEditClass: style.navTextSelected });
		this.setState({ navTextDeleteClass: style.navTextNotSelected });
	};

	handleChangeEdit = () => {
		this.setState({ name: document.getElementById('inputEditName').value });
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

					that.setState({ feedbackClass: style.feedbackSucc });
					that.setState({ currentEdit : '' });
					that.getData();
					that.handleClickEdit();


				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackErr });
					that.handleClickEdit();
				}
			}
			else {
				this.setState({ loginResponse: 'Ups, something went wrong' });
			}
		};

		let data = `{
			"username": "${ this.state.name }",
			"email": "${ this.state.email }"
		}`;

		xhttp.send(data);
	};


	handleClickEdit = () => {
		this.highlightEditTab();

		this.getData();


		if (this.state.currentEdit == '') {
			this.setState({ currentEdit : this.state.currentIds.slice(-1)[0] });
			if (this.state.currentDelete == undefined){
				this.setState({ currentEdit : '' })
			}
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
				<Input inputId="inputEditName" inputLabel="Benutzername" type="username" onChange={this.handleChangeEdit}/>
				<Input inputId="inputEditEmail" inputLabel="E-mail" type="email" onChange={this.handleChangeEdit} />
				<div class={style.center}>
					<Button raised class={this.state.editBtnClass} onClick={this.editData} disabled={this.state.editBtnDisabled}>Ändern</Button>
				</div>
			</div>
		)

		this.setState({ content });
	};
	
	
	handleClickView = () => {
	
		this.highlightViewTab();
	
		if (this.state.users.length == 0){
			try {
				this.setState({ users : JSON.parse(sessionStorage.users) });
				that.setState({ feedbackClass: style.feedbackSucc });
				that.setState({ feedback: "Daten erfolgreich geladen." });
			}
			catch(err) {
				this.setState({ feedback: "Keine Daten zum laden." });
				this.setState({ feedbackClass: style.feedbackErr });
				this.setState({ users : JSON.parse(sessionStorage.users) });
			}
		}
	
	
		let users = this.state.users
	
		if (this.state.currentPage == undefined && users.length > 0) {
			this.setState({ currentPage : users.length - 1 })
		}
	
		this.state.currentPage > 0 ? this.enableBackBtn() : this.disableBackBtn();
		this.state.currentPage < this.state.users.length - 1 ? this.enableForwardBtn() : this.disableForwardBtn();
	
	
		if (this.state.currentPage != undefined) {
			this.setState({ userId : users[this.state.currentPage].userId});
			this.setState({ name : users[this.state.currentPage].username });
			this.setState({ email : users[this.state.currentPage].email });
		}
		else {
			this.setState({ userId : ''});
			this.setState({ name : '' });
			this.setState({ email : '' });
		}
		
	
		let content = (
			<div class={style.viewContainer}>
				<div class={style.centerFB}>
					<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				</div>
				<div class={style.btnRow}>
					<Button raised class={this.state.backBtnClass} disabled={this.state.backBtnDisabled} onClick={this.back}>
						<List.ItemGraphic class={this.state.backIconClass}>arrow_back</List.ItemGraphic>
					</Button>
					<Button raised class={style.navBtn} onClick={this.showTable}>
						<div class={style.btnLabel}>
							<List.ItemGraphic class={style.btnIcon}>list</List.ItemGraphic>
							<div class={style.labelText}>Tabelle</div>
						</div>
					</Button>
					<Button raised class={this.state.forwardBtnClass} disabled={this.state.forwardBtnDisabled} onClick={this.forward}>
						<List.ItemGraphic class={this.state.forwardIconClass}>arrow_forward</List.ItemGraphic>
					</Button>
				</div>
				<div class={style.viewData}>
					<div class={style.data}>
						<div class={style.dataLabel}>BenutzerId: </div>
						<div class={style.dataContent}>
							<Dropdown
								ddId={'userIdDropdown'}
								data={this.state.currentIds}
								dropdownClick={this.handleDropDownClick}
								selected={this.state.currentIds[this.state.currentPage]}/>
						</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Benutzername: </div>
						<div class={style.dataContent}>{this.state.name}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>E-mail: </div>
						<div class={style.dataContent}>{this.state.email}</div>
					</div>
				</div>
			</div>
		);
	
		this.setState({ content });
		// this.setDropDown(this.state.currentPage + 1);
	};

	highlightNewTab = () => {
		this.setState({ navNewClass: style.navSelected });
		this.setState({ navViewClass: style.navNotSelected });
		this.setState({ navEditClass: style.navNotSelected });
		this.setState({ navDeleteClass: style.navNotSelected });

		this.setState({ navIconNewClass: style.navIconSelected });
		this.setState({ navIconViewClass: style.navIconNotSelected });
		this.setState({ navIconEditClass: style.navIconNotSelected });
		this.setState({ navIconDeleteClass: style.navIconNotSelected });

		this.setState({ navTextNewClass: style.navTextSelected });
		this.setState({ navTextViewClass: style.navTextNotSelected });
		this.setState({ navTextEditClass: style.navTextNotSelected });
		this.setState({ navTextDeleteClass: style.navTextNotSelected });
	};

	handleChangeNew = () => {
		this.setState({ name: document.getElementById('inputName').value });
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
		) && this.state.name.length > 2 && this.state.name.length < 33 && this.state.password.length > 3 && this.state.password.length < 17 &&
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
					that.handleClickNew();

				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
						that.setState({ feedbackClass : style.feedbackErr });
					}
					catch (err) {}

				}
			}
			else {
				this.setState({ signupResponse: 'Ups, something went wrong' });
			}
		};

		let data =  `{
            "username": "${this.state.name}",
            "email": "${this.state.email}",
            "password": "${this.state.password}",
			"is_admin": ${this.state.admin}
        }`;

		xhttp.send(data);
	}

	handleClickNew = () => {

		this.highlightNewTab();

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
				<div class={style.center}>
					<Button raised class={this.state.sendBtnClass} onClick={this.sendData} disabled={this.state.sendBtnDisabled}>Erstellen</Button>
				</div>
			</div>
		);

		this.setState({ content });
	};

	highlightDeleteTab = () => {
		this.setState({ navNewClass: style.navNotSelected });
		this.setState({ navViewClass: style.navNotSelected });
		this.setState({ navEditClass: style.navNotSelected });
		this.setState({ navDeleteClass: style.navSelected });


		this.setState({ navIconNewClass: style.navIconNotSelected });
		this.setState({ navIconViewClass: style.navIconNotSelected });
		this.setState({ navIconEditClass: style.navIconNotSelected });
		this.setState({ navIconDeleteClass: style.navIconSelected });

		this.setState({ navTextNewClass: style.navTextNotSelected });
		this.setState({ navTextViewClass: style.navTextNotSelected });
		this.setState({ navTextEditClass: style.navTextNotSelected });
		this.setState({ navTextDeleteClass: style.navTextSelected });
	}

	handleDeleteDropDownClick = (id) => {
		this.setState({ currentDelete : id });
		this.handleClickDelete();

	}

	delete = (id) => {

		// this.setState({ currentIds : this.state.currentIds.filter(e => e !== this.state.currentDelete )});

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
					that.setState({ users : that.state.users.splice(id, 1)})
					sessionStorage.setItem('users', JSON.stringify(that.state.users));

					console.log("STATE: ", that.state.users)
					// that.getData();
					that.showTable();


				}
				else {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackErr });
					that.handleClickDelete();
				}
			}
			else {
				this.setState({ loginResponse: 'Ups, something went wrong' });
			}
		};

		xhttp.send();

	}

	handleClickDelete = () => {
		this.highlightDeleteTab();

		this.getData();


		if (this.state.currentDelete == '') {
			this.setState({ currentDelete : this.state.currentIds.slice(-1)[0] });
			if (this.state.currentDelete == undefined){
				this.setState({ currentDelete : '' })
			}
		}

		if (this.state.currentIds.length == 0) {
			this.setState({ deleteBtnClass : style.btnDisabled });
			this.setState({ deleteBtnDisabled : true });
		}
		else {
			this.setState({ deleteBtnClass : style.deleteBtn });
			this.setState({ deleteBtnDisabled : false });
		}


		let content = (
			<div class={style.deleteContainer}>
				<div class={style.centerFB}>
					<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				</div>
				<div class={style.deleteData}>
					<Dropdown
						class={style.deleteDropDown}
						ddId={'deleteIdDropdown'}
						data={this.state.currentIds}
						dropdownClick={this.handleDeleteDropDownClick}
						selected={this.state.currentDelete}
						/>
				</div>
				<div class={style.deleteData}>
					<Button raised class={this.state.deleteBtnClass} disabled={this.state.deleteBtnDisabled} onClick={this.delete}>
						Nummer: {this.state.currentDelete} löschen
					</Button>
				</div>
			</div>
		)

		this.setState({ content });
	};

	render() {
		return (
				<Card class={style.card}>
					<div class={style.navRow}>
						<div class={this.state.navNewClass} onClick={this.handleClickNew}>
							<List.ItemGraphic class={this.state.navIconNewClass}>add_circle_outline</List.ItemGraphic>
							<div class={this.state.navTextNewClass}>Neu</div>
						</div>
						<div class={this.state.navViewClass} onClick={this.handleClickView}>
							<List.ItemGraphic class={this.state.navIconViewClass}>remove_red_eye</List.ItemGraphic>
							<div class={this.state.navTextViewClass}>anzeigen</div>
						</div>
						<div class={this.state.navEditClass} onClick={this.handleClickEdit}>
							<List.ItemGraphic class={this.state.navIconEditClass}>edit</List.ItemGraphic>
							<div class={this.state.navTextEditClass}>bearbeiten</div>
						</div>
					</div>
					<div class={style.content}>
						{this.state.content}
					</div>
				</Card>
		);
	}
}