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

export default class Profile extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });
		this.setState({ username : Auth.getUser().name });
		this.setState({ email : Auth.getUser().email });

		this.getDetails();
	}

	componentDidMount = () => {
		let that = this;
		document.addEventListener('keyup', function(event){
			that.handleKey(event);
		})
	}

	handleKey = (event) => {
		if(this.state.btnDisabled == false && event.code == 'Enter') {
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
			}
			else {
				let response = JSON.parse(this.responseText);
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
				let response = JSON.parse(this.responseText);
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
				console.log(this.responseText)
			}
			else {
				let response = JSON.parse(this.responseText);
				console.log(this.responseText)
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
				<div class={style.profileContainer}>
					<div class={style.headerContainer}>
						<span class={style.header}>Benutzerdaten</span>
						<span class={style.subHeader}>Diese Daten werden für die Anmeldung benötigt</span>
					</div>
					<div class={style.row}>
						<TextField helperText={this.state.usernameVal} outlined class={style.input} label='Benutzername' value={this.state.username} onInput={e =>
							this.setState({ username : e.target.value })
							}/>
						<TextField class={style.input} outlined label='E-Mail' value={this.state.email} onInput={e =>
							this.setState({ email : e.target.value })}/>
					</div>
					<div class={style.headerContainer}>
						<span class={style.header}>Persönliche Daten</span>
						<span class={style.subHeader}>Diese Daten werden für eine bessere Zuordnung der Messungen benötigt</span>
					</div>
					<div class={style.row}>
						<TextField class={style.input} outlined label='Vorname' value={this.state.firstname} onInput={e => 
							this.setState({ firstname : e.target.value })}/>
						<TextField class={style.input} outlined label='Nachname' value={this.state.lastname} onInput={e =>
							this.setState({ lastname : e.target.value })}/>
					</div>
					<div class={style.row}>
						<div class={style.dateContainer}>
							<label for='birthday'>Geburtstag</label>
							<TextField fullwidth={true} outlined type="date" id='birthday' value={this.state.birthday} onInput={e => 
								this.setState({ birthday : e.target.value })}/>
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
						<TextField class={style.input} outlined label='Größe der Mutter' value={this.state.motherHeight} onInput={e =>
							this.setState({ motherHeight : e.target.value})}/>
						<TextField class={style.input} outlined label='Größe des Vaters' value={this.state.fatherHeight} onInput={e =>
							this.setState({ fatherHeight : e.target.value })}/>
					</div>
					<Button raised onClick={this.sendData}>Speichern</Button>
				</div>
			</div>
		);
	}
}
