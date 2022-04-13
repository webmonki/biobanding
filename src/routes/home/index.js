import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import Navbar from '../../components/navbar/navbar';

export default class Home extends Component {

	componentWillMount = () => {
		this.setState({ pageClass : style.pageSmall });
	}

	fitPageSize = () => {
		if (this.state.pageClass == style.pageSmall) {
			this.setState({ pageClass : style.pageLarge });
		}
		else {
			this.setState({ pageClass : style.pageSmall });
		}
	}

	render() {
		return (
			<div class={this.state.pageClass}>
				<Navbar selectedRoute='/' fitPageSize={this.fitPageSize}/>
				<span>Hallo Test</span>
				<Card>

				</Card>
			</div>
		);
	}
}
