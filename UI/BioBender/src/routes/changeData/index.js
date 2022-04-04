import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
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
	}


	// Request to post new Email
	sendData = () => {
		console.log("XXX: ", Auth.getUser().token)
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
						that.setState({ feedback: response.msg });
						Auth.setToken(response.token)
					}
					catch (err) {}

					that.setState({ feedbackStyle: style.feedbackSucc });
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });

						if (response.msg == 'Token is invalid'){
							route('/login', true)
						}
					}
					catch (err) {}
					that.setState({ feedbackStyle: style.feedbackErr });
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
	
	render() {
		return (
			<Card class={style.card}>
				<div class={style.container}>
					<Input inputId="emailInput" inputLabel="E-Mail" type="email" onChange={this.handleChange} />
					<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
					<Button class={this.state.btnClass} raised disabled={this.state.btnDisabled} onClick={this.sendData}>E-Mail ändern</Button>
				</div>
			</Card>
		);
	}

}