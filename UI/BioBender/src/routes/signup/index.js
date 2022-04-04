import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/TextField/style.css';
import Button from 'preact-material-components/Button';
import style from './style';
import Input from '../../components/input/input.js';
import { route } from 'preact-router';
import Head1 from '../../components/head/head1.js';
import Auth from '../../components/state';
import { Link } from 'preact-router/match';


class Form extends Component {
	state = ({ username: '' });
	state = ({ password: '' });
	state = ({ password2: '' });
    state = ({ email: '' });
	state = ({ btnDisabled: true });
    state = ({ btnClass: undefined });
    state = ({ signupResponse: '' });


	componentWillMount = () => {
		this.setState({ btnClass: style.btnDisabled });
		this.setState({ btnDisabled: true });
	}


	// Check Inputs and Enable Button
	handleChange = () => {
		this.setState({ username: document.getElementById('usernameInput').value });
		this.setState({ password: document.getElementById('passwordInput').value });
		this.setState({ email: document.getElementById('emailInput').value });
		this.setState({ password2: document.getElementById('password2Input').value });

		if (this.state.password !== this.state.password2) {
			this.setState({ signupResponse: 'Passwörter stimmen nicht überein.' });
		}
		else {
			this.setState({ signupResponse: '' });
		}


		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		) && this.state.username.length > 2 && this.state.username.length < 33 && this.state.password.length > 3 && this.state.password.length < 17 &&
		this.state.password === this.state.password2) {
			this.setState({ btnDisabled: false });
			this.setState({ btnClass: style.btnEnabled });
		}
		else {
			this.setState({ btnDisabled: true });
			this.setState({ btnClass: style.btnDisabled });
		}
	}


	// Send Request
	signup = () => {
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
					route('/login', true);
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ signupResponse: response.msg });
					}
					catch (err) {}

				}
			}
			else {
				this.setState({ signupResponse: 'Ups, something went wrong' });
			}
		};

		let data =  `{
            "username": "${this.state.username}",
            "email": "${this.state.email}",
            "password": "${this.state.password}",
			"is_admin": ${false}
        }`;

		xhttp.send(data);

	}


	render() {
		return (
				<Card class={style.card}>
					<div class={style.logoContainer}>
						<img class={style.logo} src='../../logo/StarsLogoTrans.png' />
					</div>
					<div class={style.inputContainer}>
						<div class={style.loginLabel}>Registrierung</div>
						<Input inputId="usernameInput" inputLabel="Benutzername" type="username" onChange={this.handleChange} />
						<Input inputId="emailInput" inputLabel="E-Mail" type="email" onChange={this.handleChange} />
						<Input inputId="passwordInput" inputLabel="Passwort" type="password" onChange={this.handleChange} />
						<Input inputId="password2Input" inputLabel="Passwort wiederholen" type="password" onChange={this.handleChange} />
						<div style={{ color: '#B1262D' }}>{this.state.signupResponse }</div>
						<div class={style.btnContainer}>
							<Button className={this.state.btnClass} raised onClick={this.signup} disabled={this.state.btnDisabled}>registrieren</Button>
							<Link href="/login" data-native>anmelden</Link>
						</div>
					</div>
				</Card>
		);
	}

}

export default class Signup extends Component {
	render() {
		return (
			<Form />
		);
	}
}