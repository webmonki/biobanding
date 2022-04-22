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


export default class Forgot extends Component {

	componentWillMount = () => {
		this.setState({ btnDisabled : true });
	}

	componentDidMount = () => {
		document.addEventListener('keyup', this.handleKey)
	}

	componentWillUnmount = () => {
		document.removeEventListener('keyup', this.handleKey)
	}


	handleKey = (event) => {
		if(this.state.btnDisabled == false && event.code == 'Enter') {
			this.sendEmail();
			document.removeEventListener('keyup', this.handleKey)
		}
	}


	// Check Input and Enable Button
	handleChange = () => {
		this.setState({ email: document.getElementById('emailInput').value });

		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)){
			this.setState({ btnDisabled: false });
		}
		else {
			this.setState({ btnDisabled: true });
		}

	}

	sendEmail = () => {
		let that = this;
		let url = Auth.url + '/api/user/forget';
		let xhttp = new XMLHttpRequest();

		xhttp.open('PUT', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');

		xhttp.onreadystatechange = function() {

			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
					}
					catch (err) {}
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						if (response.msg == 'Token is invalid') {
							Auth.logout();
							location.reload();
						}
						that.setState({ responseFBClass : style.feedbackSucc });
						that.setState({ responseFB : response.msg });
					}
					catch (err) {}
				}
			}
		};

		let data =  `{
            "email": "${this.state.email}"
        }`;

		xhttp.send(data);
	}

	render() {
		return(
			<Card class={style.card}>
					<div class={style.logoContainer}>
						<img class={style.logo} src='../../assets/StarsLogoTrans.png' />
					</div>
					<div class={style.inputContainer}>
						<div class={style.loginLabel}>Passwort vergessen</div>
						<div class={style.input}>
							<TextField id='emailInput' outlined label='E-Mail' value={this.state.email} onKeyUp={e =>{
								this.handleChange();
								this.setState({ email : e.target.value });
								let val = e.target.value
								if (val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
									this.setState({ emailFBClass : style.feedbackSucc });
									this.setState({ emailFB : ''})
								}
								else {
									this.setState({ emailFBClass : style.feedbackErr });
									this.setState({ emailFB : 'keine E-Mail'})
								}
							}}/>				
							<span class={this.state.emailFBClass}>{this.state.emailFB}</span>
						</div>
						<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
						<div class={style.btnContainer}>
							<Button class={style.secondaryBtn} onClick={() => {route('/login', true)}}>Anmelden</Button>
							<Button class={style.input} raised onClick={this.sendEmail} disabled={this.state.btnDisabled}>senden</Button>
						</div>
					</div>
				</Card>
		)
	}
}