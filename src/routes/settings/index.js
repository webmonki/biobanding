
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
						that.setState({ reminder: response.days_reminder });
						that.setState({ feedback: response.msg })
					}
					catch (err) {}
;
					that.setState({ feedbackStyle: style.feedbackSucc });
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch (err) {}

					that.setState({ feedbackStyle: style.feedbackErr });
				}
			}
			else {
				this.setState({ feedback: 'Ups, something went wrong' });
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
			else {
				this.setState({ feedback: 'Ups, something went wrong' });
			}
		};

		let data = `{
            "days_reminder": ${that.state.reminder}
        }`;

		xhttp.send(data);

	}


	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/settings' fitPageSize={this.fitPageSize}/>
				<span class={style.pageHeader}>Einstellungen</span>
				<div class={style.settingsContainer}>
					<div class={style.headerContainer}>
						<span class={style.header}>Erinnerungs-E-Mail</span>
						<span class={style.subHeader}>Angeben in wievielen Tagen die Erinnerungs-E-Mail gesendet werden soll</span>
					</div>
					<div class={style.input}>
						<TextField outlined label='Erinnerung in Tagen' value={this.state.reminder} onInput={e => {
							this.setState({ reminder : e.target.value })
						}}/>
						<span class={this.state.usernameFBClass}>{this.state.usernameFB}</span>
					</div>
					<div class={style.btnContainer}>
						<Button raised onClick={this.setConfiguration}>Speichern</Button>
					</div>
					<span class={this.state.responseFBClass}>{this.state.responseFB}</span>
				</div>
			</div>
		);
	}
}
