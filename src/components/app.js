import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { route } from 'preact-router';
import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFound from '../routes/404';
import Measurements from '../routes/measurements';
import Login from '../routes/login';
import Signup from '../routes/signup';
import Auth from './state';
import Users from '../routes/users';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

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
			try {
				var path = JSON.parse(sessionStorage.path);
			}
			catch (err) {
				path = undefined;
			}
			if (Auth.check_admin()) {

				path != undefined ? this.setState({ currentUrl: '/home'}) : this.setState({ currentUrl : path })

			}
			else {
				path != undefined ? this.setState({ currentUrl: '/home'}) : this.setState({ currentUrl : path })

			}
		}
	}

	render() {
		return (
			<div id="app">
				<Header selectedRoute={this.state.currentUrl} />
				<Router onChange={this.handleRoute}>
					<Login path='/login' />
					<Signup path='/signup' />
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Measurements path="/measurements" />
					<Users path="/users" />
					<NotFound default />
				</Router>
			</div>
		);
	}
}
