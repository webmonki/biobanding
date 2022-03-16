import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head1 from '../../components/head/head1.js'
import Head2 from '../../components/head/head2.js'
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js'
import { route, Router } from 'preact-router';



export default class ChangeData extends Component {
    state = ({ userId: "" })
    state = ({ userName: "" })
    state = ({ email: "" })
    state = ({ btnClass: "" })
    state = ({ btnDisabled: true })
    state = ({ feedback: "" })
    state = ({ feedbackStyle: ""})
    state = ({ token: "" })

    componentWillMount = () => {
        this.setState({ userId: Auth.getUser().getId() })
        this.setState({ userName: Auth.getUser().getName() })
        this.setState({ email: Auth.getUser().getEmail() })
        this.setState({ btnDisabled: true })
        this.setState({ btnClass: style.btnDisabled })
        this.setState({ token: Auth.getUser().getToken() })
    }

    handleChange = () => {
        this.setState({ email: document.getElementById("emailInput").value})
		// this.setState({ username: document.getElementById("userNameInput").value})
		this.setState({ loginResponse: ""})
        

		if (this.state.email.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)){
			this.setState({ btnDisabled: false})
			this.setState({ btnClass: style.btnEnabled })
		} else {
            console.log("BTN DIS")
			this.setState({ btnDisabled: true})
			this.setState({ btnClass: style.btnDisabled })
		}
    }

    sendData = () => {
        let that = this
		let url = "http://127.0.0.1:5000/api/users/edit" 
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("authorization", that.state.token)

        xhttp.onreadystatechange = function() {



			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					let response = JSON.parse(this.responseText)
					console.log("R:"+ this.responseText)
                    that.setState({ feedback: response.msg })
                    that.setState({ feedbackStyle: style.feedbackSucc })
				} else {
					let response = JSON.parse(this.responseText)
					console.log("RE:" + this.responseText)
                    that.setState({ feedback: response.msg })
                    that.setState({ feedbackStyle: style.feedbackErr })
				}
			} else {
				this.setState({ loginResponse: "Ups, something went wrong"})
			}
		}

        console.log("ID: " + this.state.userId)
        console.log("NAME: " + this.state.userName)
        console.log("EMAIL: " + this.state.email)

        let data = `{
            "userID": "${this.state.userId}",
            "username": "${this.state.userName}",
			"email": "${this.state.email}"
        }`

        xhttp.send(data)
    }

    render() {
		return (
			<div class={ style.layout }>
				<Card class={ style.card }>
					<Head2 headText="Profil ändern"/>
                    <div class={ style.container }>
                        <Input inputId="emailInput" inputLabel="E-Mail" type="email" onChange={ this.handleChange }/>
                        <div class={ this.state.feedbackStyle }>{ this.state.feedback }</div>
                        <div class={ style.center}>
                            <Button class={ this.state.btnClass } raised disabled={ this.state.btnDisabled } onClick={ this.sendData }>E-Mail ändern</Button>
                        </div>
					</div>
				</Card>
			</div>
		);
	}

}