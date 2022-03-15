import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import Auth from '../../components/state.js';
import Head2 from '../../components/head/head2.js'



export default class Home extends Component {
	state = ({username: ""})

	componentWillMount = () => {
		let user = Auth.getUser()
		this.setState({ username: user.getName()})
	}

	render() {
		return (
			<div class={ style.layout }>
				<Card class={ style.card }>
					<Head2 headText="Home"></Head2>
					<h1>Hallo, {this.state.username}!</h1>
				</Card>
			</div>
		);
	}
}
