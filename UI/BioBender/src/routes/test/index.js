import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';

export default class Test extends Component {
    
	render() {
		return (
			<div class={`${style.home} page`}>
				<h1>TEST PAGE</h1>
			</div>
		);
	}
}
