import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head2 from '../../components/head/head2.js';
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js';
import List from 'preact-material-components/List';
import Dropdown from '../../components/dropdown/dropdown';

export default class Measure extends Component{
    
    state = ({ content: undefined });

    state = ({ navNewClass: undefined });
    state = ({ navViewClass: undefined });
    state = ({ navEditClass: undefined });
    state = ({ navDeleteClass: undefined });
    state = ({ navIconNewClass: undefined });
    state = ({ navIconViewClass: undefined });
    state = ({ navIconEditClass: undefined });
    state = ({ navIconDeleteClass: undefined });
    state = ({ navTextNewClass: undefined });
    state = ({ navTextViewClass: undefined });
    state = ({ navTextEditClass: undefined });
    state = ({ navtextDeleteClass: undefined });

    state = ({ measureId: '' });
    state = ({ height: '' });
    state = ({ sittingHeight: '' });
    state = ({ bodySpan: '' });
    state = ({ weight: '' });
    state = ({ result: '' });
    state = ({ date: '' });
    state = ({ result: '' });

    state = ({ sendBtnDisabled: undefined });
    state = ({ sendBtnClass: undefined });

	state = ({ backBtnClass : undefined });
	state = ({ backBtnDisabled : undefined });
	state = ({ forwardBtnClass : undefined });
	state = ({ forwardBtnDisabled : undefined })

	state = ({ backIconClass : undefined });
	state = ({ forwardIconClass : undefined });

    state = ({ feedback: '' });
    state = ({ feedbackClass: undefined });

    state = ({ currentPage : undefined });
	state = ({ measurements : undefined });

	state = ({ currentDelete : undefined });

	state = ({ currentIds : undefined });

	state = ({ deleteBtnClass: undefined });
	state = ({ deleteBtnDisabled : undefined });


		componentWillMount = () => {
			this.setState({ navNewClass: style.navNotSelected });
			this.setState({ navViewClass: style.navNotSelected });
			this.setState({ navEditClass: style.navNotSelected });
			this.setState({ navDeleteClass: style.navNotSelected });
	
			this.setState({ navIconNewClass: style.navIconNotSelected });
			this.setState({ navIconViewClass: style.navIconNotSelected });
			this.setState({ navIconEditClass: style.navIconNotSelected });
			this.setState({ navIconDeleteClass: style.navIconNotSelected });
	
			this.setState({ navTextNewClass: style.navTextNotSelected });
			this.setState({ navTextViewClass: style.navTextNotSelected });
			this.setState({ navTextEditClass: style.navTextNotSelected });
			this.setState({ navTextDeleteClass: style.navTextNotSelected });
	
			this.setState({ sendBtnClass: style.btnDisabled });
			this.setState({ sendBtnDisabled: true });

			this.setState({ backBtnClass: style.btnDisabled });
			this.setState({ backBtnDisabled: true });

			this.setState({ forwardBtnClass : style.btnDisabled });
			this.setState({ forwardBtnDisabled : true });

			this.setState({ backIconClass : style.btnIconDisabled });
			this.setState({ forwardIconClass : style.btnIconDisabled });

			this.setState({ currentPage : undefined });
			this.setState({ measurements : [] });

			this.setState({ currentDelete : '' });

			this.setState({ currentIds : [] });

			this.getData();
		};

		// Request to get anthropometric data
		getData = () => {
			let that = this;
			let url = Auth.url + '/api/user/' + Auth.getUser().id + '/anthropometric';
			let xhttp = new XMLHttpRequest();

			xhttp.open('GET', url);
			xhttp.setRequestHeader('Accept', 'application/json');
			xhttp.setRequestHeader('authorization',  Auth.getUser().token);

			xhttp.onreadystatechange = function() {


				if([0,1,2,3,4].includes(this.readyState)) {

					if (this.status === 200) {
						try {
							let response = JSON.parse(this.responseText);
							sessionStorage.setItem('measurements', JSON.stringify(response['measurements:']));
							that.setState({ measurements : response['measurements:'] });
							that.setState({ feedback: response.msg });
						}
						catch(err) {}

						let idList = [];
						that.state.measurements.forEach(measurement => {
							idList.push(measurement.id)
						});
						that.setState({ currentIds : idList });
						that.setState({ feedbackClass: style.feedbackSucc });

					}
					else {
						try {
							let response = JSON.parse(this.responseText);
							that.setState({ feedback: response.msg });
							that.setState({ feedbackClass: style.feedbackErr });
						}
						catch(err) {}

					}
				}
				else {
					this.setState({ loginResponse: 'Ups, something went wrong' });
				}
			}

			xhttp.send();

		}

		// Request to post anthropometric data
		sendData = () => {

			let that = this;
			let url = Auth.url + '/api/user/' + Auth.getUser().id + '/anthropometric';
			let xhttp = new XMLHttpRequest();
	
			xhttp.open('POST', url);
			xhttp.setRequestHeader('Accept', 'application/json');
			xhttp.setRequestHeader('Content-Type', 'application/json');
			xhttp.setRequestHeader('authorization', Auth.getUser().token);
	
			xhttp.onreadystatechange = function() {
	
	
				if ([0,1,2,3,4].includes(this.readyState)) {
						
					if (this.status === 200) {

						try{
							let response = JSON.parse(this.responseText);
							that.setState({ feedback: response.msg });
						}
						catch(err) {}

						that.setState({ feedbackClass: style.feedbackSucc });
						that.setState({ currentPage : undefined });
						that.getData();
						that.handleClickNew();


					}
					else {
						try {
							let response = JSON.parse(this.responseText);
							that.setState({ feedback: response.msg });
						}
						catch(err) {}

						that.setState({ feedbackClass: style.feedbackErr });
						that.handleClickNew();
					}
				}
				else {
					this.setState({ loginResponse: 'Ups, something went wrong' });
				}
			};

			let today = new Date();

			let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

			let data = `{
				"userID": ${ Auth.getUser().id },
				"date_measured": "${ date }",
				"height": ${ this.state.height },
				"sitting_height": ${ this.state.sittingHeight },
				"body_span": ${ this.state.bodySpan },
				"weight": ${ this.state.weight }
			}`;

			xhttp.send(data);

		}

	// Chceck Input and Enable Button
	handleChangeNew = () => {
		this.setState({ height: document.getElementById('inputHeight').value });
		this.setState({ sittingHeight: document.getElementById('inputSittingHeight').value });
		this.setState({ bodySpan: document.getElementById('inputSpan').value });
		this.setState({ weight: document.getElementById('inputWeight').value });

		if (
			this.state.height !== '' && this.state.sittingHeight !== '' &&
			this.state.bodySpan !== '' && this.state.weight !== ''
		) {
			this.setState({ sendBtnDisabled: false });
			this.setState({ sendBtnClass: style.btnEnabled });
		}
		else {
			this.setState({ sendBtnDisabled: true });
			this.setState({ sendBtnClass: style.btnDisabled });
		}
		
		this.handleClickNew();
	}
	

	// Highlight "Neu"-Tab and set content
	handleClickNew = () => {

		this.setState({ navNewClass: style.navSelected });
		this.setState({ navViewClass: style.navNotSelected });
		this.setState({ navEditClass: style.navNotSelected });
		this.setState({ navDeleteClass: style.navNotSelected });

		this.setState({ navIconNewClass: style.navIconSelected });
		this.setState({ navIconViewClass: style.navIconNotSelected });
		this.setState({ navIconEditClass: style.navIconNotSelected });
		this.setState({ navIconDeleteClass: style.navIconNotSelected });

		this.setState({ navTextNewClass: style.navTextSelected });
		this.setState({ navTextViewClass: style.navTextNotSelected });
		this.setState({ navTextEditClass: style.navTextNotSelected });
		this.setState({ navTextDeleteClass: style.navTextNotSelected });


		let content = (
			<div class={style.newContainer}>
				<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				<Input inputId="inputHeight" inputLabel="Größe" onChange={this.handleChangeNew}/>
				<Input inputId="inputSittingHeight" inputLabel="Größe im Sitzen" onChange={this.handleChangeNew} />
				<Input inputId="inputSpan" inputLabel="Körperspannweite" onChange={this.handleChangeNew} />
				<Input inputId="inputWeight" inputLabel="Gewicht" onChange={this.handleChangeNew} />
				<div class={style.center}>
					<Button raised class={this.state.sendBtnClass} onClick={this.sendData} disabled={this.state.sendBtnDisabled}>Abschicken</Button>
				</div>
			</div>
		);

		this.setState({ content });
	};

	enableDeleteTab = () => {
		this.setState({ navNewClass: style.navNotSelected });
		this.setState({ navViewClass: style.navNotSelected });
		this.setState({ navEditClass: style.navNotSelected });
		this.setState({ navDeleteClass: style.navSelected });


		this.setState({ navIconNewClass: style.navIconNotSelected });
		this.setState({ navIconViewClass: style.navIconNotSelected });
		this.setState({ navIconEditClass: style.navIconNotSelected });
		this.setState({ navIconDeleteClass: style.navIconSelected });

		this.setState({ navTextNewClass: style.navTextNotSelected });
		this.setState({ navTextViewClass: style.navTextNotSelected });
		this.setState({ navTextEditClass: style.navTextNotSelected });
		this.setState({ navTextDeleteClass: style.navTextSelected });
	}

	// Request to delete anthropometric data
	delete = () => {

		this.setState({ currentIds : this.state.currentIds.filter(e => e !== this.state.currentDelete )});

		let that = this;
		let url = Auth.url + '/api/measurement/' + this.state.currentDelete;
		let xhttp = new XMLHttpRequest();

		xhttp.open('DELETE', url);
		xhttp.setRequestHeader('Accept', 'application/json');
		xhttp.setRequestHeader('authorization', Auth.getUser().token);

		xhttp.onreadystatechange = function() {

			if ([0,1,2,3,4].includes(this.readyState)) {
					
				if (this.status === 200) {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackSucc });


					that.setState({ currentDelete : '' });
					that.setState({ currentPage : undefined });
					that.getData();
					that.handleClickDelete();


				}
				else {

					try{
						let response = JSON.parse(this.responseText);
						that.setState({ feedback: response.msg });
					}
					catch(err) {}

					that.setState({ feedbackClass: style.feedbackErr });
					that.handleClickDelete();
				}
			}
			else {
				this.setState({ loginResponse: 'Ups, something went wrong' });
			}
		};

		xhttp.send();

	}

	// Get the id to delete from dropdown
	handleDeleteDropDownClick = (id) => {
		this.setState({ currentDelete : id });
		this.handleClickDelete();

	}


	// Highlight "Löschen"-Tab
	handleClickDelete = () => {
		this.enableDeleteTab();

		this.getData();


		if (this.state.currentDelete == '') {
			this.setState({ currentDelete : this.state.currentIds.slice(-1)[0] });
			if (this.state.currentDelete == undefined){
				this.setState({ currentDelete : '' })
			}
		}

		if (this.state.currentIds.length == 0) {
			this.setState({ deleteBtnClass : style.btnDisabled });
			this.setState({ deleteBtnDisabled : true });
		}
		else {
			this.setState({ deleteBtnClass : style.deleteBtn });
			this.setState({ deleteBtnDisabled : false });
		}


		let content = (
			<div class={style.deleteContainer}>
				<div class={style.centerFB}>
					<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				</div>
				<div class={style.deleteData}>
					<Dropdown
						class={style.deleteDropDown}
						ddId={'deleteIdDropdown'}
						data={this.state.currentIds}
						dropdownClick={this.handleDeleteDropDownClick}
						selected={this.state.currentDelete}
						/>
				</div>
				<div class={style.deleteData}>
					<Button raised class={this.state.deleteBtnClass} disabled={this.state.deleteBtnDisabled} onClick={this.delete}>
						Nummer: {this.state.currentDelete} löschen
					</Button>
				</div>
			</div>
		)

		this.setState({ content });
	};

	handleTableClick = (row) => {
		this.setState({ currentPage : row.id - 1 });
		this.handleClickView();
	}


	// Return Table with anthropometric data
	showTable = () => {;
		
		let cols = ['Messung Nr.', 'Datum', 'Größe', 'Größe sitzend', 'Körper Spannweite', 'Gewicht', 'Ergebnis']

		let tableHeader = (
				<tr>
					{cols.map((name) => <th>{name}</th>)}
				</tr>
		)

		let data = JSON.parse(sessionStorage.measurements);

		let tableBody = (
			<tbody>
				{data.map((row) => 
					<tr onClick={() => this.handleTableClick(row)}>
						<td>{row.id}</td>
						<td>{row.date_measured}</td>
						<td>{row.height}</td>
						<td>{row.sitting_height}</td>
						<td>{row.body_span}</td>
						<td>{row.weight}</td>
						<td>{row.result}</td>
					</tr>
				)}
			</tbody>
		)

		let table = (
			<table id="measureTable">
				<thead>
					{tableHeader}
				</thead>
				{tableBody}
			</table>
		)


		let content = (
			<div class={style.viewContainer}>
				<div class={style.center}>
					<Button raised class={style.navBtn} onClick={this.handleClickView}>
						<div class={style.btnLabel}>
							<List.ItemGraphic class={style.btnIcon}>arrow_back</List.ItemGraphic>
							<div class={style.labelText}>Zurück</div>
						</div>
					</Button>
				</div>
				<div class={style.tableContainer}>
					{table}
				</div>
			</div>
		);
		this.setState({ content });
	};


	// Highlight "bearbeiten"-Tab
	handleClickEdit = () => {
		this.setState({ navNewClass: style.navNotSelected });
		this.setState({ navViewClass: style.navNotSelected });
		this.setState({ navEditClass: style.navSelected });
		this.setState({ navDeleteClass: style.navNotSelected });


		this.setState({ navIconNewClass: style.navIconNotSelected });
		this.setState({ navIconViewClass: style.navIconNotSelected });
		this.setState({ navIconEditClass: style.navIconSelected });
		this.setState({ navIconDeleteClass: style.navIconNotSelected });

		this.setState({ navTextNewClass: style.navTextNotSelected });
		this.setState({ navTextViewClass: style.navTextNotSelected });
		this.setState({ navTextEditClass: style.navTextSelected });
		this.setState({ navTextDeleteClass: style.navTextNotSelected });
	};

	back = () => {
		this.setState({ currentPage : this.state.currentPage - 1});
		this.handleClickView();
	}

	forward = () => {
		this.setState({ currentPage : this.state.currentPage + 1});
		this.handleClickView();
	}

	disableBackBtn = () => {
		this.setState({ backBtnClass : style.btnDisabled });
		this.setState({ backBtnDisabled : true });
		this.setState({ backIconClass : style.btnIconDisabled });
	}

	enableBackBtn = () => {
		this.setState({ backBtnClass : style.btnEnabled });
		this.setState({ backBtnDisabled : false });
		this.setState({ backIconClass : style.btnIcon });
	}

	disableForwardBtn = () => {
		this.setState({ forwardBtnClass : style.btnDisabled });
		this.setState({ forwardBtnDisabled : true });
		this.setState({ forwardIconClass : style.btnIconDisabled });
	}

	enableForwardBtn = () => {
		this.setState({ forwardBtnClass : style.btnEnabled });
		this.setState({ forwardBtnDisabled : false });
		this.setState({ forwardIconClass : style.btnIcon });
	}


	enableViewTab = () => {
		this.setState({ navNewClass: style.navNotSelected });
		this.setState({ navViewClass: style.navSelected });
		this.setState({ navEditClass: style.navNotSelected });
		this.setState({ navDeleteClass: style.navNotSelected });


		this.setState({ navIconNewClass: style.navIconNotSelected });
		this.setState({ navIconViewClass: style.navIconSelected });
		this.setState({ navIconEditClass: style.navIconNotSelected });
		this.setState({ navIconDeleteClass: style.navIconNotSelected });

		this.setState({ navTextNewClass: style.navTextNotSelected });
		this.setState({ navTextViewClass: style.navTextSelected });
		this.setState({ navTextEditClass: style.navTextNotSelected });
		this.setState({ navTextDeleteClass: style.navTextNotSelected });
	}

	handleDropDownClick = (id) => {
		this.setState({ currentPage : this.state.currentIds.indexOf(id) })
		this.handleClickView();
	}

	// Highlight "anzeigen"-Tab and set content
	handleClickView = () => {

		this.enableViewTab();

		if (this.state.measurements.length == 0){
			try {
				this.setState({ measurements : JSON.parse(sessionStorage.measurements) });
				that.setState({ feedbackClass: style.feedbackSucc });
				that.setState({ feedback: "Daten erfolgreich geladen." });
			}
			catch(err) {
				this.setState({ feedback: "Keine Daten zum laden." });
				this.setState({ feedbackClass: style.feedbackErr });
				this.setState({ measurements : JSON.parse(sessionStorage.measurements) });
			}
		}


		let measurements = this.state.measurements

		if (this.state.currentPage == undefined && measurements.length > 0) {
			this.setState({ currentPage : measurements.length - 1 })
		}

		this.state.currentPage > 0 ? this.enableBackBtn() : this.disableBackBtn();
		this.state.currentPage < this.state.measurements.length - 1 ? this.enableForwardBtn() : this.disableForwardBtn();


		if (this.state.currentPage != undefined) {
			this.setState({ measureId : measurements[this.state.currentPage].id});
			this.setState({ date : measurements[this.state.currentPage].date_measured });
			this.setState({ height: measurements[this.state.currentPage].height });
			this.setState({ sittingHeight : measurements[this.state.currentPage].sitting_height });
			this.setState({ bodySpan : measurements[this.state.currentPage].body_span });
			this.setState({ weight : measurements[this.state.currentPage].weight });
			this.setState({ result : measurements[this.state.currentPage].result });
		}
		else {
			this.setState({ measureId : ''});
			this.setState({ date : '' });
			this.setState({ height: '' });
			this.setState({ sittingHeight : '' });
			this.setState({ bodySpan : '' });
			this.setState({ weigth : '' });
			this.setState({ result : '' });
		}
		

		let content = (
			<div class={style.viewContainer}>
				<div class={style.centerFB}>
					<div class={this.state.feedbackClass}>{this.state.feedback}</div>
				</div>
				<div class={style.btnRow}>
					<Button raised class={this.state.backBtnClass} disabled={this.state.backBtnDisabled} onClick={this.back}>
						<List.ItemGraphic class={this.state.backIconClass}>arrow_back</List.ItemGraphic>
					</Button>
					<Button raised class={style.navBtn} onClick={this.showTable}>
						<div class={style.btnLabel}>
							<List.ItemGraphic class={style.btnIcon}>list</List.ItemGraphic>
							<div class={style.labelText}>Tabelle</div>
						</div>
					</Button>
					<Button raised class={this.state.forwardBtnClass} disabled={this.state.forwardBtnDisabled} onClick={this.forward}>
						<List.ItemGraphic class={this.state.forwardIconClass}>arrow_forward</List.ItemGraphic>
					</Button>
				</div>
				<div class={style.viewData}>
					<div class={style.data}>
						<div class={style.dataLabel}>Messung Nr.: </div>
						<div class={style.dataContent}>
							<Dropdown
								ddId={'measureIdDropdown'}
								data={this.state.currentIds}
								dropdownClick={this.handleDropDownClick}
								selected={this.state.currentIds[this.state.currentPage]}/>
						</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Datum: </div>
						<div class={style.dataContent}>{this.state.date}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Größe: </div>
						<div class={style.dataContent}>{this.state.height}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Größe im Sitzen: </div>
						<div class={style.dataContent}>{this.state.sittingHeight}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Körperspannweite: </div>
						<div class={style.dataContent}>{this.state.bodySpan}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Gewicht: </div>
						<div class={style.dataContent}>{this.state.weight}</div>
					</div>
					<div class={style.data}>
						<div class={style.dataLabel}>Ergebnis: </div>
						<div class={style.dataContent}>{this.state.result}</div>
					</div>
				</div>
			</div>
		);

		this.setState({ content });
		// this.setDropDown(this.state.currentPage + 1);
	};

	
	render() {
		return (
			<div class={style.layout}>
				<Card class={style.card}>
					<Head2 headText="Messung" />
					<div class={style.navRow}>
						<div class={this.state.navNewClass} onClick={this.handleClickNew}>
							<List.ItemGraphic class={this.state.navIconNewClass}>add_circle_outline</List.ItemGraphic>
							<div class={this.state.navTextNewClass}>Neu</div>
						</div>
						<div class={this.state.navViewClass} onClick={this.handleClickView}>
							<List.ItemGraphic class={this.state.navIconViewClass}>remove_red_eye</List.ItemGraphic>
							<div class={this.state.navTextViewClass}>anzeigen</div>
						</div>
						<div class={this.state.navEditClass} onClick={this.handleClickEdit}>
							<List.ItemGraphic class={this.state.navIconEditClass}>edit</List.ItemGraphic>
							<div class={this.state.navTextEditClass}>bearbeiten</div>
						</div>
						<div class={this.state.navDeleteClass} onClick={this.handleClickDelete}>
							<List.ItemGraphic class={this.state.navIconDeleteClass}>delete</List.ItemGraphic>
							<div class={this.state.navTextDeleteClass}>löschen</div>
						</div>
					</div>
					<div class={style.content}>
						{this.state.content}
					</div>
				</Card>
			</div>
		);
	}
}