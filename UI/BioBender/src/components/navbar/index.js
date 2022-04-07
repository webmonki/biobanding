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
			let bottom = top + window.innerHeight;

			if (Auth.check_admin()) {
				let userContainer = document.getElementById('userContainer');
				let userRec = userContainer.getBoundingClientRect();
	
				let evalContainer = document.getElementById('evalContainer');
				let evalRec = evalContainer.getBoundingClientRect();
	
				let configContainer = document.getElementById('configContainer');
				let configRec = configContainer.getBoundingClientRect();

				let headerContaienr = document.getElementById('header');
				let headerRec = headerContaienr.getBoundingClientRect();

				let userContainerHeight = Math.abs(userRec.top - userRec.bottom)
				let evalContainerHeight = Math.abs(evalRec.top - evalRec.bottom)
				let headerContaienrHeight = Math.abs(headerRec.top - headerRec.bottom)
				let configContainerHeight = Math.abs(configRec.top - configRec.bottom)

				if (top < headerContaienrHeight + userContainerHeight * 0.7){
					that.highlightUser();
				}
				else {
					if (bottom > headerContaienrHeight + userContainerHeight + evalContainerHeight + configContainerHeight * 0.7) {
						that.highlightConfig();
					}
					else {
						that.highlightEval();
					}
				}



			}
			else {
				let measureContainer = document.getElementById('measureContainer');
				let measureRec = measureContainer.getBoundingClientRect();

				let detailsContainer = this.document.getElementById('detailsContainer');
				let detailsRec = detailsContainer.getBoundingClientRect();

				let headerHeight = document.getElementById('header').style.height;

				let measureContainerHeight = Math.abs(measureRec.top - measureRec.bottom)
				let detailsContainerHeight = Math.abs(detailsRec.top - detailsRec.bottom)


				if (top > headerHeight && top < measureContainerHeight) {
					that.highlightMeasure();
				}

				if (top > measureContainerHeight && top < detailsContainerHeight) {
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


	jumpTo = (id) => {
		document.getElementById(id).scrollIntoView({behavior: 'smooth'});
	}

	getContent = () => {
		if (Auth.getAuth()){
			if (Auth.check_admin()) {
				var content = (
					<div class={this.state.navbarClass}>
						<img class={style.logo} src='../../logo/StarsLogoTrans.png' />

						<div class={this.state.userClass} onClick={() => {this.jumpTo('userContainer')}}>
							<List.ItemGraphic class={this.state.userIcon}>group</List.ItemGraphic>
							<div class={style.label}>Benutzer</div>
						</div>

						<div class={this.state.evalClass} onClick={() => {this.jumpTo('evalContainer')}}>
							<List.ItemGraphic class={this.state.evalIcon}>equalizer</List.ItemGraphic>
							<div class={style.label}>Auswertung</div>
						</div>
		
						<div class={this.state.configClass} onClick={() => {this.jumpTo('configContainer')}}>
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