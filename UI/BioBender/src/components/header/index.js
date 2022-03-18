import { h, Component } from 'preact';
import { route } from 'preact-router';
import TopAppBar from 'preact-material-components/TopAppBar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
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
		// this.setState({navbarClass: style.navbarClosed });
		this.setState({ measureClass: style.nav });
		this.setState({ measureIcon: style.icon });
		this.setState({ navWindowClass: style.navWindowClosed });
		this.setState({ iconContainer: style.dontShow });
		this.setState({ title: style.titleLogged });
	}


	closeDrawer = () => {
		this.setState({ navWindowClass: style.navWindowClosed })
		// this.setState({ navbarClass: style.navbarClosed });
		// this.drawer.MDComponent.open = false;
		// this.state = {
		// 	darkThemeEnabled: false
		// };
	};

	// openDrawer = () => {
	// 	// this.drawer.MDComponent.open = true
	// 	this.setState({ navbarClass: style.navbarOpened });

	// };

	openNavbar = () => {
		if (this.state.navWindowClass == style.navWindowOpened) {
			this.setState({ navWindowClass: style.navWindowClosed });

		} else if (this.state.navWindowClass == style.navWindowClosed) {
			this.setState({ navWindowClass: style.navWindowOpened });
		}

		if (sessionStorage.path != undefined){
			let path = JSON.parse(sessionStorage.path);
			switch (path) {
				case "/":
					this.setState({ homeClass: style.active });
					this.setState({ profileClass: style.nav });
					this.setState({ detailsClass: style.nav });
					this.setState({ measureClass: style.nav });
			
					this.setState({homeIcon: style.activeIcon });
					this.setState({profileIcon: style.icon });
					this.setState({ detailsIcon: style.icon });
					this.setState({ measureIcon: style.icon });
					break;

				case "/profile":
					this.setState({ homeClass: style.nav });
					this.setState({ profileClass: style.active });
					this.setState({ detailsClass: style.nav });
					this.setState({ measureClass: style.nav });
			
					this.setState({homeIcon: style.icon });
					this.setState({profileIcon: style.activeIcon });
					this.setState({ detailsIcon: style.icon });
					this.setState({ measureIcon: style.icon });
					break;

				case "/playerDetails":
					this.setState({ homeClass: style.nav });
					this.setState({ profileClass: style.nav });
					this.setState({ detailsClass: style.active });
					this.setState({ measureClass: style.nav });
			
					this.setState({homeIcon: style.icon });
					this.setState({profileIcon: style.icon });
					this.setState({ detailsIcon: style.activeIcon });
					this.setState({ measureIcon: style.icon });
					break;

				case "/measure":
					this.setState({ measureClass: style.active });
					this.setState({ homeClass: style.nav });
					this.setState({ profileClass: style.nav });
					this.setState({ detailsClass: style.nav });
			
					this.setState({ measureIcon: style.activeIcon});
					this.setState({homeIcon: style.icon });
					this.setState({profileIcon: style.icon });
					this.setState({ detailsIcon: style.icon });
					break;

				default:
					break;
			}


		} else {
			this.setState({ homeClass: style.active });
			this.setState({ profileClass: style.nav });
			this.setState({ detailsClass: style.nav });
			this.setState({ measureClass: style.nav });
	
			this.setState({homeIcon: style.activeIcon });
			this.setState({profileIcon: style.icon });
			this.setState({ detailsIcon: style.icon });
			this.setState({ measureIcon: style.icon });
		}


	};

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	linkTo = path => () => {
        sessionStorage.setItem("path", JSON.stringify(path));
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

	logOut = () => {
		let that = this;
		let url = "http://127.0.0.1:5000/api/users/logout";
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
		xhttp.setRequestHeader("authorization", Auth.getUser().token);

        xhttp.onreadystatechange = function() {



			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					Auth.logout();
					that.goToLogin();
				} else {
					console.log(this.responseText);
				}
			} else {
				that.setState({ loginResponse: "Ups, something went wrong"});
			}
		}



        xhttp.send();
		that.closeDrawer();
	}

		// if (auth) {
		// 	console.log("YYYYYYYYYYYYY")
		// 	this.setState({ iconContainer: style.show })
		// 	this.setState({ title: style.titleLogged })
		// } else {
		// 	console.log("ZZZZZZZZZZZZZZZ")
		// 	this.setState({ iconContainer: style.dontShow})
		// 	this.setState({ title: style.titleNotLogged })
		// }
	render(props) {
		let auth = Auth.getAuth()

		if (auth) {
			return (
				<div>
					<div class={ style.header }>
						<div class={ style.show }>
							<TopAppBar.Icon menu onCLick={ this.openNavbar }>
								menu
							</TopAppBar.Icon>
						</div>
						<TopAppBar.Title class={ style.titleLogged }>BioBending</TopAppBar.Title>
					</div>
					<div class={ this.state.navWindowClass }>
						<div class={ style.navBar }>
							<div class={ this.state.homeClass } onClick={ this.handleClickHome }>
								<List.ItemGraphic class={ this.state.homeIcon }>home</List.ItemGraphic>
								Home
							</div>
	
							<div class={ this.state.profileClass } onClick={ this.handleClickProfile }>
								<List.ItemGraphic class={ this.state.profileIcon }>account_circle</List.ItemGraphic>
								Profil
							</div>
	
							<div class={ this.state.detailsClass } onclick={ this.handleClickDetails }>
								<List.ItemGraphic class={ this.state.detailsIcon }>face</List.ItemGraphic>
								Details
							</div>
	
							<div class={ this.state.measureClass } onCLick={ this.handleClickMeasure }>
								<List.ItemGraphic class={this.state.measureIcon }>equalizer</List.ItemGraphic>
								Messung
							</div>
	
							<div class={ style.nav } onClick={ this.logOut }>
								<List.ItemGraphic class={ style.icon }>close</List.ItemGraphic>
								Abmelden
							</div>
						</div>
						<div class={ style.clickShadow } onClick={ this.closeDrawer }></div>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div class={ style.header }>
						<div class={ style.dontShow }>
							<TopAppBar.Icon menu onCLick={ this.openNavbar }>
								menu
							</TopAppBar.Icon>
						</div>
						<TopAppBar.Title class={ style.titleNotLogged }>BioBending</TopAppBar.Title>
					</div>
					<div class={ this.state.navWindowClass }>
						<div class={ style.navBar }>
							<div class={ this.state.homeClass } onClick={ this.handleClickHome }>
								<List.ItemGraphic class={ this.state.homeIcon }>home</List.ItemGraphic>
								Home
							</div>
	
							<div class={ this.state.profileClass } onClick={ this.handleClickProfile }>
								<List.ItemGraphic class={ this.state.profileIcon }>account_circle</List.ItemGraphic>
								Profil
							</div>
	
							<div class={ this.state.detailsClass } onclick={ this.handleClickDetails }>
								<List.ItemGraphic class={ this.state.detailsIcon }>face</List.ItemGraphic>
								Details
							</div>
	
							<div class={ this.state.measureClass } onCLick={ this.handleClickMeasure }>
								<List.ItemGraphic class={this.state.measureIcon }>equalizer</List.ItemGraphic>
								Messung
							</div>
	
							<div class={ style.nav } onClick={ this.logOut }>
								<List.ItemGraphic class={ style.icon }>close</List.ItemGraphic>
								Abmelden
							</div>
						</div>
						<div class={ style.clickShadow } onClick={ this.closeDrawer }></div>
					</div>
				</div>
			);
		}
	}
}
