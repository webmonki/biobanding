import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js';
import { route } from 'preact-router';

export default class AddPlayer extends Component{

	componentWillMount = () => {
		this.setState({ btnClass: style.btnDisabled });
		this.setState({ btnDisabled: true });
		this.setState({ userId: Auth.getUser().id });
		this.setState({ token: Auth.getUser().token });
	}


	// Request to post Player Details
	sendData = () => {
		let that = this;
		let url = Auth.url + '/api/user/' + this.state.userId + '/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', this.state.token);

		xhttp.onreadystatechange = function() {


			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch (err) {}

					that.setState({ feedbackStyle: style.feedbackSucc });
					location.reload();
				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedbackStyle: style.feedbackErr });
						console.log("ERROR")
						that.setState({ feedback: response.msg });

						if (response.msg == 'Token is invalid'){
							route('/login', true)
						}
					}
					catch (err) {}
				}
			}

		};


		switch (this.state.sex){
			case 'male':
				this.sex = 0;
				break;
			case 'female':
				this.sex = 1;
				break;
			default:
				break;
		}

		let data =  `{
            "userID": ${this.state.userId},
            "first_name": "${this.state.firstName}",
			"last_name": "${this.state.lastName}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex},
			"height_father": ${this.state.fatherHeight},
			"height_mother": ${this.state.motherHeight}
        }`;

			xhttp.send(data);
	}


	// Check Input and Enable Button
	handleChange = () => {
		this.setState({ firstName: document.getElementById('fnInput').value });
		this.setState({ lastName: document.getElementById('lnInput').value });
		this.setState({ birthday: document.getElementById('bDayInput').value });
		this.setState({ fatherHeight: document.getElementById('fhInput').value });
		this.setState({ motherHeight: document.getElementById('mhInput').value });
		
		let male = document.getElementById('male').checked;
		let female = document.getElementById('female').checked;

		if (male && !female) {
			this.setState({ sex: 'male' });
		}
		else if (!male && female) {
			this.setState({ sex: 'female' });
		}
		else {
			this.setState({ sex: '' });
		}

		if (
			this.state.firstName !== '' &&
			this.state.lastName !== '' &&
			this.state.brithday !== '' &&
			this.state.fatherHeight !== '' &&
			this.state.motherHeight !== '' &&
			this.state.sex !== ''
		) {
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
					<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
					<div class={style.container}>
						<div class={style.row}>
							<input class={style.radio} type="radio" name="sex" value="0" id="male" onClick={this.handleChange} />
							<label class={style.label} for="male">männlich</label>
							<input class={style.radio} type="radio" name="sex" value="1" id="female" onClick={this.handleChange} />
							<label class={style.label} for="female">weiblich</label>
						</div>
						<div class={style.inputContainer}>
							<Input inputId="fnInput" inputLabel="Vorname" onChange={this.handleChange} />
							<Input inputId="lnInput" inputLabel="Nachname" onChange={this.handleChange} />
							<Input inputId="bDayInput" inputLabel="Geburtstag" onChange={this.handleChange} />
							<Input inputId="fhInput" inputLabel="Größe des Vaters" onChange={this.handleChange} />
							<Input inputId="mhInput" inputLabel="Größe der Mutter" onChange={this.handleChange} />
						</div>
						<div class={style.btnContainer}>
							<Button class={this.state.btnClass} raised disabled={this.state.btnDisabled} onClick={this.sendData}>erstellen</Button>
						</div>
					</div>
				</Card>
		);
	}
}