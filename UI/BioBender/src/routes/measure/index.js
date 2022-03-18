import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import style from './style';
import Head1 from '../../components/head/head1.js'
import Head2 from '../../components/head/head2.js'
import Auth from '../../components/state.js';
import Input from '../../components/input/input.js'
import { Link } from 'preact-router/match'
import { route } from 'preact-router';
import List from 'preact-material-components/List';


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

    state = ({ measureId: "" });
    state = ({ height: "" });
    state = ({ sittingHeight: "" });
    state = ({ bodySpan: "" });
    state = ({ weight: "" });
    state = ({ result: "" });
    state = ({ date: "" });
    state = ({ result: "" });

    state = ({ sendBtnDisabled: true });
    state = ({ sendBtnClass: undefined });

    state = ({ feedback: "" });
    state = ({ feedbackClass: undefined });

    state = ({ currentPage: "" });

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
        


        this.setState({ sendBtnClass: style.sendBtnDisabled });
        this.setState({ sendBtnDisabled: true });

    };

    sendData = () => {
        let that = this;
		let url = "http://127.0.0.1:5000/api/user/" + Auth.getUser().id + "/anthropometric";
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("authorization", Auth.getUser().token);

        xhttp.onreadystatechange = function() {


			if ([0,1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					let response = JSON.parse(this.responseText);
                    console.log(this.responseText)
                    console.log(response.msg);

                    that.setState({ measureId: response.anthropometric_data.id })
                    that.setState({ date: response.anthropometric_data.date_measured })
                    that.setState({ height: response.anthropometric_data.height })
                    that.setState({ sittingHeight: response.anthropometric_data.sitting_height })
                    that.setState({ bodySpan: response.anthropometric_data.body_span })
                    that.setState({ weight: response.anthropometric_data.weight })
                    that.setState({ result: response.anthropometric_data.result })

                    that.setState({ feedbackClass: style.feedbackSucc });
                    that.setState({ feedback: response.msg });
                    that.handleClickNew();
				} else {
					let response = JSON.parse(this.responseText);
                    console.log(response.msg);
                    that.setState({ feedback: response.msg });
                    that.setState({ feedbackClass: style.feedbackErr });
                    that.handleClickNew();
				}
			} else {
				this.setState({ loginResponse: "Ups, something went wrong"});
			}
		}

        var today = new Date();

        var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        let data = `{
            "userID": ${ Auth.getUser().id },
            "date_measured": "${ date }",
            "height": ${ this.state.height },
            "sitting_height": ${ this.state.sittingHeight },
            "body_span": ${ this.state.bodySpan },
            "weight": ${ this.state.weight }
        }`

        xhttp.send(data);
    }

    forward = () => {

    }


    back = () => {

    }


    showTable = () => {

        let content = (
            <div class={ style.viewContainer }>
                <div class={ style.center }>
                    <Button raised class={ style.btnEnabled } onClick={ this.handleClickView }>
                        <div class={ style.btnLabel }>
                            <List.ItemGraphic class={ style.btnIcon }>arrow_back</List.ItemGraphic>
                            <div class={ style.labelText }>Zurück</div>
                        </div>
                    </Button>
                </div>
                <div class={ style.tableContainer }>
                    <table>
                        <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Größe</th>
                            <th>Größe im Sitzen</th>
                            <th>Körperspannweite</th>
                            <th>Gewicht</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        <tr>
                            <td>Gestern</td>
                            <td>180</td>
                            <td>90</td>
                            <td>180</td>
                            <td>90</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )

        this.setState({ content: content})

    }


    handleChangeNew = () => {
        this.setState({ height: document.getElementById("inputHeight").value });
        this.setState({ sittingHeight: document.getElementById("inputSittingHeight").value });
        this.setState({ bodySpan: document.getElementById("inputSpan").value });
        this.setState({ weight: document.getElementById("inputWeight").value });

        if (
            this.state.height != "" && this.state.sittingHeight != "" &&
            this.state.bodySpan != "" && this.state.weight != ""
        ) {
            this.setState({ sendBtnDisabled: false });
            this.setState({ sendBtnClass: style.btnEnabled });
        } else {
            this.setState({ sendBtnDisabled: true });
            this.setState({ sendBtnClass: style.sendBtnDisabled });
        }
        
        this.handleClickNew();

    }


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
            <div class={ style.newContainer }>
                <div class={ this.state.feedbackClass }>{ this.state.feedback }</div>
                <Input inputId="inputHeight" inputLabel="Größe" onChange={ this.handleChangeNew }/>
                <Input inputId="inputSittingHeight" inputLabel="Größe im Sitzen" onChange={ this.handleChangeNew }/>
                <Input inputId="inputSpan" inputLabel="Körperspannweite" onChange={ this.handleChangeNew }/>
                <Input inputId="inputWeight" inputLabel="Gewicht" onChange={ this.handleChangeNew }/>
                <div class={ style.center }>
                    <Button raised class={ this.state.sendBtnClass } onClick={ this.sendData } disabled={ this.state.sendBtnDisabled }>Abschicken</Button>
                </div>
            </div>
        )

        this.setState({ content: content})
    }

    handleClickView = () => {

        this.setState({ navNewClass: style.navNotSelected })
        this.setState({ navViewClass: style.navSelected })
        this.setState({ navEditClass: style.navNotSelected })
        this.setState({ navDeleteClass: style.navNotSelected })


        this.setState({ navIconNewClass: style.navIconNotSelected });
        this.setState({ navIconViewClass: style.navIconSelected });
        this.setState({ navIconEditClass: style.navIconNotSelected });
        this.setState({ navIconDeleteClass: style.navIconNotSelected });

        this.setState({ navTextNewClass: style.navTextNotSelected });
        this.setState({ navTextViewClass: style.navTextSelected });
        this.setState({ navTextEditClass: style.navTextNotSelected });
        this.setState({ navTextDeleteClass: style.navTextNotSelected });

        let content = (
            <div class={ style.viewContainer }>
                <div class={ style.btnRow }>
                    <Button raised class={ style.btnEnabled } onClick={ this.back }>
                        <List.ItemGraphic class={ style.btnIcon }>arrow_back</List.ItemGraphic>
                    </Button>
                    <Button raised class={ style.btnEnabled } onClick={ this.showTable }>
                        <div class={ style.btnLabel }>
                            <List.ItemGraphic class={ style.btnIcon }>list</List.ItemGraphic>
                            <div class={ style.labelText }>Tabelle</div>
                        </div>
                    </Button>
                    <Button raised class={ style.btnEnabled } onClick={ this.forward}>
                        <List.ItemGraphic class={ style.btnIcon }>arrow_forward</List.ItemGraphic>
                    </Button>
                </div>
                <div class={ style.data }>Messung Nr.: { this.state.measureId }</div>
                <div class={ style.data }>Datum: { this.state.date }</div>
                <div class={ style.data }>Größe: { this.state.height }</div>
                <div class={ style.data }>Größe im Sitzen: { this.state.sittingHeight }</div>
                <div class={ style.data }>Körperspannweite: { this.state.bodySpan }</div>
                <div class={ style.data }>Gewicht: { this.state.weight }</div>
            </div>
        )

        this.setState({ content: content })
    }

    
    handleClickEdit = () => {
        this.setState({ navNewClass: style.navNotSelected })
        this.setState({ navViewClass: style.navNotSelected })
        this.setState({ navEditClass: style.navSelected })
        this.setState({ navDeleteClass: style.navNotSelected })


        this.setState({ navIconNewClass: style.navIconNotSelected });
        this.setState({ navIconViewClass: style.navIconNotSelected });
        this.setState({ navIconEditClass: style.navIconSelected });
        this.setState({ navIconDeleteClass: style.navIconNotSelected });

        this.setState({ navTextNewClass: style.navTextNotSelected });
        this.setState({ navTextViewClass: style.navTextNotSelected });
        this.setState({ navTextEditClass: style.navTextSelected });
        this.setState({ navTextDeleteClass: style.navTextNotSelected });
    }


    handleClickDelete = () => {
        this.setState({ navNewClass: style.navNotSelected })
        this.setState({ navViewClass: style.navNotSelected })
        this.setState({ navEditClass: style.navNotSelected })
        this.setState({ navDeleteClass: style.navSelected })


        this.setState({ navIconNewClass: style.navIconNotSelected });
        this.setState({ navIconViewClass: style.navIconNotSelected });
        this.setState({ navIconEditClass: style.navIconNotSelected });
        this.setState({ navIconDeleteClass: style.navIconSelected });

        this.setState({ navTextNewClass: style.navTextNotSelected });
        this.setState({ navTextViewClass: style.navTextNotSelected });
        this.setState({ navTextEditClass: style.navTextNotSelected });
        this.setState({ navTextDeleteClass: style.navTextSelected });
    }


    render() {
		return (
			<div class={ style.layout }>
				<Card class={ style.card }>
					<Head2 headText="Messung"></Head2>
                    <div class={ style.navRow }>
                        <div class={ this.state.navNewClass } onClick={ this.handleClickNew }>
                            <List.ItemGraphic class={ this.state.navIconNewClass }>add_circle_outline</List.ItemGraphic>
                            <div class={ this.state.navTextNewClass }>Neu</div>
                        </div>
                        <div class={ this.state.navViewClass } onClick={ this.handleClickView }>
                            <List.ItemGraphic class={ this.state.navIconViewClass }>remove_red_eye</List.ItemGraphic>
                            <div class={ this.state.navTextViewClass }>anzeigen</div>
                        </div>
                        <div class={ this.state.navEditClass } onClick={ this.handleClickEdit }>
                            <List.ItemGraphic class={ this.state.navIconEditClass }>edit</List.ItemGraphic>
                            <div class={ this.state.navTextEditClass }>bearbeiten</div>
                        </div>
                        <div class={ this.state.navDeleteClass } onClick={ this.handleClickDelete }>
                            <List.ItemGraphic class={ this.state.navIconDeleteClass }>delete</List.ItemGraphic>
                            <div class={ this.state.navTextDeleteClass }>löschen</div>
                        </div>
                    </div>
                    <div class={ style.content }>
                        { this.state.content }
                    </div>
				</Card>
			</div>
		);
	}
}