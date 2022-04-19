import Drawer from 'preact-material-components/Drawer';
import 'preact-material-components/Drawer/style.css';
import { h, Component } from 'preact';
import 'preact-material-components/List/style.css';
import List from 'preact-material-components/List';
import style from './style'
import { route } from 'preact-router';
import Auth from '../state';


export default class Navbar extends Component {


	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	railRef = rail => (this.rail = rail)

	componentWillMount = () => {
		this.getNavbarContent(this.props);

	}
	
	componentDidMount = () => {

		if (this.drawer.MDComponent.open == true) {
			this.drawer.MDComponent.open = true;
			this.rail.MDComponent.open = false;
			this.props.fitPageSize(false);

		}
		else if (this.rail.MDComponent.open == true){
			this.drawer.MDComponent.open = false;
			this.rail.MDComponent.open = true;
			this.props.fitPageSize(true);

		} else {
			this.props.fitPageSize(false);
			this.drawer.MDComponent.open = true;
			this.rail.MDComponent.open = false;
		}

	}



	linkTo = path => () => {
		route(path);
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');
	goToMeasurements = this.linkTo('/measurements')
	goToUsers = this.linkTo('/users')

	toggleDrawer = () => {
		if (this.drawer.MDComponent.open == false) {
			this.drawer.MDComponent.open = true;
			this.rail.MDComponent.open = false;
			this.props.fitPageSize(false);

		}
		else {
			this.props.fitPageSize(true);
			this.drawer.MDComponent.open = false;
			this.rail.MDComponent.open = true;
		}
	}

	getNavbarContent = (props) => {
		let content;
		if (Auth.check_admin()) {
			content = (
				<div id='navbar'>
				<i class={style.menuIcon} aria-hidden="true" onClick={this.toggleDrawer}>menu</i>

				<Drawer dismissible ref={this.drawerRef} class={style.navbar}>
					<Drawer.DrawerContent class={style.navbarContent}>
						<Drawer.DrawerItem selected={props.selectedRoute === '/measurements'} onClick={this.goToMeasurements}>
							<List.ItemGraphic>equalizer</List.ItemGraphic>
							<span>Messungen</span>
						</Drawer.DrawerItem>
						<Drawer.DrawerItem selected={props.selectedRoute === '/users'} onClick={this.goToUsers}>
							<List.ItemGraphic>group</List.ItemGraphic>
							<span>Benutzer</span>
						</Drawer.DrawerItem>
						<Drawer.DrawerItem selected={props.selectedRoute === '/profile'} onClick={this.goToMyProfile}>
							<List.ItemGraphic>account_circle</List.ItemGraphic>
							<span>Profil</span>
						</Drawer.DrawerItem>
					</Drawer.DrawerContent>
				</Drawer>
				<Drawer dismissible ref={this.railRef} class={style.navrail}>
					<Drawer.DrawerContent class={style.navrailContent}>
						<Drawer.DrawerItem selected={props.selectedRoute === '/measurements'} onClick={this.goToMeasurements}>
							<List.ItemGraphic>equalizer</List.ItemGraphic>
						</Drawer.DrawerItem>
						<Drawer.DrawerItem selected={props.selectedRoute === '/users'} onClick={this.goToUsers}>
							<List.ItemGraphic>group</List.ItemGraphic>
						</Drawer.DrawerItem>
						<Drawer.DrawerItem selected={props.selectedRoute === '/profile'} onClick={this.goToMyProfile}>
							<List.ItemGraphic>account_circle</List.ItemGraphic>
						</Drawer.DrawerItem>
					</Drawer.DrawerContent>
				</Drawer>
			</div>
			)
		}
		else {
			content = (
				<div id='navbar'>
				<i class={style.menuIcon} aria-hidden="true" onClick={this.toggleDrawer}>menu</i>

				<Drawer dismissible ref={this.drawerRef} class={style.navbar}>
					<Drawer.DrawerContent class={style.navbarContent}>
						<Drawer.DrawerItem selected={props.selectedRoute === '/measurements'} onClick={this.goToMeasurements}>
							<List.ItemGraphic>equalizer</List.ItemGraphic>
							<span>Messungen</span>
						</Drawer.DrawerItem>
						<Drawer.DrawerItem selected={props.selectedRoute === '/profile'} onClick={this.goToMyProfile}>
							<List.ItemGraphic>account_circle</List.ItemGraphic>
							<span>Profil</span>
						</Drawer.DrawerItem>
					</Drawer.DrawerContent>
				</Drawer>
				<Drawer dismissible ref={this.railRef} class={style.navrail}>
					<Drawer.DrawerContent class={style.navrailContent}>
						<Drawer.DrawerItem selected={props.selectedRoute === '/measurements'} onClick={this.goToMeasurements}>
							<List.ItemGraphic>equalizer</List.ItemGraphic>
						</Drawer.DrawerItem>
						<Drawer.DrawerItem selected={props.selectedRoute === '/profile'} onClick={this.goToMyProfile}>
							<List.ItemGraphic>account_circle</List.ItemGraphic>
						</Drawer.DrawerItem>
					</Drawer.DrawerContent>
				</Drawer>
			</div>
			)
		}

		this.setState({ content });
	}

	render (props) {
		return (
			this.state.content
		)
	}
}