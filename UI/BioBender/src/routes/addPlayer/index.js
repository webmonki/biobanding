import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head1 from '../../components/head/head1.js'
import Head2 from '../../components/head/head2.js'
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js'
import { Link } from 'preact-router/match'
import { route } from 'preact-router';

export default class AddPlayer extends Component{
    state = ({ btnDisabled: true });
	state = ({ btnClass: ""});
    state = ({ feedback: "" });
    state = ({ feedbackStyle: style.feedbackSucc });
	state = ({ userId: undefined });
	state = ({ token: undefined });


    componentWillMount = () => {
		this.setState({ btnClass: style.btnDisabled });
		this.setState({ btnDisabled: true });
		this.setState({ userId: Auth.getUser().id })
		this.setState({ token: Auth.getUser().token })
	}


    sendData = () => {
		let that = this
		let url = "http://127.0.0.1:5000/api/user/" + this.state.userId + "/details" 
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.setRequestHeader("authorization", this.state.token);

        xhttp.onreadystatechange = function() {



			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					let response = JSON.parse(this.responseText)
                    that.setState({ feedback: response.msg })
                    that.setState({ feedbackStyle: style.feedbackSucc })
				} else {
					let response = JSON.parse(this.responseText)
                    that.setState({ feedback: response.msg })
                    that.setState({ feedbackStyle: style.feedbackErr })
				}
			} else {
				this.setState({ loginResponse: "Ups, something went wrong"})
			}
		}


		switch(this.state.sex){
			case "male":
				this.sex = 0;
				break;
			case "female":
				this.sex = 1;
				break;
			default:
				console.log("sex is not defined in profile")
		}

        let data =  `{
            "userID": ${this.state.userId},
            "first_name": "${this.state.firstName}",
			"last_name": "${this.state.lastName}",
			"birthday": "${this.state.birthday}",
			"sex_m_0_f_1" : ${this.sex},
			"height_father": ${this.state.fatherHeight},
			"height_mother": ${this.state.motherHeight}
        }`


        xhttp.send(data)
	}


    handleChange = () => {
		this.setState({ firstName: document.getElementById("fnInput").value })
		this.setState({ lastName: document.getElementById("lnInput").value })
		this.setState({ birthday: document.getElementById("bDayInput").value })
		this.setState({ fatherHeight: document.getElementById("fhInput").value })
		this.setState({ motherHeight: document.getElementById("mhInput").value })
		
		let male = document.getElementById("male").checked
		let female = document.getElementById("female").checked

		if (male && !female) {
			this.setState({ sex: "male" })
		} else if (!male && female) {
			this.setState({ sex: "female" })
		} else {
			this.setState({ sex: "" })
		}

		if (
			this.state.firstName != "" && 
			this.state.lastName != "" &&
			this.state.brithday != "" &&
			this.state.fatherHeight != "" &&
			this.state.motherHeight != "" &&
			this.state.sex != ""
		) {
			this.setState({ btnDisabled: false })
			this.setState({ btnClass: style.btnEnabled })
		} else {
			this.setState({ btnDisabled: true })
			this.setState({ btnClass: style.btnDisabled })
		}
	}


    goToPD = () => {
        route('/playerDetails', true)
    }


    render() {
		return (
			<div class={ style.layout }>
				<Card class={ style.card }>
					<Head2 headText="Spieler Details erstellen"></Head2>
                    <div class={ this.state.feedbackStyle }>{ this.state.feedback }</div>
                    <div class={ style.container }>
                    <div class={ style.row }>
								<input class={ style.radio } type="radio" name="sex" value="0" id="male" onClick={ this.handleChange }></input>
								<label class={ style.label } for="male">männlich</label>
								<input class={ style.radio } type="radio" name="sex" value="1" id="female" onClick={ this.handleChange }></input>
								<label class={ style.label } for="female">weiblich</label>
					</div>
					<div class={ style.inputContainer }>
						<Input inputId="fnInput" inputLabel="Vorname" onChange={ this.handleChange }/>
						<Input inputId="lnInput" inputLabel="Nachname" onChange={ this.handleChange }/>
						<Input inputId="bDayInput" inputLabel="Geburtstag" onChange={ this.handleChange }/>
						<Input inputId="fhInput" inputLabel="Größe des Vaters" onChange={ this.handleChange }/>
						<Input inputId="mhInput" inputLabel="Größe der Mutter" onChange={ this.handleChange }/>
					</div>
					<div class={ style.btnContainer }>
						<Button className={ this.state.btnClass } raised disabled={this.state.btnDisabled} onClick={ this.sendData }>erstellen</Button>
                    	<Button class={ style.btnEnabled } onClick={ this.goToPD }>Spieler Details</Button>
					</div>
                    </div>
				</Card>
			</div>
		);
	}
}