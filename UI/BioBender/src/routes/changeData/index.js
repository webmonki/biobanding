import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head2 from '../../components/head/head2.js';
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js';
import { route } from 'preact-router';


export default class ChangeData extends Component {
    state = ({ userId: '' });
    state = ({ userName: '' });
    state = ({ email: '' });
    state = ({ btnClass: '' });
    state = ({ btnDisabled: true });
    state = ({ feedback: '' });
    state = ({ feedbackStyle: '' });
    state = ({ token: '' });


	componentWillMount = () => {
		this.setState({ userId: Auth.getUser().id });
		this.setState({ userName: Auth.getUser().name });
		this.setState({ email: Auth.getUser().email });
		this.setState({ btnDisabled: true });
		this.setState({ btnClass: style.btnDisabled });

		this.setState({ token: Auth.getUser().token });
	}


	// Request to post new Email
	sendData = () => {
		let that = this;
		let url = Auth.url + '/api/users/edit';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', that.state.token);

		xhttp.onreadystatechange = function() {

			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					let response = JSON.parse(this.responseText);
					that.setState({ feedback: response.msg });
					that.setState({ feedbackStyle: style.feedbackSucc });
				}
				else {
					let response = JSON.parse(this.responseText);
					that.setState({ feedback: response.msg });
					that.setState({ feedbackStyle: style.feedbackErr });
				}
			}
			else {
				this.setState({ loginResponse: 'Ups, something went wrong' });
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
		this.setState({ loginResponse: '' });
        

		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)){
			this.setState({ btnDisabled: false });
			this.setState({ btnClass: style.btnEnabled });
		}
		else {
			this.setState({ btnDisabled: true });
			this.setState({ btnClass: style.btnDisabled });
		}
	}

	goToProfile = () => {
		route('/profile', true);
	}
	

	render() {
		return (
			<div class={style.layout}>
				<Card class={style.card}>
					<Head2 headText="Profil ändern" />
					<div class={style.container}>
						<Input inputId="emailInput" inputLabel="E-Mail" type="email" onChange={this.handleChange} />
						<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
						<Button class={this.state.btnClass} raised disabled={this.state.btnDisabled} onClick={this.sendData}>E-Mail ändern</Button>
						<Button class={style.btnEnabled} raised onClick={this.goToProfile}>Profil</Button>
					</div>
				</Card>
			</div>
		);
	}

}