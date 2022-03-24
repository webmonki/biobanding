import { h, Component } from 'preact';
import style from './style.css';


// window.addEventListener('click', (e) => {
// 	if (document.getElementById('measureIdDropdown').contains(e.target)) {
// 		console.warn("CLICKED INSIDE")
// 	} else {
// 		console.warn("CLICKED OUTSIDE")
// 	}
// })


export default class Dropdown extends Component {

	state = ({ contentClass: undefined });
	state = ({ placeholderClass : undefined });

	componentWillMount = () => {
		this.setState({ contentClass : style.contentInactive });
		this.setState({ placeholderClass : style.placeholderInactive });
	}

	onClickOutsideListener = () => {
		this.setState({ contentClass : style.contentInactive });
		this.setState({ placeholderClass : style.placeholderInactive });
		document.removeEventListener('click', this.onClickOutsideListener)
	}

	handleClick = () => {
		if (this.state.contentClass == style.contentInactive) {
			this.setState({ contentClass : style.contentActive });
		}
		else if (this.state.contentClass == style.contentActive) {
			this.setState({ contentClass : style.contentInactive });
		}

		if (this.state.placeholderClass == style.placeholderInactive) {
			this.setState({ placeholderClass : style.placeholderActive });
		}
		else if (this.state.placeholderClass == style.placeholderActive) {
			this.setState({ placeholderClass : style.placeholderInactive });
		} 
	}

	

	render() {
		return (
			<div class={style.dropdown} onMouseLeave={() => {document.addEventListener('click', this.onClickOutsideListener)}}>
				<div class={this.state.placeholderClass} onClick={this.handleClick}>{this.props.selected}</div>
				<div id={this.props.ddId} class={this.state.contentClass} onClick={this.handleClick}>
					{this.props.data.map((id) =>
						<div
							class={style.data}
							value={id}
							onClick={() => this.props.dropdownClick(id)}>
								{id}
						</div>
					)}
				</div>
			</div>
		);
	}


}