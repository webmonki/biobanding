import { h, Component } from 'preact';
import style from './style.css'

export default class Head1 extends Component {

	render() {
		return (
            <div className={ style.head1 }>{ this.props.headText }</div>
		);
	}
}
