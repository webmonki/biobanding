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
import Home from '../home';
import Config from '../config';
import SetConfig from '../setConfig';
import UserAdmin from '../userAdmin';
import UserEdit from '../userEdit';
import Evaluation from '../evaluation';

export default class Admin extends Component {

	render () {
		return (
			<div class={style.playerView}>
			<Navbar />
			<div class={style.content}>
				<div class={style.userContainer}>
					<Head2 headText='Benutzer' />
					<UserEdit />
				</div>
				<div class={style.evalContainer}>
					<Head2 headText='Auswertung' />
					<Evaluation />
				</div>
				<div class={style.configContainer}>
					<Head2 headText='Konfiguration' />
					<Config />
					<SetConfig />
				</div>
			</div>
		</div>
		)
	}
}