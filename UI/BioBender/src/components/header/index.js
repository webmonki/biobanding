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

	componentWillMount = () => {
		this.setState({ homeClass: style.nav });
		this.setState({ profileClass: style.nav });
		this.setState({ detailsClass: style.nav });
		this.setState({ homeIcon: style.icon });
		this.setState({ profileIcon: style.icon });
		this.setState({ detailsIcon: style.icon });
		this.setState({navbarClass: style.navbarClosed })
		this.setState({ measureClass: style.nav })
		this.setState({ measureIcon: style.icon })
	}


	closeDrawer() {
		this.setState({ navbarClass: style.navbarClosed })
		// this.drawer.MDComponent.open = false;
		// this.state = {
		// 	darkThemeEnabled: false
		// };
	}

	openDrawer = () => (
		// this.drawer.MDComponent.open = true
		this.setState({ navbarClass: style.navbarOpened })
		);

	openNavbar = () => {
		if (this.state.navbarClass == style.navbarOpened) {
			this.setState({ navbarClass: style.navbarClosed})
		} else if (this.state.navbarClass == style.navbarClosed) {
			this.setState({ navbarClass: style.navbarOpened})
		}
	}

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	linkTo = path => () => {
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
		this.setState({ homeClass: style.active });
		this.setState({ profileClass: style.nav });
		this.setState({ detailsClass: style.nav });
		this.setState({ measureClass: style.nav })

		this.setState({homeIcon: style.activeIcon });
		this.setState({profileIcon: style.icon });
		this.setState({ detailsIcon: style.icon });
		this.setState({ measureIcon: style.icon })
	};

	handleClickProfile = () => {
		this.goToMyProfile();
		this.setState({ homeClass: style.nav });
		this.setState({ profileClass: style.active });
		this.setState({ detailsClass: style.nav });
		this.setState({ measureClass: style.nav })

		this.setState({homeIcon: style.icon });
		this.setState({profileIcon: style.activeIcon });
		this.setState({ detailsIcon: style.icon });
		this.setState({ measureIcon: style.icon })
	};

	handleClickDetails = () => {
		this.goToPD();
		this.setState({ homeClass: style.nav });
		this.setState({ profileClass: style.nav });
		this.setState({ detailsClass: style.active });
		this.setState({ measureClass: style.nav })

		this.setState({homeIcon: style.icon });
		this.setState({profileIcon: style.icon });
		this.setState({ detailsIcon: style.activeIcon });
		this.setState({ measureIcon: style.icon })
	};

	handleClickMeasure = () => {
		this.goToMeasure();
		this.setState({ measureClass: style.active })
		this.setState({ homeClass: style.nav });
		this.setState({ profileClass: style.nav });
		this.setState({ detailsClass: style.nav });

		this.setState({ measureIcon: style.activeIcon})
		this.setState({homeIcon: style.icon });
		this.setState({profileIcon: style.icon });
		this.setState({ detailsIcon: style.icon });
	};

	logOut = () => {
		let that = this;
		let url = "http://127.0.0.1:5000/api/users/logout";
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        // xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("authorization", Auth.getUser().getToken());

        xhttp.onreadystatechange = function() {



			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					Auth.setUser(undefined)
					route('/login', true);
				} else {
					console.log(this.responseText);
				}
			} else {
				that.setState({ loginResponse: "Ups, something went wrong"});
			}
		}



        xhttp.send()
		that.closeDrawer()
	}

	test = () => {
		console.log("CLICK")
		this.closeDrawer()
	}

	render(props) {
		let auth = Auth.getAuth()

		if (auth) {
			return (
				<div>
					<TopAppBar className={"topappbar"} style={{ backgroundColor: "rgb(52,83,138)"}}>
						<TopAppBar.Row>
							<TopAppBar.Section align-start>
								<TopAppBar.Icon menu onClick={ this.openNavbar }>
									menu
								</TopAppBar.Icon>
								<TopAppBar.Title>BioBending</TopAppBar.Title>
							</TopAppBar.Section>
						</TopAppBar.Row>
					</TopAppBar>

					<div class={ this.state.navbarClass }>
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
{/* 
					<Drawer modal ref={this.drawerRef}>
						<Drawer.DrawerContent style={ style.center }>
							<br/>

							<Drawer.DrawerItem
								className={ this.state.homeClass }
								selected={props.selectedRoute === '/'}
								onClick={ this.handleClickHome }>
								<List.ItemGraphic class={ this.state.homeIcon }>home</List.ItemGraphic>
								Home
							</Drawer.DrawerItem>
							<Drawer.DrawerItem class={ this.state.profileClass } selected={props.selectedRoute === '/profile'} onClick={ this.handleClickProfile }>
								<List.ItemGraphic class={ this.state.profileIcon }>account_circle</List.ItemGraphic>
								Profile
							</Drawer.DrawerItem>
							<Drawer.DrawerItem class={ this.state.detailsClass } selected={props.selectedRoute === '/playerDetails'} onClick={ this.handleClickDetails }>
								<List.ItemGraphic class={ this.state.detailsIcon }>face</List.ItemGraphic>
								Player Details
							</Drawer.DrawerItem>
							<Drawer.DrawerItem class={ this.state.logoutClass } onClick={this.logOut}>
								<List.ItemGraphic>close</List.ItemGraphic>
								Log Out
							</Drawer.DrawerItem>
						</Drawer.DrawerContent>
					</Drawer> */}
				</div>
			);
		} else {
			return (
				<div>
					<TopAppBar className={"topappbar"} style={{ backgroundColor: "rgb(52,83,138)"}}>
						<TopAppBar.Row>
							<TopAppBar.Section align-start>
								<TopAppBar.Title>BioBending</TopAppBar.Title>
							</TopAppBar.Section>
							<TopAppBar.Section align-end shrink-to-fit onClick={this.openSettings}>
							</TopAppBar.Section>
						</TopAppBar.Row>
					</TopAppBar>
				</div>
			);
		}
		
	}
}
