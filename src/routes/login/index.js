import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import { route } from 'preact-router';
import Auth from '../../components/state.js';
import { Link } from 'preact-router/match';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';


class Form extends Component {

	componentWillMount = () => {
		this.setState({ btnDisabled: true });
	}

	componentDidMount = () => {
		this.handleChange();
		document.addEventListener('keyup', this.handleKey)

	}

	componentWillUnmount = () => {
		document.removeEventListener('keyup', this.handleKey)
	}

	handleKey = (event) => {
		if(this.state.btnDisabled == false && event.code == 'Enter') {
			this.login();
			document.removeEventListener('keyup', this.handleKey)
		}
	}


	// Check Input and Enable Button
	handleChange = () => {
		this.setState({ email: document.getElementById('emailInput').value });
		this.setState({ password: document.getElementById('passwordInput').value });
		this.setState({ loginResponse: '' });

		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		) && this.state.password.length > 3 && this.state.password.length < 17){
			this.setState({ btnDisabled: false });
		}
		else {
			this.setState({ btnDisabled: true });
		}

	}


	// Request to Post Login Data
	login = () => {
		let that = this;
		let url = Auth.url + '/api/users/login';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');

		xhttp.onreadystatechange = function() {

			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						Auth.createUser(response);
					}
					catch (err) {}
					// If Request Ok go to Home
					if (Auth.check_admin()) {
						route('/measurements', true);
					} else {
						route('/measurements', true);
					}
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						if (response.msg == 'Token is invalid') {
							Auth.logout();
							location.reload();
						}
						that.setState({ responseFBClass : style.feedbackErr });
						that.setState({ responseFB : response.msg });
					}
					catch (err) {}
				}
			}
		};

		let data =  `{
            "email": "${this.state.email}",
            "password": "${this.state.password}"
        }`;

		xhttp.send(data);

	}


	render() {
		return (
				<Card class={style.card}>
					<div class={style.logoContainer}>
						<img class={style.logo} src='../../assets/StarsLogoTrans.png' />
					</div>
					<div class={style.inputContainer}>
						<div class={style.loginLabel}>Anmeldung</div>
						<div class={style.input}>
							<TextField id='emailInput' outlined label='E-Mail' value={this.state.email} onKeyUp={e =>{
								this.handleChange();
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
							}}/>				
							<span class={this.state.emailFBClass}>{this.state.emailFB}</span>
						</div>
						<div class={style.input}>
							<TextField id='passwordInput' type='password' outlined label='Passwort' onKeyUp={e => {
								this.handleChange();
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
							}}/>
							<span class={this.state.passwordFBClass}>{this.state.passwordFB}</span>	
						</div>					
						<div class={style.btnContainer}>
							<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
							<Button class={style.input} raised onClick={this.login} disabled={this.state.btnDisabled}>anmelden</Button>
							<Link class={style.input} href="/signup" data-native>registrieren</Link>
							<Link class={style.input} href="/forgot" data-native>Passwort vergessen</Link>
						</div>
					</div>
				</Card>
		);
	}

}


export default class Login extends Component {
	render() {
		return (
			<Form />
		);
	}
}

