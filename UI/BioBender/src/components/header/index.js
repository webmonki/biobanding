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
	state = ({ token: undefined });
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
	state = ({ iconContainer: undefined });
	state = ({ title: undefined });


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
		this.setState({ navWindowClass: style.navWindowClosed });
		this.setState({ iconContainer: style.dontShow });
		this.setState({ title: style.titleLogged });
	}


	closeDrawer = () => {
		this.setState({ navWindowClass: style.navWindowClosed });
	};


	// Display Navigation Bar and Highlight active Tab
	openNavbar = () => {
		if (this.state.navWindowClass === style.navWindowOpened) {
			this.setState({ navWindowClass: style.navWindowClosed });

		}
		else if (this.state.navWindowClass === style.navWindowClosed) {
			this.setState({ navWindowClass: style.navWindowOpened });
		}

		if (sessionStorage.path !== undefined){
			let path = JSON.parse(sessionStorage.path);
			switch (path) {
				case '/':
					this.setState({ homeClass: style.active });
					this.setState({ profileClass: style.nav });
					this.setState({ detailsClass: style.nav });
					this.setState({ measureClass: style.nav });
					this.setState({ configClass: style.nav });
			
					this.setState({ homeIcon: style.activeIcon });
					this.setState({ profileIcon: style.icon });
					this.setState({ detailsIcon: style.icon });
					this.setState({ measureIcon: style.icon });
					this.setState({ configIcon: style.icon });
					break;

				case '/profile':
					this.setState({ homeClass: style.nav });
					this.setState({ profileClass: style.active });
					this.setState({ detailsClass: style.nav });
					this.setState({ measureClass: style.nav });
					this.setState({ configClass: style.nav });

					this.setState({ homeIcon: style.icon });
					this.setState({ profileIcon: style.activeIcon });
					this.setState({ detailsIcon: style.icon });
					this.setState({ measureIcon: style.icon });
					this.setState({ configIcon: style.icon });

					break;

				case '/playerDetails':
					this.setState({ homeClass: style.nav });
					this.setState({ profileClass: style.nav });
					this.setState({ detailsClass: style.active });
					this.setState({ measureClass: style.nav });
					this.setState({ configClass: style.nav });

					this.setState({ homeIcon: style.icon });
					this.setState({ profileIcon: style.icon });
					this.setState({ detailsIcon: style.activeIcon });
					this.setState({ measureIcon: style.icon });
					this.setState({ configIcon: style.icon });

					break;

				case '/measure':
					this.setState({ measureClass: style.active });
					this.setState({ homeClass: style.nav });
					this.setState({ profileClass: style.nav });
					this.setState({ detailsClass: style.nav });
					this.setState({ configClass: style.nav });

					this.setState({ measureIcon: style.activeIcon });
					this.setState({ homeIcon: style.icon });
					this.setState({ profileIcon: style.icon });
					this.setState({ detailsIcon: style.icon });
					this.setState({ configIcon: style.icon });

					break;

				case '/config':
					this.setState({ measureClass: style.nav });
					this.setState({ homeClass: style.nav });
					this.setState({ profileClass: style.nav });
					this.setState({ detailsClass: style.nav });
					this.setState({ configClass: style.active });

					this.setState({ measureIcon: style.icon });
					this.setState({ homeIcon: style.icon });
					this.setState({ profileIcon: style.icon });
					this.setState({ detailsIcon: style.icon });
					this.setState({ configIcon: style.activeIcon });

					break;

				default:
					break;
			}


		}
		else {
			this.setState({ homeClass: style.active });
			this.setState({ profileClass: style.nav });
			this.setState({ detailsClass: style.nav });
			this.setState({ measureClass: style.nav });
	
			this.setState({ homeIcon: style.activeIcon });
			this.setState({ profileIcon: style.icon });
			this.setState({ detailsIcon: style.icon });
			this.setState({ measureIcon: style.icon });
		}


	};

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);


	// Route to path and set path in session storage
	linkTo = path => () => {
		sessionStorage.setItem('path', JSON.stringify(path));
		route(path);
		this.closeDrawer();
	};


	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');
	goToTest = this.linkTo('/test');
	goToLogin = this.linkTo('/login');
	goToSignUp = this.linkTo('/signup');
	goToPD = this.linkTo('/playerDetails');
	goToMeasure = this.linkTo('/measure');
	goToConfig = this.linkTo('/config');


	handleClickHome = () => {
		this.goHome();
	};

	handleClickProfile = () => {
		this.goToMyProfile();
	};

	handleClickDetails = () => {
		this.goToPD();
	};

	handleClickMeasure = () => {
		this.goToMeasure();
	};

	handleClickConfig = () => {
		this.goToConfig();
	};

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
					that.goToLogin();
				}
			}
			else {
				that.setState({ loginResponse: 'Ups, something went wrong' });
			}
		};

		xhttp.send();

		that.closeDrawer();
	}

	
	render(props) {
		let auth = Auth.getAuth();

		if (auth) {
			return (
				<div class={style.headContainer}>
					<div class={style.header}>
						<div class={style.show}>
							<TopAppBar.Icon menu onCLick={this.openNavbar}>
								menu
							</TopAppBar.Icon>
						</div>
						<TopAppBar.Title class={style.titleLogged}>BioBending</TopAppBar.Title>
					</div>
					<div class={this.state.navWindowClass}>
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

							<div class={this.state.configClass} onClick={this.handleClickConfig}>
								<List.ItemGraphic class={this.state.configIcon}>build</List.ItemGraphic>
								Konfiguration
							</div>
	
							<div class={style.nav} onClick={this.logOut}>
								<List.ItemGraphic class={style.icon}>close</List.ItemGraphic>
								Abmelden
							</div>

						</div>
						<div class={style.clickShadow} onClick={this.closeDrawer} />
					</div>
				</div>
			);
		}
		return (
			<div>
				<div class={style.header}>
					<div class={style.dontShow}>
						<TopAppBar.Icon menu onCLick={this.openNavbar}>
								menu
						</TopAppBar.Icon>
					</div>
					<TopAppBar.Title class={style.titleNotLogged}>BioBending</TopAppBar.Title>
				</div>
			</div>
		);
		
	}
}
