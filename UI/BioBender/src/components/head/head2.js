import { h, Component } from 'preact';
import style from './style.css';

export default class Head2 extends Component {

	render() {
		return (
			<div className={style.head2}>{ this.props.headText }</div>
		);
	}
}