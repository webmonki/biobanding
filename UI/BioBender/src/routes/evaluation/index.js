import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head2 from '../../components/head/head2.js';
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js';
import List from 'preact-material-components/List';
import createTable from '../../components/table/table';
import resizeWithMouse from '../../components/resizeMouse';
import resizeWithTouch from '../../components/resizeTouch';

export default class Evaluation extends Component{


	
	componentWillMount = () => {
		this.getData();
		this.setState({ details : [] });
	}

	getData = () => {
		let that = this;
		let url = Auth.url + '/api/users/details';
		let xhttp = new XMLHttpRequest();

		xhttp.open('GET', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization',  Auth.getUser().token);

		xhttp.onreadystatechange = function() {


			if([0,1,2,3,4].includes(this.readyState)) {

				if (this.status === 200) {
					try {
						let response = JSON.parse(this.responseText);
						sessionStorage.setItem('details', JSON.stringify(response['userdetails']));
						that.setState({ details : response['userdetails'] });
					}
					catch(err) {}

					that.showTable();
				}
				else {
					try {
						let response = JSON.parse(this.responseText);

						if (response.msg == 'Token is invalid'){
							Auth.logout();
						}
					}
					catch(err) {}

				}
			}
		}
		xhttp.send();
	}

	
	showTable = () => {;
			
		if (this.state.details.length == 0) {
			var data = JSON.parse(sessionStorage.details);
		}
		else {
			var data = this.state.details
		}	

		let content = (
			<div class={style.tableContainer}>
				{createTable(data, false)}
			</div>
		);
		this.setState({ content });
	};

	startResizeWithMouseEvent = () => {
		resizeWithMouse('evalContainer', 'evalResizeBtn')
	};

	startResizeWithTouchEvent = () =>  {
		resizeWithTouch('evalContainer', 'evalResizeBtn');
	};

	render() {
		return (
				<Card class={style.card}>
						{this.state.content}
						<div class={style.resizeUI} id='evalResizeBtn' onMouseDown={this.startResizeWithMouseEvent} onTouchStart={this.startResizeWithTouchEvent}>
							<List.ItemGraphic class={style.resizeIcon}>unfold_more</List.ItemGraphic>
						</div>
				</Card>
		);
	}
}