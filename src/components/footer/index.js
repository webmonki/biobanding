import { h, Component } from "preact";
import style from "./style";
import Auth from "../state";

export default class Footer extends Component {
  render() {
    return (
      <div class={style.footer}>
        <div class={style.footerLogoContainer}>
          <span class={style.impressum}>powered by</span>
          <img class={style.vpsLogo} src="../../assets/Frame 1.svg" />
        </div>
        <div class={style.impressumContainer}>
          <a class={style.impressum} href={Auth.impressumLink} target="_blank">
            Impressum
          </a>
          <a class={style.impressum} href={Auth.DSGVOLink} target="_blank">
            Datenschutz
          </a>
        </div>
      </div>
    );
  }
}
