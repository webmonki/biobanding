import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head2 from '../../components/head/head2.js';
import Auth from '../../components/state.js';
import { route } from 'preact-router';
import ChangeData from '../changeData';
import Input from '../../components/input/input.js';

export default class Profile extends Component {

	componentWillMount = () => {
		this.setState({ userId: Auth.getUser().id });
		this.setState({ userName: Auth.getUser().name });
		this.setState({ email: Auth.getUser().email });

		this.setState({ currentUserName: Auth.getUser().name });
		this.setState({ currentEmail: Auth.getUser().email });

		this.setState({ btnDisabled: true });
		this.setState({ btnClass: style.btnDisabled });
	}

	// Request to post new Email
	sendData = () => {
		let that = this;
		let url = Auth.url + '/api/users/edit';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {

			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);

						Auth.setToken(response.token)
					}
					catch (err) {}

					Auth.setEmail(that.state.email);
					Auth.setUsername(that.state.userName);

					that.setState({ currentUserName : that.state.userName });
					that.setState({ currentEmail : that.state.email });
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
						that.setState({ feedbackStyle : style.feedbackErr });

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch (err) {}
				}
			}
		};

		let data = `{
			"userID": "${this.state.userId}",
			"username": "${this.state.userName}",
			"email": "${this.state.email}"
		}`;

		xhttp.send(data);

	}

	// Check Input and Enable Button
	handleChange = () => {
		this.setState({ email: document.getElementById('emailInput').value });
		this.setState({ userName : document.getElementById('usernameInput').value });
		

		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		) && this.state.userName.length > 2 && this.state.userName.length < 33){
			this.setState({ btnDisabled: false });
			this.setState({ btnClass: style.btnEnabled });
		}
		else {
			this.setState({ btnDisabled: true });
			this.setState({ btnClass: style.btnDisabled });
		}
	}

	render() {
		return (
			<div class={style.container}>
				<div class={style.profileContainer}>
					<Head2 headText="Profil" />
					<Card class={style.card}>
						<div class={style.contentContainer}>
							<div class={style.data}>Benutzer Id: {this.state.userId}</div>
							<div class={style.data}>Benutzername: {this.state.currentUserName}</div>
							<div class={style.data}>E-Mail: {this.state.currentEmail}</div>
						</div>
					</Card>
				</div>
				<div class={style.cdContainer}>
					<Head2 headText="E-Mail ändern" />
					<Card class={style.card}>
						<div class={style.inputContainer}>
							<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
							<Input inputId="usernameInput" inputLabel="Benutzername" type="username" onChange={this.handleChange} />
							<Input inputId="emailInput" inputLabel="E-Mail" type="email" onChange={this.handleChange} />
							<Button class={this.state.btnClass} raised disabled={this.state.btnDisabled} onClick={this.sendData}>E-Mail ändern</Button>
						</div>
					</Card>
				</div>
			</div>
		);
	}

}