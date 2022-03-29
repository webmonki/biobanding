export default class Auth {
	// URL of API
    static url = 'http://127.0.0.1:5000'


	// Save User Data in Session Storage
	static createUser = (response) => {
		let user = { id: response.user._id, name: response.user.username, email: response.user.email, token: response.token, is_admin: response.user.is_admin };
		sessionStorage.clear();
		sessionStorage.setItem('user', JSON.stringify(user));
	}


	// Get User from Session Storage
	static getUser = () => {
		let user = JSON.parse(sessionStorage.user);
		return user;
	}


	// Delete Session Storage
	static logout = () => {
		sessionStorage.clear();
	}

	static check_admin = () => {
		try {
			let user = JSON.parse(sessionStorage.user);
			return user.is_admin;
		}
		catch (err) {
			return false;
		}

	}


	// Check if User is set in Session Storage
	static getAuth = () => {
		if (sessionStorage.user !== undefined) {
			return true;
		}
		// else {
		// 	return false;
		// }
	}
}

