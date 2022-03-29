import Auth from './components/state'

export default function CreateAdmin() {
	
	let url_register = Auth.url + '/api/users/register';
	let url_count = Auth.url + '/api/usercount';

	let xhttp = new XMLHttpRequest();


	
		xhttp.open('GET', url_count);
		xhttp.setRequestHeader('Accept', 'application/json');
	
		xhttp.onreadystatechange = function() {
	
	
			if([0,1,2,3,4].includes(this.readyState)) {
	
				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);

						if (response.length == 0) {
							xhttp.open('POST', url_register);
							xhttp.setRequestHeader('Accept', 'application/json');
							xhttp.setRequestHeader('Content-Type', 'application/json');
						
						
						
							let data =  `{
								"username": "admin",
								"email": "admin@admin.de",
								"password": "12345",
								"is_admin": ${true}
							}`;

							xhttp.send(data);

						}
					}
					catch(err) {}
	
	
				}
			}
		}
	
		xhttp.send();
		
}