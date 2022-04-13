import Auth from "./state";

export default class Requests {


	static getMeasurements = (id, token) => {
		let url = Auth.url + '/api/user/' + id + '/anthropometric';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  token);

		xhttp.onreadystatechange = function() {


			if([0,1,2,3,4].includes(this.readyState)) {

				if (this.status === 200) {
					return this.responseText;
				}
				else {
					return this.responseText;
				}
			}
		}
		xhttp.send();
	}


	static getPlayerDetails = (token) => {
		let url = Auth.url + '/api/users/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  token);

		xhttp.onreadystatechange = function() {

			if (this.readyState == 4 && this.status == 200) {
				console.log("RETURN")
				console.log(this.responseText)
				return this.responseText
			}
		}
		xhttp.send();	
		return this.responseText
	}
}