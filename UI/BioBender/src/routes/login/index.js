import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import TextField from 'preact-material-components/TextField'
import 'preact-material-components/TextField/style.css';
import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css';
import style from './style';
import { route, Router } from 'preact-router';
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js'
import { Link } from 'preact-router/match'
import Head1 from '../../components/head/head1.js'


class Form extends Component {
	state = { username: ""};
	state = { password: ""};
	state = { btnDisabled: true};
	state = { emailVal: ""}
	state = { passwordVal: ""}
    state = { btnClass: undefined }
	state = { loginResponse: ""}
	
	setLoginResponse = (val) => {
		this.setState({ loginResponse: val})
	}

	componentWillMount = () => {
		this.setState({ btnClass: style.btnDisabled })
		this.setState({ btnDisabled: true })
	}

	handleChange = () => {
		this.setState({ email: document.getElementById("email-input").value})
		this.setState({ password: document.getElementById("password-input").value})
		this.setState({ loginResponse: ""})

		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		) && this.state.password.length > 3 && this.state.password.length < 17){
			this.setState({ btnDisabled: false})
			this.setState({ btnClass: style.btnEnabled })
		} else {
			this.setState({ btnDisabled: true})
			this.setState({ btnClass: style.btnDisabled })
		}

	}

	login = () => {
		let that = this
		let url = "http://127.0.0.1:5000/api/users/login"
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function() {



			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					let response = JSON.parse(this.responseText)
					Auth.createUser(response)
					route('/', true)
				} else {
					let response = JSON.parse(this.responseText)
					that.setState({ loginResponse: response.msg })
				}
			} else {
				this.setState({ loginResponse: "Ups, something went wrong"})
			}
		}

        let data =  `{
            "email": "${this.state.email}",
            "password": "${this.state.password}"
        }`

        xhttp.send(data)
	}

	render() {
		return(
			<div class={ style.layout }>
				<Card class= {style.card }>
					<Head1 headText="Anmeldung"></Head1>
					<Input inputId="email-input" inputLabel="E-Mail" type="email" onChange={ this.handleChange }/>
					<br/>
					<br/>
					<Input inputId="password-input" inputLabel="Passwort" type="password" onChange={ this.handleChange }/>
					<div style={{ color:  "#B1262D"}}>{ this.state.loginResponse }</div>
					<br/>
					<Button className={ this.state.btnClass } raised onClick={this.login} disabled={this.state.btnDisabled}>anmelden</Button>
					<br/>
					<Link href='/signup' data-native>registrieren</Link>
					
				</Card>
			</div>			
		);
	}

}

export default class Login extends Component {
	render() {
		return (
				<Form></Form>
		);
	}
}

