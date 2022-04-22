
import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Navbar from '../../components/navbar/navbar';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import Radio from 'preact-material-components/Radio';
import Auth from '../../components/state'
import 'preact-material-components/List/style.css';
import 'preact-material-components/Radio/style.css';
import Checkbox from 'preact-material-components/Checkbox';
import Formfield from 'preact-material-components/FormField';
import 'preact-material-components/Checkbox/style.css';


export default class Settings extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });

		this.getConfiguration();

	}

	componentDidMount = () => {
		document.addEventListener('keyup', this.handleKey)
	}

	handleKey = (event) => {
		if(event.code == 'Enter') {
			this.setConfiguration();
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	componentWillUnmount = () => {
		document.removeEventListener('keyup', this.handleKey)
	}

	fitPageSize = (large) => {
		large ? this.setState({ pageClass : style.pageLarge }) : this.setState({pageClass : style.pageSmall});
	}

	getConfiguration = () => {
		let that = this;
		let url = Auth.url + '/api/configurations';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json"');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {

			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ reminder : response.config.days_reminder })
						that.setState({ mailService : response.config.mail_server })
						that.setState({ mailPort : response.config.mail_port })
						that.setState({ ssl : response.config.mail_use_ssl })
						that.setState({ mailUsername : response.config.mail_username })
						that.setState({ responseFB: 'Konfigurationen erfolgreich geladen' })
						that.setState({ responseFBClass: style.feedbackSucc });
					}
					catch (err) {}
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ responseFB: response.msg });
					}
					catch (err) {}

					that.setState({ responseFBClass: style.feedbackErr });
				}
			}
		};

		xhttp.send();

	}


	setConfiguration = () => {
		let that = this;
		let url = Auth.url + '/api/configurations';
		let xhttp = new XMLHttpRequest();

		xhttp.open('PUT', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ responseFB: response.msg });
					}
					catch (err) {}

					that.setState({ responseFBClass: style.feedbackSucc });
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ responseFB: response.msg });
					}
					catch (err) {}

					that.setState({ responseFBClass: style.feedbackErr });
				}
			}
		};

		let data = `{
            "days_reminder": ${this.state.reminder},
			"mail_server": "${this.state.mailService}",
			"mail_port": ${this.state.mailPort},
			"mail_user_ssl" : ${this.state.ssl},
			"mail_password": "${this.state.password}"
        }`;

		xhttp.send(data);

	}

	setServer = () =>  {
		this.checkServer();
	}

	checkServer = () => {
		let checkbox = document.getElementsByName('serverCheck')
		this.setState({ ssl: checkbox[0].checked })
	}


	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/settings' fitPageSize={this.fitPageSize}/>
				<span class={style.pageHeader}>Einstellungen</span>
				<div class={style.settingsContainer}>
					<div class={style.headerContainer}>
						<span class={style.header}>Erinnerungsintervall</span>
						<span class={style.subHeader}>Intervall innerhalb dessen die Spieler per E-Mail an eine neue Messung erinnert werden</span>
					</div>
					<div class={style.row}>
						<div class={style.input}>
							<TextField outlined label='Erinnerung in Tagen' value={this.state.reminder} onInput={e => {
								this.setState({ reminder : e.target.value })
							}}/>
							<span class={this.state.usernameFBClass}>{this.state.usernameFB}</span>
						</div>
					</div>
				</div>
				<div class={style.settingsContainer}>
					<div class={style.headerContainer}>
						<span class={style.header}>E-Mail-Server</span>
						<span class={style.subHeader}>Es ist wichtig diesen Server zu konfigurieren, dass E-Mail versandt werden können, z.B. für den Passwort-Reset und Benachrichtigungen</span>
					</div>
					<div class={style.row}>
						<div class={style.input}>
							<TextField outlined label='E-Mail-Server' value={this.state.mailService} onInput={e => {
								this.setState({ mailService : e.target.value})
							}}/>
							<span class={this.state.serverFBClass}>{this.state.serverFB}</span>
						</div>
						<div class={style.input}>
							<TextField outlined label='Port' value={this.state.mailPort} onInput={e => {
								this.setState({ mailPort : e.target.value });
							}}/>
							<span class={this.state.portFBClass}>{this.state.portFB}</span>
						</div>
					</div>
					<div class={style.row}>
						<div class={style.input}>
							<TextField outlined label='Benutzername' value={this.state.mailUsername} onInput={e => {
								this.setState({ mailUsername : e.target.value });
							}} />
						</div>
						<div class={style.input}>
							<TextField outlined label='Passwort' type='password' value={this.state.password} onInput={e => {
								this.setState({ password : e.target.value });
							}} />
						</div>
					</div>
					<div class={style.row}>
						<div class={style.checkContainer}>
							<span class={style.label}>SSL Verschlüsselung</span>
							<Formfield>
								<Checkbox name='serverCheck' checked={this.state.ssl} onChange={() => {
									this.checkServer();
								}}/>
							</Formfield>
						</div>
					</div>
					<div class={style.btnContainer}>
						<Button class={style.mrgnBttm} raised onClick={this.setConfiguration}>Speichern</Button>
					</div>
					<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
				</div>
			</div>
		);
	}
}
