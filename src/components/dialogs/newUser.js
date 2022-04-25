import { h, Component } from 'preact';
import style from './style'
import 'preact-material-components/TextField/style.css';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Select/style.css';
import Dialog from 'preact-material-components/Dialog';
import 'preact-material-components/Dialog/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';

export default class NewUser extends Component {

	componentWillMount = () => {
		this.setState({ admin : false });
	}

	handleKey = (event) => {
		if(event.code == 'Enter') {
			this.props.sendData(this.state.username, this.state.email, this.state.password, this.state.admin);
			document.removeEventListener('keyup', this.handleKey)
		}
	}

	render() {
		return (
			<Dialog class={style.dialog} ref={this.props.reference} onAccept={() => {
				this.props.sendData(this.state.username, this.state.email, this.state.password, this.state.admin);
			}} onCancel={() => {
				document.removeEventListener('keyup', this.handleKey)
			}}>
				<Dialog.Header>Neuen Benutzer anlegen</Dialog.Header>
				<Dialog.Body>
					<div class={style.inputContainer}>
						<span class={style.subHeader}>Login Daten</span>
						<div class={style.row}>
							<div class={style.input}>
								<TextField autocomplete='off' outlined label='Benutzername' class={style.fullWidth} value={this.state.username} onKeyUp={e => {
									document.addEventListener('keyup', this.handleKey)
									this.setState({ username : e.target.value })
									let val = e.target.value
									if (val.length < 1) {
										this.setState({usernameFBClass : style.feedbackErr})
										this.setState({ usernameFB : 'Mindestens 1 Zeichen'})
									}
									if (val.length > 32) {
										this.setState({usernameFBClass : style.feedbackErr })
										this.setState({ usernameFB : 'Maximal 32 Zeichen'})
									}
									if (val.length > 0 && val.length < 33) {
										this.setState({usernameFBClass : style.feedbackSucc })
										this.setState({usernameFB : ''})
									}
								}}/>
								<span class={this.state.usernameFBClass}>{this.state.usernameFB}</span>
							</div>
							<div class={style.input}>
								<TextField autocomplete='off' outlined label='E-Mail' value={this.state.email} class={style.fullWidth} onInput={e =>{
									document.addEventListener('keyup', this.handleKey)
									this.setState({ email : e.target.value });
									let val = e.target.value
									if (val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
										this.setState({ emailFBClass : style.feedbackSucc });
										this.setState({ emailFB : ''})
									}
									else {
										this.setState({ emailFBClass : style.feedbackErr });
										this.setState({ emailFB : 'keine E-Mail'})
									}
								}}/>
								<span class={this.state.emailFBClass}>{this.state.emailFB}</span>
							</div>
						</div>
						<div class={style.row}>
							<div class={style.input}>
								<TextField autocomplete='off' type='password' outlined label='Passwort' class={style.fullWidth} value={this.state.password} onKeyUp={e => {
									document.addEventListener('keyup', this.handleKey)
									this.setState({ password : e.target.value })
									let val = e.target.value;
									if (val.length < 4) {
										this.setState({ passwordFBClass : style.feedbackErr });
										this.setState({ passwordFB : 'Mindetsens 4 Zeichen'})
									}
									if (val.length > 16) {
										this.setState({ passwordFBClass : style.feedbackErr });
										this.setState({ passwordFB : 'Maximal 16 Zeichen'})
									}
									if (val.length > 3 && val.length < 17) {
										this.setState({ passwordFBClass : style.feedbackSucc });
										this.setState({ passwordFB : ''})
									}
									if (this.state.password == this.state.password2) {
										this.setState({ passwordSameFBClass : style.feedbackSucc })
										this.setState({ passwordSameFB : ''})
									}
									else {
										this.setState({ passwordSameFBClass : style.feedbackErr })
										this.setState({ passwordSameFB : 'Passwörter stimmen nicht überein'})
									}
								}}/>
								<span class={this.state.passwordFBClass}>{this.state.passwordFB}</span>
							</div>
							<div class={style.input}>
								<TextField autocomplete='off' type='password' outlined label='Passwort' class={style.fullWidth} value={this.state.password2} onKeyUp={e => {
									document.addEventListener('keyup', this.handleKey)
									this.setState({ password2 : e.target.value })
									let val = e.target.value;
									if (val.length < 4) {
										this.setState({ password2FBClass : style.feedbackErr });
										this.setState({ password2FB : 'Mindetsens 4 Zeichen'})
									}
									if (val.length > 16) {
										this.setState({ password2FBClass : style.feedbackErr });
										this.setState({ password2FB : 'Maximal 16 Zeichen'})
									}
									if (val.length > 3 && val.length < 17) {
										this.setState({ password2FBClass : style.feedbackSucc });
										this.setState({ password2FB : ''})
									}
									if (this.state.password == this.state.password2) {
										this.setState({ passwordSameFBClass : style.feedbackSucc })
										this.setState({ passwordSameFB : ''})
									}
									else {
										this.setState({ passwordSameFBClass : style.feedbackErr })
										this.setState({ passwordSameFB : 'Passwörter stimmen nicht überein'})
									}
								}}/>
								<span class={this.state.password2FBClass}>{this.state.password2FB}</span>
							</div>
						</div>
						<div class={style.pwVal}>
							<span class={this.state.passwordSameFBClass}>{this.state.passwordSameFB}</span>
						</div>
						<div class={style.switchContainer}>
							<label for='adminSwitch'>Admin</label>
							<Switch id='adminSwitch' onChange={() => {
								document.addEventListener('keyup', this.handleKey)
								let checked = document.getElementById('adminSwitch').checked
								this.setState({ admin : checked})
							}}/>
						</div>
					</div>
				</Dialog.Body>
				<Dialog.Footer class={style.footer}>
					<Dialog.FooterButton cancel={true}>Abbrechen</Dialog.FooterButton>
					<Dialog.FooterButton style={{color : 'white'}} class="mdc-button mdc-theme--primary-bg" raised accept={true}>Speichern</Dialog.FooterButton>
				</Dialog.Footer>
			</Dialog>
		)
	}
}