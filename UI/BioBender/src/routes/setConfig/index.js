import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import Auth from '../../components/state.js';
import Head2 from '../../components/head/head2.js';
import Input from '../../components/input/input.js';
import Button from 'preact-material-components/Button';
import { route } from 'preact-router';


export default class SetConfig extends Component {
	state = ({ reminder: '' });
    state = ({ btnClass: '' });
    state = ({ btnDisabled: true });
    state = ({ feedback: '' });
    state = ({ feedbackStyle: '' });

	
	componentWillMount = () => {
		this.setState({ token: Auth.getUser().token });
		this.setState({ btnDisabled: true });
		this.setState({ btnClass: style.btnDisabled });
	};


	// Check Input and Enable Button
	handleChange = () => {
		this.setState({ reminder: document.getElementById('configInput').value });
		this.setState({ loginResponse: '' });
        

		if (this.state.reminder.length > 0){
			this.setState({ btnDisabled: false });
			this.setState({ btnClass: style.btnEnabled });
		}
		else {
			this.setState({ btnDisabled: true });
			this.setState({ btnClass: style.btnDisabled });
		}
	}


	// Send Request
	setConfiguration = () => {
		let that = this;
		let url = Auth.url + '/api/configurations';
		let xhttp = new XMLHttpRequest();

		xhttp.open('PUT', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', this.state.token);

		xhttp.onreadystatechange = function() {


			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					let response = JSON.parse(this.responseText);
					that.setState({ feedback: response.msg });
					that.setState({ feedbackStyle: style.feedbackSucc });
					route('/config', true);
				}
				else {
					let response = JSON.parse(this.responseText);
					that.setState({ feedback: response.msg });
					that.setState({ feedbackStyle: style.feedbackErr });
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
			<div class={style.layout}>
				<Card class={style.card}>
					<Head2 headText="Konfiguration" />
					<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
					<div class={style.container}>
						<Input inputId="configInput" inputLabel="Erinnern in X Tagen" onChange={this.handleChange} />
						<div class={style.center}>
							<Button class={this.state.btnClass} raised disabled={this.state.btnDisabled} onClick={this.setConfiguration}>Konfiguration senden</Button>
						</div>
					</div>
				</Card>
			</div>
		);
	}
}
