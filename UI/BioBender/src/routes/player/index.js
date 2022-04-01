import { h, Component } from 'preact';
import { route } from 'preact-router';
import TopAppBar from 'preact-material-components/TopAppBar';
import List from 'preact-material-components/List';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/TopAppBar/style.css';
import style from './style';
import Navbar from '../../components/navbar';
import Head2 from '../../components/head/head2';
import Measure from '../measure';
import PlayerDetails from '../playerDetails';
import AddPlayer from '../addPlayer';

export default class Player extends Component {

	componentWillMount = () => {
		this.setState({ contentClass : style.content});
	}

	toogleNavbar = () => {
		if (this.state.contentClass == style.content) {
			this.setState({ contentClass : style.fullContent });
		}
		else if (this.state.contentClass == style.fullContent) {
			this.setState({ contentClass : style.content });
		}
	}

	render () {
		return (
			<div class={style.view}>
			<Navbar toogleNavbar={this.toogleNavbar}/>
			<div class={this.state.contentClass}>
				<div class={style.measureContainer} id='measureContainer'>
					<Head2 headText='Messungen' />
					<Measure />
				</div>
				<div class={style.detailsContainer} id='detailsContainer'>
					<Head2 headText='Details' />
					<div class={style.rowContainer}>
						<PlayerDetails />
						<AddPlayer />
					</div>
				</div>
			</div>
		</div>
		)
	}
}