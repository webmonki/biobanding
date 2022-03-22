export default class Auth {
    static url = 'http://127.0.0.1:5000'


	static createUser = (response) => {

		let user = { id: response.user._id, name: response.user.username, email: response.user.email, token: response.token };
		sessionStorage.clear();
		sessionStorage.setItem('user', JSON.stringify(user));
	}

	static getUser = () => {
		let user = JSON.parse(sessionStorage.user);
		return user;
	}

	static logout = () => {
		sessionStorage.clear();
	}

	static getAuth = () => {
		if (sessionStorage.user !== undefined) {
			return true;
		}
		// else {
		// 	return false;
		// }
	}
}

