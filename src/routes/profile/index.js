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
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';


export default class Profile extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });
		this.setState({ username : Auth.getUser().name });
		this.setState({ email : Auth.getUser().email });
		this.getDetails();
	}

	componentDidMount = () => {
		document.addEventListener('keyup', this.handleKey)
	}

	handleKey = (event) => {
		if(event.code == 'Enter') {
			this.sendData();
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	componentWillUnmount = () => {
		document.removeEventListener('keyup', this.handleKey)
	}

	fitPageSize = (large) => {
		large ? this.setState({ pageClass : style.pageLarge }) : this.setState({pageClass : style.pageSmall});
	}

	sendNewLogin = () => {
		let that = this;
		let url = Auth.url + '/api/users/edit';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);

				// that.setState({ responseFBClass : style.feedbackSucc });
				// that.setState({ responseFB : 'Login erfolgreich geändert' });

				that.bar.MDComponent.show({
					message: `Login-Daten erfolgreich geändert`
				})

				Auth.setEmail(that.state.email);
				Auth.setUsername(that.state.username);
				location.reload();
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
		};


		let data = `{
			"userID": "${Auth.getUser().id}",
			"username": "${this.state.username}",
			"email": "${this.state.email}"
		}`;

		xhttp.send(data);
	}

	sendData = () => {

		if (this.state.username != Auth.getUser().name || this.state.email != Auth.getUser().email) {
			this.sendNewLogin();
		}

		this.sendPlayerDetails();
	}

	getDetails= () => {
		let that = this;
		let url = Auth.url + '/api/user/' + Auth.getUser().id + '/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);

				// that.setState({ responseFBClass : style.feedbackSucc });
				// that.setState({ responseFB : 'Spieler Details erfolgreich geladen' });
				
				that.setState({ firstname : response['player_details:'].first_name });
				that.setState({ lastname : response['player_details:'].last_name });
				that.setState({ fatherHeight: response['player_details:'].height_father });
				that.setState({ motherHeight: response['player_details:'].height_mother });


				let year = response['player_details:'].birthday.split('-')[0].replace('"', '')
				let month = response['player_details:'].birthday.split('-')[1]
				let day = response['player_details:'].birthday.split('-')[2].split('T')[0]

				that.setState({ birthday : new Date(year, month, day).toISOString().split('T')[0]})

				let sex = response['player_details:'].sex_m_0_f_1;

				if (sex === 0) {
					document.getElementById('radioMale').checked = true;
				}
				else if (sex === 1) {
					document.getElementById('radioFemale').checked = true;
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
		};


		xhttp.send();

	}


	sendPlayerDetails = () => {
		let that = this;
		let url = Auth.url + '/api/user/' + Auth.getUser().id + '/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);


		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				// that.setState({ responseFBClass : style.feedbackSucc });
				// that.setState({ responseFB : 'Spieler Details erfolgreich angelegt'});
				that.bar.MDComponent.show({
					message: `Spielerdetails erfolgreich angelegt`
				})
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
            "userID": ${Auth.getUser().id},
            "first_name": "${this.state.firstname}",
			"last_name": "${this.state.lastname}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex},
			"height_father": ${this.state.fatherHeight},
			"height_mother": ${this.state.motherHeight}
        }`;
		xhttp.send(data);
		
	}

	handleRadioChange = () => {
		let male = document.getElementById('radioMale').checked;
		let female = document.getElementById('radioFemale').checked;

		if (male && !female) {
			this.setState({ sex: 'male' });
		}
		else if (!male && female) {
			this.setState({ sex: 'female' });
		}
		else {
			this.setState({ sex: '' });
		}
	}
	

	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/profile' fitPageSize={this.fitPageSize}/>
				<span class={style.pageHeader}>Profil</span>
				<div class={style.profileContainer}>
					<div class={style.headerContainer}>
						<span class={style.header}>Benutzerdaten</span>
						<span class={style.subHeader}>Diese Daten werden für die Anmeldung benötigt</span>
					</div>
					<div class={style.row}>
						<div class={style.input}>
							<TextField autocomplete='off' outlined label='Benutzername' value={this.state.username} onInput={e => {
								this.setState({ username : e.target.value })
								let val = e.target.value
								if (val.length < 1) {
									this.setState({usernameFBClass : style.feedbackErr})
									this.setState({ usernameFB : 'Mindestens 1 Zeichen'})
								}
								if (val.length > 32) {
									this.setState({usernameFBClass : style.feedbackErr })
									this.setState({ usernameFB : 'Maximal 32 Zeichen'})
								}
								if (val.length > 0 && val.length < 33) {
									this.setState({usernameFBClass : style.feedbackSucc })
									this.setState({usernameFB : ''})
								}
							}}/>
							<span class={this.state.usernameFBClass}>{this.state.usernameFB}</span>
						</div>
						<div class={style.input}>
							<TextField autocomplete='off' outlined label='E-Mail' value={this.state.email} onInput={e =>{
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
					</div>
					<div class={style.headerContainer}>
						<span class={style.header}>Persönliche Daten</span>
						<span class={style.subHeader}>Diese Daten werden für eine bessere Zuordnung der Messungen benötigt</span>
					</div>
					<div class={style.row}>
						<div class={style.input}>
							<TextField autocomplete='off' outlined label='Vorname' value={this.state.firstname} onInput={e => {
								this.setState({ firstname : e.target.value });
								let val = e.target.value;
								if (val.length < 2) {
									this.setState({ firstnameFBClass : style.feedbackErr });
									this.setState({ firstnameFB : 'Mindestens 2 Zeichen'});
								}
								if (val.length > 32) {
									this.setState({ firstnameFBClass : style.feedbackErr });
									this.setState({ firstnameFB : 'Maximal 32 Zeichen'})
								}
								if (val.length > 1 && val.length < 33) {
									this.setState({firstnameFBClass : style.feedbackSucc });
									this.setState({ firstnameFB : '' });
								}
							}}/>
							<span class={this.state.firstnameFBClass}>{this.state.firstnameFB}</span>
						</div>
						<div class={style.input}>
							<TextField autocomplete='off' outlined label='Nachname' value={this.state.lastname} onInput={e => {
								this.setState({ lastname : e.target.value })
								let val = e.target.value
								if (val.length < 4) {
									this.setState({ lastnameFBClass : style.feedbackErr });
									this.setState({ lastnameFB : 'Mindestens 4 Zeichen' });
								}
								if (val.length > 64) {
									this.setState({ lastnameFBClass : style.feedbackErr });
									this.setState({ lastnameFB : 'Maximal 64 Zeichen' });
								}
								if (val.length > 3 && val.length < 65) {
									this.setState({ lastnameFBClass : style.feedbackSucc });
									this.setState({ lastnameFB : '' });
								}
							}}/>
							<span class={this.state.lastnameFBClass}>{this.state.lastnameFB}</span>
						</div>
					</div>
					<div class={style.row}>
						<div class={style.dateContainer}>
							<TextField class={style.dateInput} outlined type="date" value={this.state.birthday} onInput={e => 
								this.setState({ birthday : e.target.value })}/>
							<span class={style.bDayLabel}>Geburtstag</span>
						</div>
						<div class={style.radioContainer}>
							<div class={style.radioBtn}>
								<label for='radioMale'>männlich</label>
								<Radio id='radioMale' name='genderOptions' onChange={this.handleRadioChange}/>
							</div>
							<div class={style.radioBtn}>
								<label for='radioFemale'>weiblich</label>
								<Radio id='radioFemale' name='genderOptions' onChange={this.handleRadioChange}/>
							</div>
						</div>
					</div>
					<div class={style.row}>
						<div class={style.input}>
							<TextField autocomplete='off' class={style.fullWidth} type='number' min={0} max={300} outlined label='Größe der Mutter' value={this.state.motherHeight} onInput={e => {
								this.setState({ motherHeight : e.target.value})
								let val = e.target.value;
								if (val < 0) {
									this.setState({ motherFBClass : style.feedbackErr });
									this.setState({ motherFB : 'Mindestens 0'})
								}
								if (val > 300) {
									this.setState({ motherFBClass : style.feedbackErr });
									this.setState({ motherFB : 'Maximal 300' })
								}
								if (val >= 0 && val <= 300) {
									this.setState({ motherFBClass : style.feedbackSucc });
									this.setState({ motherFB : '' });
								}
							}}/>
							<span class={this.state.motherFBClass}>{this.state.motherFB}</span>
						</div>
						<div class={style.input}>
							<TextField autocomplete='off' class={style.fullWidth} type='number' min={0} max={300} outlined label='Größe des Vaters' value={this.state.fatherHeight} onInput={e => {
								this.setState({ fatherHeight : e.target.value });
								let val = e.target.value;
								if (val < 0) {
									this.setState({ fatherFBClass : style.feedbackErr });
									this.setState({ fatherFB : 'Mindestens 0'})
								}
								if (val > 300) {
									this.setState({ fatherFBClass : style.feedbackErr });
									this.setState({ fatherFB : 'Maximal 300'})
								}
								if (val >= 0 && val <= 300) {
									this.setState({ fatherFBClass : style.feedbackSucc });
									this.setState({ fatherFB : '' });
								}
							}}/>
							<span class={this.state.fatherFBClass}>{this.state.fatherFB}</span>
						</div>
					</div>
					<div class={style.btnContainer}>
						<Button raised onClick={this.sendData}>Speichern</Button>
						{/* <span class={this.state.responseFBClass}>{this.state.responseFB}</span> */}
					</div>
					<Snackbar ref={bar => {this.bar=bar}} />
				</div>
			</div>
		);
	}
}
