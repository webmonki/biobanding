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
import Button from 'preact-material-components/Button';


export default class Navbar extends Component {


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

		// for user tab
		this.highlightUser();

		this.highlightMeasure();


		this.setState({ evalClass : style.nav });
		this.setState({ evalIcon : style.icon });


		this.setState({ navbarClass : style.navBar });


		if (this.state.navbarClass == style.dontShow) {
			this.setState({ btnContent : <i class={style.btnIcon}>arrow_forward</i> })
		}
		else if (this.state.navbarClass == style.navBar) {
			this.setState({ btnContent : <i class={style.btnIcon}>arrow_back</i> })
		}

		this.setState({ navBtnClass : style.navBtnOpen })

		var that = this;

		window.addEventListener('scroll', function(event){
			let top = this.pageYOffset || this.screenY

			if (Auth.check_admin()) {
				let userContainer = document.getElementById('userContainer');
				let userRec = userContainer.getBoundingClientRect();
	
				let evalContainer = document.getElementById('evalContainer');
				let evalRec = evalContainer.getBoundingClientRect();
	
				let configContainer = document.getElementById('configContainer');
				let configRec = configContainer.getBoundingClientRect();
	
				if (top > userRec.top && top < userRec.bottom) {
					that.highlightUser();
				}
	
				if (top > evalRec.top && top < evalRec.bottom) {
					that.highlightEval();
				}
	
				if (top > configRec.top && top < configRec.bottom) {
					that.highlightConfig();
				}
			}
			else {
				let measureContainer = document.getElementById('measureContainer');
				let measureRec = measureContainer.getBoundingClientRect();

				let detailsContainer = this.document.getElementById('detailsContainer');
				let detailsRec = detailsContainer.getBoundingClientRect();

				if (top > 0 && top < measureRec.top) {
					that.highlightMeasure();
				}

				if (top > measureRec.bottom && top < detailsRec.bottom) {
					that.highlightDetails();
				}
			}
			


			that.getContent();
		}, false);

		that.getContent();

	}

	highlightDetails = () => {
		this.setState({ detailsClass : style.activePlayer });
		this.setState({ detailsIcon : style.activeIcon });

		this.setState({ measureClass : style.navPlayer});
		this.setState({ measureIcon : style.icon });
	}

	highlightMeasure = () => {
		this.setState({ detailsClass : style.navPlayer });
		this.setState({ detailsIcon : style.icon });

		this.setState({ measureClass : style.activePlayer });
		this.setState({ measureIcon : style.activeIcon });
	}

	highlightUser = () => {
		this.setState({ userClass : style.active });
		this.setState({ userIcon : style.activeIcon });

		this.setState({ evalClass : style.nav });
		this.setState({ evalIcon : style.icon})

		this.setState({ configClass : style.nav });
		this.setState({ configIcon : style.icon });
	}

	highlightEval = () =>  {
		this.setState({ userClass : style.nav });
		this.setState({ userIcon : style.icon });

		this.setState({ evalClass : style.active });
		this.setState({ evalIcon : style.activeIcon });

		this.setState({ configClass : style.nav });
		this.setState({ configIcon : style.icon });
	}

	highlightConfig = ()  => {
		this.setState({ userClass : style.nav });
		this.setState({ userIcon : style.icon });

		this.setState({ evalClass : style.nav });
		this.setState({ evalIcon : style.icon });

		this.setState({ configClass : style.active });
		this.setState({ configIcon : style.activeIcon });
	}

	handleClickUser = () => {
		// this.highlightUser();
		this.getContent();
		let container = document.getElementById('userContainer');
		let rec = container.getBoundingClientRect();
		let top = window.screenY || window.pageYOffset

		if (top < rec.top || top > rec.bottom) {
			window.scrollTo({
				top: rec.top,
				behavior: 'smooth'
			})
		}
	}

	handleClickEvaluation = () => {
		// this.highlightEval();
		this.getContent();
		let container = document.getElementById('evalContainer');
		let rec = container.getBoundingClientRect();
		let top = window.screenY || window.pageYOffset

		if (top < rec.top || top > rec.bottom) {
			window.scrollTo({
				top: rec.top,
				behavior: 'smooth'
			})
		}
	}

	handleClickConfig = () => {
		// this.highlightConfig();
		this.getContent();
		let container = document.getElementById('configContainer');
		let rec = container.getBoundingClientRect();
		let top = window.screenY || window.pageYOffset

		if (top < rec.top || top > rec.bottom) {
			window.scrollTo({
				top: rec.top,
				behavior: 'smooth'
			})
		}
	}

	handleClickMeasure = () => {
		// this.highlightMeasure();
		this.getContent();
		let container = document.getElementById('measureContainer');
		let rec = container.getBoundingClientRect();
		let top = window.screenY || window.pageYOffset

		if (top < rec.top || top > rec.bottom) {
			window.scrollTo({
				top: rec.top,
				behavior: 'smooth'
			})
		}
	}

	handleClickDetails = () => {
		// this.highlightDetailsTab
		this.getContent();
		let container = document.getElementById('detailsContainer');
		let rec = container.getBoundingClientRect();
		let top = window.screenY || window.pageYOffset

		if (top < rec.top || top > rec.bottom) {
			window.scrollTo({
				top: rec.top,
				behavior: 'smooth'
			})
		}
	}

	getContent = () => {
		if (Auth.getAuth()){
			if (Auth.check_admin()) {
				var content = (
					<div class={this.state.navbarClass}>
						<img class={style.logo} src='../../logo/StarsLogoTrans.png' />

						<div class={this.state.userClass} onClick={this.handleClickUser}>
							<List.ItemGraphic class={this.state.userIcon}>group</List.ItemGraphic>
							<div class={style.label}>Benutzer</div>
						</div>

						<div class={this.state.evalClass} onClick={this.handleClickEvaluation}>
							<List.ItemGraphic class={this.state.evalIcon}>equalizer</List.ItemGraphic>
							<div class={style.label}>Auswertung</div>
						</div>
		
						<div class={this.state.configClass} onClick={this.handleClickConfig}>
							<List.ItemGraphic class={this.state.configIcon}>build</List.ItemGraphic>
							<div class={style.label}>Konfiguration</div>
						</div>
					</div>
				)
			}
			else {
				var content = (
					<div class={this.state.navbarClass}>
						<img class={style.logo} src='../../logo/StarsLogoTrans.png' />

						<div class={this.state.measureClass} onCLick={this.handleClickMeasure}>
							<List.ItemGraphic class={this.state.measureIcon}>equalizer</List.ItemGraphic>
							<div class={style.label}>Messungen</div>
						</div>
		
						<div class={this.state.detailsClass} onclick={this.handleClickDetails}>
							<List.ItemGraphic class={this.state.detailsIcon}>face</List.ItemGraphic>
							<div class={style.label}>Details</div>
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

	toogleNavbar = () => {
		this.props.toogleNavbar();


		if (this.state.navbarClass == style.dontShow) {
			this.setState({ btnContent : <i class={style.btnIcon}>arrow_back</i> })
			this.setState({ navBtnClass : style.navBtnOpen })
			this.setState({ navbarClass : style.navBar })
		}
		else if (this.state.navbarClass == style.navBar) {
			this.setState({ btnContent : <i class={style.btnIcon}>arrow_forward</i> })
			this.setState({ navBtnClass : style.navBtnClosed })
			this.setState({ navbarClass : style.dontShow })
		}

		this.getContent();
	}

	render(props) {
		return (
			<div>
				<div class={this.state.navBtnClass} onClick={this.toogleNavbar}>
					{this.state.btnContent}
				</div>
				{this.state.content}
			</div>

		)
	}
}