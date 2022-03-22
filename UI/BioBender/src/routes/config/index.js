import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import Auth from '../../components/state.js';
import Head2 from '../../components/head/head2.js';
import { Link } from 'preact-router/match';
import Button from 'preact-material-components/Button';
import { route } from 'preact-router';


export default class Config extends Component {
	state = ({ reminder: '' });
	state = ({ feedback: '' });


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
					let response = JSON.parse(this.responseText);
					that.setState({ reminder: response.days_reminder });
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
				this.setState({ feedback: 'Ups, something went wrong' });
			}
		};

		xhttp.send();
	}

	goToSetConfig = () => {
		route('/setConfig', true);
	}

	
	render() {
		return (
			<div class={style.layout}>
				<Card class={style.card}>
					<Head2 headText="Konfiguration" />
					<div class={this.state.feedbackStyle}>{this.state.feedback}</div>
					<div class={style.container}>
						<div class={style.data}>Erinnern in: {this.state.reminder}</div>
						<Button class={style.btnEnabled} raised onCLick={this.goToSetConfig}>Konfiguration setzten</Button>
					</div>
				</Card>
			</div>
		);
	}
}
