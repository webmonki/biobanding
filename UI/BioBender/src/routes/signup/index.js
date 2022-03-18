import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import TextField from 'preact-material-components/TextField'
import 'preact-material-components/TextField/style.css';
import Button from 'preact-material-components/Button'
import 'preact-material-components/Button/style.css';
import style from './style';
import Input from '../../components/input/input.js'
import { route } from 'preact-router';
import Head1 from '../../components/head/head1.js'

class Form extends Component {
	state = { username: ""}
	state = { password: ""}
	state = ({ password2: "" })
    state = { email: ""}
	state = { btnDisabled: true}
    state = { btnClass: undefined}
    state = { signupResponse: ""}

	componentWillMount = () => {
		this.setState({ btnClass: style.btnDisabled })
		this.setState({ btnDisabled: true })
	}

	handleChange = () => {
		this.setState({ username: document.getElementById("usernameInput").value})
		this.setState({ password: document.getElementById("passwordInput").value})
        this.setState({ email: document.getElementById("emailInput").value})
		this.setState({ password2: document.getElementById("password2Input").value })

		if (this.state.password != this.state.password2) {
			this.setState({ signupResponse: "Passwörter stimmen nicht überein."})
		} else {
			this.setState({ signupResponse: "" })
		}


        if (this.state.email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) && this.state.username.length > 2 && this.state.username.length < 33 && this.state.password.length > 3 && this.state.password.length < 17 &&
		this.state.password == this.state.password2) {
            this.setState({ btnDisabled: false })
            this.setState({ btnClass: style.btnEnabled})
        } else {
            this.setState({ btnDisabled: true})
            this.setState({ btnClass: style.btnDisabled })
        }
	}

	signup = () => {
        let that = this
        let url = "http://127.0.0.1:5000/api/users/register"
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.onreadystatechange = function() {



			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					route('/', true)
				} else {
					let response = JSON.parse(this.responseText)
					that.setState({ signupResponse: response.msg })
				}
			} else {
				this.setState({ signupResponse: "Ups, something went wrong"})
			}
        }

        let data =  `{
            "username": "${this.state.username}",
            "email": "${this.state.email}",
            "password": "${this.state.password}"
        }`

        xhttp.send(data)

        

	}

	render() {
		return(
			<div class={style.layout}>
				<Card class={style.card}>
				<Head1 headText="Registrierung"></Head1>
					<div class={ style.inputContainer }>
						<Input inputId="usernameInput" inputLabel="Benutzername" type="username" onChange={ this.handleChange }/>
						<Input inputId="emailInput" inputLabel="E-Mail" type="email" onChange={ this.handleChange}/>
						<Input inputId="passwordInput" inputLabel="Passwort" type="password" onChange={ this.handleChange }/>
						<Input inputId="password2Input" inputLabel="Passwort wiederholen" type="password" onChange={ this.handleChange }/>
						<div style={{ color:  "#B1262D" }}>{ this.state.signupResponse }</div>
						<Button className={ this.state.btnClass } raised onClick={this.signup} disabled={this.state.btnDisabled}>registrieren</Button>
					</div>
				</Card>
			</div>
		);
	}

}

export default class Signup extends Component {
	render() {
		return (
			<Form></Form>
		);
	}
}