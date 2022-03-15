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

export default class Measure extends Component{
    
    state = ({ newBtnClass: undefined });
    state = ({ viewBtnClass: undefined });
    state = ({ editBtnClass: undefined });
    state = ({ deleteBtnClass: undefined });
    state = ({ content: undefined });

    state = ({ height: "" })
    state = ({ sittingHeight: "" })
    state = ({ bodySpan: "" })
    state = ({ weight: "" })
    state = ({ result: "" })

    state = ({ sendBtnDisabled: true })
    state = ({ sendBtnClass: undefined })

    componentWillMount = () => {
        this.setState({ newBtnClass: style.btnEnabled });
        this.setState({ viewBtnClass: style.btnEnabled });
        this.setState({ editBtnClass: style.btnEnabled });
        this.setState({ deleteBtnClass: style.btnEnabled });

        this.setState({ sendBtnClass: style.btnEnabled });
        this.setState({ sendBtnDisabled: false})

    };

    sendData = () => {
        let that = this
		let url = "http://127.0.0.1:5000/api/user/" + Auth.getUser().getId() + "/anthropometric"
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("authorization", Auth.getUser().getToken())

        xhttp.onreadystatechange = function() {



			if ([1,2,3,4].includes(this.readyState)) {
				
				if (this.status == 200) {
					let response = JSON.parse(this.responseText)
                    console.log(this.responseText)

				} else {
					let response = JSON.parse(this.responseText)
                    console.log(this.responseText)
				}
			} else {
				this.setState({ loginResponse: "Ups, something went wrong"})
			}
		}

        var today = new Date()

        var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();


        let data = `{
            "id": ${ Auth.getUser().getId() },
            "userID": ${ Auth.getUser().getId() },
            "date_measured": "${ this.date }",
            "height": ${ this.state.height },
            "sitting_height": ${ this.state.sittingHeight },
            "body_span": ${ this.state.bodySpan },
            "weight": ${ this.state.weight },
            "result": ${ this.state.result }

        }`

        xhttp.send(data)
    }

    handleChangeNew = () => {
        this.setState({ height: document.getElementById("inputHeight").value })
        this.setState({ sittingHeight: document.getElementById("inputSittingHeight").value })
        this.setState({ bodySpan: document.getElementById("inputSpan").value })
        this.setState({ weight: document.getElementById("inputWeight").value })
        this.setState({ result: document.getElementById("inputResult").value })

        if (
            this.state.height != "" && this.state.sittingHeight != "" &&
            this.state.bodySpan != "" && this.state.weight != "" &&
            this.state.result != ""
        ) {
            console.log("ENABLE")
            this.setState({ sendBtnDisabled: false })
            this.setState({ sendBtnClass: style.btnEnabled})
        } else {
            console.log("DISABLE")
            this.setState({ sendBtnDisabled: true })
            this.setState({ sendBtnClass: style.sendBtnDisabled })
        }


    }


    handleClickNew = () => {
        console.log("DIS: " + this.state.sendBtnDisabled)
        let content = (
            <div>
                <br/>
                <br/>
                <Input inputId="inputHeight" inputLabel="Größe" onChange={ this.handleChangeNew }/>
                <Input inputId="inputSittingHeight" inputLabel="Größe im Sitzen" onChange={ this.handleChangeNew }/>
                <Input inputId="inputSpan" inputLabel="Körperspannweite" onChange={ this.handleChangeNew }/>
                <Input inputId="inputWeight" inputLabel="Gewicht" onChange={ this.handleChangeNew }/>
                <Input inputId="inputResult" inputLabel="Result" onChange={ this.handleChangeNew }/>
                <br/>
                <div class={ style.center }>
                <Button raised class={ this.state.sendBtnClass } onClick={ this.sendData } disabled={ this.state.sendBtnDisabled }>Abschicken</Button>
                </div>
            </div>
        )

        this.setState({ content: content})
    }


    render() {
		return (
			<div class={ style.layout }>
				<Card class={ style.card }>
					<Head2 headText="Messung"></Head2>
                    <div class={ style.container }>
                        <div class={ style.btnRow }>
                            <Button raised class={ this.state.newBtnClass } onClick={ this.handleClickNew }>Neu</Button>
                            <Button raised class={ this.state.viewBtnClass }>Anzeigen</Button>
                            <Button raised class={ this.state.editBtnClass}>bearbeiten</Button>
                            <Button raised class={ this.state.deleteBtnClass}>löschen</Button>
                        </div>
                        <div class={style.content }>
                            { this.state.content }
                        </div>
                    </div>
				</Card>
			</div>
		);
	}
}