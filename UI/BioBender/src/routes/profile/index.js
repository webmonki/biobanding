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



export default class Profile extends Component {
    state = ({ userId: "" })
    state = ({ userName: "" })
    state = ({ email: "" })

    componentWillMount = () => {
        this.setState({ userId: Auth.getUser().id })
        this.setState({ userName: Auth.getUser().name })
        this.setState({ email: Auth.getUser().email })
    }

    goToChangeData = () => {
        route("changeData/", true)
    }

    render() {
		return (
			<div class={ style.layout }>
				<Card class={ style.card }>
					<Head2 headText="Profil"/>
					<div class={ style.container }>
                    <div class={ style.data }>Benutzer Id: { this.state.userId }</div>
					<div class={ style.data }>Benutzername: { this.state.userName }</div>
					<div class={ style.data }>E-Mail: {this.state.email }</div>
                    <div class={ style.center }>
                        <Button class={ style.btnEnabled } onClick={ this.goToChangeData }>E-Mail ändern</Button>
                    </div>
					</div>
				</Card>
			</div>
		);
	}

}