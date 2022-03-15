import { h, Component } from 'preact';
import style from './style.css'

export default class Input extends Component {

    state = { fieldClass: undefined }
    state = { labelClass: undefined }
    state = { inputClass: undefined }
    state = { value: "" }
    state = { feedback: "" }
    state = { feddbackClass: undefined }

    componentWillMount = () => {
        this.setState({ labelClass: style.label })
        this.setState({ inputClass: style.input })
        this.setState({ fieldClass: style.floatLabelField})

    }


    focus = () => {
        this.setState({ labelClass: style.labelFocus })
        this.setState({ inputClass: style.inputFocus })
    }

    blur = () => {
        this.setState({ fieldClass: style.floatLabelField})
        this.setState({ labelClass: style.label })
        this.setState({ inputClass: style.input })
        this.setState({ value: document.getElementById(this.props.inputId).value })

        if (this.state.value != "") {
            this.setState({ labelClass: style.labelFocusFilled})
        }
    }

    onChange = () => {
        this.setState({ value: document.getElementById(this.props.inputId).value })
        this.props.onChange()

        let val = document.getElementById(this.props.inputId).value
        switch (this.props.type) {
            case "email":
                if (val.match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )){
                    this.setState({ feedback: "Email OK"})
                    this.setState({ feedbackClass: style.feedbackSucc})
                } else {
                    this.setState({ feedback: "Not an Email"})
                    this.setState({ feedbackClass: style.feedbackErr })
                }
                if (val.length == 0) {
                    this.setState({ feedback: "" })
                }
                break;
            case "password":
                if (val.length > 3 && val.length < 17) {
                    this.setState({ feedback: "Password OK"})
                    this.setState({ feedbackClass: style.feedbackSucc })
                } else if (val.length < 4) {
                    this.setState({ feedback: "Password too short. Min 4 Characters"})
                    this.setState({ feedbackClass: style.feedbackErr })
                } else if (val.length > 16) {
                    this.setState({ feedback: "Password too long. Max 16 Characters"})
                    this.setState({ feedbackClass: style.feedbackErr })
                }
                if (val.length == 0) {
                    this.setState({ feedback: "" })
                }
                break;
            case "username":
                if (val.length < 2) {
                    this.setState({ feedback: "Username too short. Min 2 Characters"})
                    this.setState({ feedbackClass: style.feedbackErr})
                } else if (val.length > 32) {
                    this.setState({ feedback: "Username too long. Max 32 Characters"})
                    this.setState({ feedbackClass: style.feedbackErr })
                } else {
                    this.setState({ feedback: "Username OK" })
                    this.setState({ feedbackClass: style.feedbackSucc })
                }
                if (val.length == 0) {
                    this.setState({ feedback: "" })
                }
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <fieldset className={ this.state.fieldClass }>
                <label for={this.props.inputId} className={ this.state.labelClass }>{ this.props.inputLabel } </label>
                <input 
                    id={this.props.inputId}
                    type={ this.props.type }
                    onfocus={ this.focus }
                    onBlur={ this.blur } 
                    className={ this.state.inputClass }
                    onInput={ this.onChange }
                    value={ this.state.value }></input>
                    <div className={ this.state.feedbackClass }>{ this.state.feedback }</div>
            </fieldset>
        )
    }


}