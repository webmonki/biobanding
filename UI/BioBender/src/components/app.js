import { h, Component } from 'preact';
import { route, Router } from 'preact-router';
import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFound from '../routes/404';
import Login from '../routes/login';
import Signup from '../routes/signup';
import Auth from './state.js';
import PlayerDetails from '../routes/playerDetails';
import AddPlayer from '../routes/addPlayer';
import ChangeData from '../routes/changeData';
import Measure from '../routes/measure';
import Config from '../routes/config';
import SetConfig from '../routes/setConfig';


export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */


	// Handle Routing an go to login or sign up if no user is set in Session Storage
	handleRoute = async e => {
		let auth = Auth.getAuth();
		if (auth === false || auth === undefined) {
			if (e.url === '/signup'){
				route('/signup', true);
			}
			else {
				route('login', true);
			}
		}
		else {
			this.setState({ currentUrl: e.url });
		}
	}


	render() {
		return (
			<div id="app">
				<Header selectedRoute={this.state.currentUrl} />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Login path="/login/" />
					<Signup path="/signup/" />
					<PlayerDetails path="/playerDetails/" />
					<AddPlayer path="/addPlayer/" />
					<ChangeData path="/changeData/" />
					<Measure path="/measure" />
					<Config path="/config" />
					<SetConfig path="/setConfig" />
					<NotFound default />
				</Router>
			</div>
		);
	}
}
