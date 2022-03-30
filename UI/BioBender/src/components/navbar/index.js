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
import Auth from '../state.js';


export default class Navbar extends Component {

	state = ({ content : undefined });
	state = ({ navWindowClass : undefined });

	state = ({ homeClass: undefined });
	state = ({ profileClass: undefined });
	state = ({ detailsClass: undefined });
	state = ({ homeIcon: undefined });
	state = ({ profileIcon: undefined });
	state = ({ detailsIcon: undefined });
	state = ({ navbarClass: undefined });
	state = ({ measureClass: undefined });
	state = ({ configClass: undefined });
	state = ({ configIcon: undefined });
	state = ({ measureIcon: undefined });
	state = ({ navWindowClass: undefined });
	state = ({ adminClass : undefined });
	state = ({ adminIcon : undefined });

	componentWillMount = () => {
		this.setState({ homeClass: style.nav });
		this.setState({ profileClass: style.nav });
		this.setState({ detailsClass: style.nav });
		this.setState({ homeIcon: style.icon });
		this.setState({ profileIcon: style.icon });
		this.setState({ detailsIcon: style.icon });
		this.setState({ measureClass: style.nav });
		this.setState({ measureIcon: style.icon });
		this.setState({ configClass: style.nav });
		this.setState({ configIcon: style.icon });
		this.setState({ adminClass : style.nav });
		this.setState({ adminIcon : style.icon });
		this.setState({ overviewClass : style.nav });
		this.setState({ overviewIcon : style.icon });

		this.setState({ navWindowClass : style.navWindowOpened })

		if (Auth.getAuth()){
			if (Auth.check_admin()) {
				var content = (
					<div class={style.navBar}>
						<img class={style.logo} src='../../logo/StarsLogoTrans.png' />
						<div class={this.state.adminClass} onClick={this.handleClickAdmin}>
							<List.ItemGraphic class={this.state.adminIcon}>group</List.ItemGraphic>
							Benutzer
						</div>

						<div class={this.state.overviewClass} onClick={this.handleClickOverview}>
							<List.ItemGraphic class={this.state.overviewIcon}>directions_run</List.ItemGraphic>
							Auswertung
						</div>
		
						<div class={this.state.configClass} onClick={this.handleClickConfig}>
							<List.ItemGraphic class={this.state.configIcon}>build</List.ItemGraphic>
							Konfiguration
						</div>

						<div class={style.nav} onClick={this.logOut}>
							<List.ItemGraphic class={style.icon}>close</List.ItemGraphic>
							Abmelden
						</div>
					</div>
				)
			}
			else {
				var content = (
					<div class={style.navBar}>
					<div class={this.state.homeClass} onClick={this.handleClickHome}>
						<List.ItemGraphic class={this.state.homeIcon}>home</List.ItemGraphic>
						Home
					</div>
	
					<div class={this.state.profileClass} onClick={this.handleClickProfile}>
						<List.ItemGraphic class={this.state.profileIcon}>account_circle</List.ItemGraphic>
						Profil
					</div>
	
					<div class={this.state.detailsClass} onclick={this.handleClickDetails}>
						<List.ItemGraphic class={this.state.detailsIcon}>face</List.ItemGraphic>
						Details
					</div>
	
					<div class={this.state.measureClass} onCLick={this.handleClickMeasure}>
						<List.ItemGraphic class={this.state.measureIcon}>equalizer</List.ItemGraphic>
						Messung
					</div>
	
					<div class={style.nav} onClick={this.logOut}>
						<List.ItemGraphic class={style.icon}>close</List.ItemGraphic>
						Abmelden
					</div>
	
				</div>
				)	
			}
			this.setState({ content });
		}
		else {
			this.setState({ content : undefined });
		}
	}

	render(props) {

		return (
				this.state.content
		)
	}

	// render(props) {
	// 	let auth = Auth.getAuth();

	// 	if (auth) {
			

	// 		if (Auth.check_admin()) {
	// 			var content = (
	// 				<div class={style.navBar}>
	// 				<div class={this.state.homeClass} onClick={this.handleClickHome}>
	// 					<List.ItemGraphic class={this.state.homeIcon}>home</List.ItemGraphic>
	// 					Home
	// 				</div>
	
	// 				<div class={this.state.profileClass} onClick={this.handleClickProfile}>
	// 					<List.ItemGraphic class={this.state.profileIcon}>account_circle</List.ItemGraphic>
	// 					Profil
	// 				</div>
	
	// 				<div class={this.state.detailsClass} onclick={this.handleClickDetails}>
	// 					<List.ItemGraphic class={this.state.detailsIcon}>face</List.ItemGraphic>
	// 					Details
	// 				</div>
	
	// 				<div class={this.state.measureClass} onCLick={this.handleClickMeasure}>
	// 					<List.ItemGraphic class={this.state.measureIcon}>equalizer</List.ItemGraphic>
	// 					Messung
	// 				</div>
	
	// 				<div class={this.state.configClass} onClick={this.handleClickConfig}>
	// 					<List.ItemGraphic class={this.state.configIcon}>build</List.ItemGraphic>
	// 					Konfiguration
	// 				</div>

	// 				<div class={this.state.adminClass} onClick={this.handleClickAdmin}>
	// 					<List.ItemGraphic class={this.state.adminIcon}>group</List.ItemGraphic>
	// 					Benutzer
	// 				</div>

	// 				<div class={this.state.overviewClass} onClick={this.handleClickOverview}>
	// 					<List.ItemGraphic class={this.state.overviewIcon}>directions_run</List.ItemGraphic>
	// 					Spieler Übersicht
	// 				</div>

	// 				<div class={style.nav} onClick={this.logOut}>
	// 					<List.ItemGraphic class={style.icon}>close</List.ItemGraphic>
	// 					Abmelden
	// 				</div>
	
	// 			</div>
	// 			)	
	// 		}
	// 		else {
	// 			var content = (
	// 				<div class={style.navBar}>
	// 				<div class={this.state.homeClass} onClick={this.handleClickHome}>
	// 					<List.ItemGraphic class={this.state.homeIcon}>home</List.ItemGraphic>
	// 					Home
	// 				</div>
	
	// 				<div class={this.state.profileClass} onClick={this.handleClickProfile}>
	// 					<List.ItemGraphic class={this.state.profileIcon}>account_circle</List.ItemGraphic>
	// 					Profil
	// 				</div>
	
	// 				<div class={this.state.detailsClass} onclick={this.handleClickDetails}>
	// 					<List.ItemGraphic class={this.state.detailsIcon}>face</List.ItemGraphic>
	// 					Details
	// 				</div>
	
	// 				<div class={this.state.measureClass} onCLick={this.handleClickMeasure}>
	// 					<List.ItemGraphic class={this.state.measureIcon}>equalizer</List.ItemGraphic>
	// 					Messung
	// 				</div>
	
	// 				<div class={style.nav} onClick={this.logOut}>
	// 					<List.ItemGraphic class={style.icon}>close</List.ItemGraphic>
	// 					Abmelden
	// 				</div>
	
	// 			</div>
	// 			)	
	// 		}




	// 		return (
	// 			<div class={style.headContainer}>
	// 				<div class={style.header}>
	// 					<div class={style.show}>
	// 						<TopAppBar.Icon menu onCLick={this.openNavbar}>
	// 							menu
	// 						</TopAppBar.Icon>
	// 					</div>
	// 					<TopAppBar.Title class={style.titleLogged}>BioBending</TopAppBar.Title>
	// 				</div>
	// 				<div class={this.state.navWindowClass}>
	// 					{content}
	// 				</div>
	// 			</div>
	// 		);
	// 	}
	// 	return (
	// 		<div>
	// 			<div class={style.header}>
	// 				<div class={style.dontShow}>
	// 					<TopAppBar.Icon menu onCLick={this.openNavbar}>
	// 							menu
	// 					</TopAppBar.Icon>
	// 				</div>
	// 				<TopAppBar.Title class={style.titleNotLogged}>BioBending</TopAppBar.Title>
	// 			</div>
	// 		</div>
	// 	);
		
	// }
}