import { h, Component } from 'preact';
import { route, Router } from 'preact-router';
import { createContext, useContext } from 'preact-context'
import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFound from '../routes/404';
import Test from '../routes/test';
import Login from '../routes/login';
import Signup from '../routes/signup';
import { useState } from 'preact';
import Auth from './state.js';
import PlayerDetails from '../routes/playerDetails';
import AddPlayer from '../routes/addPlayer';
import ChangeData from '../routes/changeData';
import Measure
 from '../routes/measure';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */


	handleRoute = async e => {
		let auth = Auth.getAuth()
		if (auth == false || auth == undefined) {
			if (e.url == "/signup"){
				route('/signup', true)
			} else {
				route('login', true)
			}
		} else {
			this.setState({ currentUrl: e.url})
		}
	}



	render() {
		return (
			<div id="app">
				<Header selectedRoute={this.state.currentUrl}/>
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Test path="/test/"/>
					<Login path="/login/"/>
					<Signup path="/signup/"/>
					<PlayerDetails path="/playerDetails/"/>
					<AddPlayer path="/addPlayer/"/>
					<ChangeData path="/changeData/"/>
					<Measure path="/measure"/>
					<NotFound default />
				</Router>
			</div>
		);
	}
}
