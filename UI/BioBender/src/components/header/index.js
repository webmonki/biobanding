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


export default class Header extends Component {

	componentWillMount = () => {
		
		try {
			let path = JSON.parse(sessionStorage.path);

			if (path == '/profile') {
				this.setState({ profileClass: style.active });
				this.setState({ profileIcon: style.activeIcon });
	
				this.setState({ adminClass : style.nav });
				this.setState({ adminIcon : style.icon });
		
				this.setState({ playerClass : style.nav });
				this.setState({ playerIcon : style.icon });
			}
			else {
				this.setState({ profileClass: style.nav });
				this.setState({ profileIcon: style.icon });
	
				this.setState({ adminClass : style.active });
				this.setState({ adminIcon : style.activeIcon });
		
				this.setState({ playerClass : style.active });
				this.setState({ playerIcon : style.activeIcon });
			}
		}
		catch (err) {
			this.setState({ profileClass: style.nav });
			this.setState({ profileIcon: style.icon });

			this.setState({ adminClass : style.active });
			this.setState({ adminIcon : style.activeIcon });
	
			this.setState({ playerClass : style.active });
			this.setState({ playerIcon : style.activeIcon });
		}

		this.setState({ settingsClass : style.settingsContainer })
	}

	// Route to path and set path in session storage
	linkTo = path => () => {
		sessionStorage.setItem('path', JSON.stringify(path));
		route(path);
	};


	goToMyProfile = this.linkTo('/profile');
	goToAdmin = this.linkTo('/admin');
	goToPlayer = this.linkTo('player');
	goToLogin = this.linkTo('/login');

	hightlightProfileTab = () => {
		this.setState({ profileClass : style.active });
		this.setState({ profileIcon : style.activeIcon });

		this.setState({ adminClass : style.nav });
		this.setState({ adminIcon : style.icon });

		this.setState({ playerClass : style.nav });
		this.setState({ playerIcon : style.icon });
	}

	hightlightAdminTab = () => {
		this.setState({ profileClass : style.nav });
		this.setState({ profileIcon : style.icon });

		this.setState({ adminClass : style.active });
		this.setState({ adminIcon : style.activeIcon });
	}

	hightlightPlayerTab = () => {
		this.setState({ profileClass : style.nav });
		this.setState({ profileIcon : style.icon });

		this.setState({ playerClass : style.active });
		this.setState({ playerIcon : style.activeIcon });
	}

	handleClickProfile = () => {
		this.hightlightProfileTab();
		this.goToMyProfile();
	};

	handleClickAdmin = () => {
		this.hightlightAdminTab();
		this.goToAdmin();
	};

	handleClickPlayer = () => {
		this.hightlightPlayerTab();
		this.goToPlayer();
	}

	// Request to Log out user
	logOut = () => {
		let that = this;
		let url = Auth.url + '/api/users/logout';
		let xhttp = new XMLHttpRequest();

		xhttp.open('POST', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status === 200) {
					Auth.logout();
				}
			}

		};

		xhttp.send();
	}

	openSettings = () => {
		if (this.state.settingsClass == style.settingsContainer) {
			this.setState({ settingsClass : style.settingsContainerClosed})
		}
		else if(this.state.settingsClass == style.settingsContainerClosed) {
			this.setState({ settingsClass : style.settingsContainer })
		}
	}
	
	render(props) {
		if (Auth.getAuth()) {
			if (Auth.check_admin()) {
				return (
					<div class={style.header}>
						<img class={style.logo} src='../../logo/StarsLogoTrans.png' />
	
						<div class={style.titleLogged}>Astrostars biobanding</div>
	
						<div class={this.state.settingsClass}>
							<div class={this.state.profileClass} onClick={this.handleClickProfile}>
								<List.ItemGraphic class={this.state.profileIcon}>account_circle</List.ItemGraphic>
								<div class={style.label}>Profil</div>
							</div>
	
							<div class={this.state.adminClass} onClick={this.handleClickAdmin}>
								<List.ItemGraphic class={this.state.adminIcon}>manage_accounts</List.ItemGraphic>
								<div class={style.label}>Admin</div>
							</div>
	
							<div class={style.nav} onClick={this.logOut}>
								<List.ItemGraphic class={style.icon}>exit_to_app</List.ItemGraphic>
								<div class={style.label}>Abmelden</div>
							</div>
						</div>
						<i onClick={this.openSettings} class={style.setIcon}>settings</i> 
					</div>
				)
			}
			else {
				return (
					<div class={style.header}>
						<img class={style.logo} src='../../logo/StarsLogoTrans.png' />
	
						<div class={style.titleLogged}>Astrostars biobanding</div>
	
						<div class={this.state.settingsClass}>
							<div class={this.state.profileClass} onClick={this.handleClickProfile}>
								<List.ItemGraphic class={this.state.profileIcon}>account_circle</List.ItemGraphic>
								<div class={style.label}>Profil</div>
							</div>
	
							<div class={this.state.playerClass} onClick={this.handleClickPlayer}>
								<List.ItemGraphic class={this.state.playerIcon}>directions_run</List.ItemGraphic>
								<div class={style.label}>Spieler</div>
							</div>
	
							<div class={style.nav} onClick={this.logOut}>
								<List.ItemGraphic class={style.icon}>exit_to_app</List.ItemGraphic>
								<div class={style.label}>Abmelden</div>
							</div>
						</div>
						<i onClick={this.openSettings} class={style.setIcon}>settings</i> 
					</div>
				)
			}

		}
	}	
}
