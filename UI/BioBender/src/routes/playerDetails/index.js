import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head2 from '../../components/head/head2.js';
import Auth from '../../components/state.js';
import { route } from 'preact-router';


export default class PlayerDetails extends Component {

	state = ({ userId: undefined });
	state = ({ token: undefined });
	state = ({ firstName: '' });
	state = ({ lastName: '' });
	state = ({ birthday: undefined });
	state = ({ sex: '' });
	state = ({ fatherHeight: '' });
	state = ({ motherHeight: '' });
	state = ({ feedback: '' });
	state = ({ feedbackStyle: undefined });


	componentWillMount = () => {
		this.setState({ userId: Auth.getUser().id });
		this.setState({ token: Auth.getUser().token });
		this.setState({ btnClass: style.btnDisabled });
		this.setState({ btnDisabled: true });
		this.getDetails();
	}

	// Request to get Player Details
	getDetails= () => {
		let that = this;
		let url = Auth.url + '/api/user/' + this.state.userId + '/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('authorization', that.state.token);

		xhttp.onreadystatechange = function() {

			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {

					try {
						var response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
						that.setState({ feedbackStyle: style.feedbackSucc });

						if (response['player_details:'] != undefined) {
							that.setState({ firstName: response['player_details:'].first_name });
							that.setState({ lastName: response['player_details:'].last_name });
							that.setState({ birthday: response['player_details:'].birthday });


							let sex = response['player_details:'].sex_m_0_f_1;

							if (sex === 0) {
								that.setState({ sex: 'male' });
							}
							else if (sex === 1) {
								that.setState({ sex: 'female' });
							}
							else {
								that.setState({ sex: response['player_details:'].sex_m_0_f_1 });
							}

							that.setState({ fatherHeight: response['player_details:'].height_father });
							that.setState({ motherHeight: response['player_details:'].height_mother });
						}

					}
					catch(err) {}


				}
				else {
					try {
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
						that.setState({ feedbackStyle: style.feedbackErr });

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch(err) {}
				}
			}
		};

		xhttp.send();

	}


	goToCreateAddPlayer = () => {
		route('/addPlayer', true);
	}

	
	render() {
		return (
				<Card class={style.card}>
					<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
					<div class={style.container}>
						<div class={style.data}>Benutzer Id: {this.state.userId}</div>
						<div class={style.data}>Vorname: {this.state.firstName}</div>
						<div class={style.data}>Nachname: {this.state.lastName}</div>
						<div class={style.data}>Geburtsdatum: {this.state.birthday}</div>
						<div class={style.data}>Geschlecht: {this.state.sex}</div>
						<div class={style.data}>Größe des Vaters: {this.state.fatherHeight}</div>
						<div class={style.data}>Größe der Mutter: {this.state.motherHeight}</div>
					</div>
				</Card>
		);
	}

}
