import Auth from "../state";

// API Request to delete an Account
export function deleteAccount() {
  let url = Auth.url + "/api/user/" + Auth.getUser().id;
  let xhttp = new XMLHttpRequest();

  xhttp.open("DELETE", url);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("authorization", Auth.getUser().token);

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      Auth.logout();
    } else {
      try {
        let response = JSON.parse(this.responseText);
        if (response.msg === "Token is invalid") {
          Auth.logout();
        }
      } catch (err) {}
    }
  };

  xhttp.send();
}

export function getRegistrationCode() {
  let url = Auth.url + "/api/configurations";
  let xhttp = new XMLHttpRequest();

  xhttp.open("GET", url);
  xhttp.setRequestHeader("Accept", 'application/json"');
  xhttp.setRequestHeader("authorization", Auth.getUser().token);

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          let response = JSON.parse(this.responseText);
          Auth.setRegisCode(response.config.registration_code);
        } catch (err) {}
      }
    }
  };

  xhttp.send();
}
