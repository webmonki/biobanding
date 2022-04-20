import { h, Component } from 'preact';
import style from './style'
import 'preact-material-components/TextField/style.css';
import Select from 'preact-material-components/Select';
import 'preact-material-components/Select/style.css';
import Dialog from 'preact-material-components/Dialog';
import 'preact-material-components/Dialog/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';


export default class EditUser extends Component {

	render () {
		return (
			<Dialog class={style.dialog} ref={this.props.reference} onAccept={() => {
				this.props.sendData(this.props.username, this.props.email)
			}} onCancel={() => {
				document.removeEventListener('keyup', this.handleKey)
			}}>
				<Dialog.Header>Benutzer bearbeiten</Dialog.Header>
				<Dialog.Body>
					<div class={style.inputContainer}>
						<span class={style.subHeader}>Benutzer Daten</span>
						<div class={style.row}>
							<div class={style.input}>
								<TextField outlined label='Benutzername' class={style.fullWidth} value={this.props.username} onKeyUp={e => {
									// this.setState({ editUsername : e.target.value })
									let val = e.target.value
									this.props.username = val;
									if (val.length < 1) {
										this.setState({ usernameFBClass : style.feedbackErr })
										this.setState({ usernameFB : 'Mindestens 1 Zeichen'})
									}
									if (val.length > 32) {
										this.setState({ usernameFBClass : style.feedbackErr })
										this.setState({ usernameFB : 'Maximal 32 Zeichen'})
									}
									if (val.length > 0 && val.length < 33) {
										this.setState({ usernameFBClass : style.feedbackSucc })
										this.setState({ usernameFB : 'okay' })
									}
								}}/>
								<span class={this.state.usernameFBClass}>{this.state.usernameFB}</span>
							</div>
							<div class={style.input}>
								<TextField outlined label='E-Mail' class={style.fullWidth} value={this.props.email} onInput={e =>{
									// this.setState({ editEmail : e.target.value });
									let val = e.target.value
									this.props.email = val;

									if (val.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
										this.setState({ emailFBClass : style.feedbackSucc });
										this.setState({ emailFB : 'okay'})
									}
									else {
										this.setState({ emailFBClass : style.feedbackErr });
										this.setState({ emailFB : 'keine E-Mail'})
									}
								}}/>
								<span class={this.state.emailFBClass}>{this.state.emailFB}</span>
							</div>
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