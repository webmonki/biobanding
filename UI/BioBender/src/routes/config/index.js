import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import Auth from '../../components/state.js';


export default class Config extends Component {


	componentWillMount = () => {
		this.setState({ token: Auth.getUser().token });
		this.getConfiguration();
	}


	// Request to Get days_reminder
	getConfiguration = () => {
		let that = this;
		let url = Auth.url + '/api/configurations';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json"');
		xhttp.setRequestHeader('authorization', this.state.token);

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

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch (err) {}

					that.setState({ feedbackStyle: style.feedbackErr });
				}
			}
		};

		xhttp.send();

	}

	render() {
		return (
				<Card class={style.card}>
					<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
					<div class={style.data}>Erinnern in: {this.state.reminder}</div>
				</Card>
		);
	}
}
