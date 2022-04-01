import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head2 from '../../components/head/head2.js';
import Auth from '../../components/state.js';
import { route } from 'preact-router';
import ChangeData from '../changeData';

export default class Profile extends Component {
    state = ({ userId: '' });
    state = ({ userName: '' });
    state = ({ email: '' });


	componentWillMount = () => {
		this.setState({ userId: Auth.getUser().id });
		this.setState({ userName: Auth.getUser().name });
		this.setState({ email: Auth.getUser().email });
	}


	goToChangeData = () => {
		route('/changeData', true);
	}
	

	render() {
		return (
			<div class={style.layout}>
				<img class={style.logo} src='../../logo/StarsLogoTrans.png' />
				<div class={style.container}>
					<div class={style.profileContainer}>
						<Head2 headText="Profil" />
						<Card class={style.card}>
							<div class={style.contentContainer}>
								<div class={style.data}>Benutzer Id: {this.state.userId}</div>
								<div class={style.data}>Benutzername: {this.state.userName}</div>
								<div class={style.data}>E-Mail: {this.state.email}</div>
							</div>
						</Card>
					</div>
					<div class={style.cdContainer}>
						<Head2 headText="E-Mail ändern" />
						<ChangeData />
					</div>
				</div>
			</div>
		);
	}

}