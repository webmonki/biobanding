import { route } from "preact-router";

export default class Auth {
  // URL of API
  static url = process.env.PREACT_APP_HOST_URI;
  static version = process.env.PREACT_APP_VERSION;
  static impressumLink = process.env.PREACT_APP_IMPRESSUM;
  static DSGVOLink = process.env.PREACT_APP_DSGVO;

  // Save User Data in Session Storage
  static createUser = (response) => {
    let user = {
      id: response.user._id,
      name: response.user.username,
      email: response.user.email,
      token: response.token,
      is_admin: response.user.is_admin,
    };
    sessionStorage.clear();
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  static setRegisCode = (code) => {
    sessionStorage.setItem("regisCode", JSON.stringify(code));
  };

  static getRegisCode = () => {
    try {
      let code = JSON.parse(sessionStorage.regisCode);
      return code;
    } catch (err) {}
  };

  // Get User from Session Storage
  static getUser = () => {
    try {
      let user = JSON.parse(sessionStorage.user);
      return user;
    } catch (err) {}
  };

  // Update Token in Storage
  static setToken = (token) => {
    try {
      let user = JSON.parse(sessionStorage.user);
      user.token = token;
      sessionStorage.setItem("user", JSON.stringify(user));
    } catch (err) {}
  };

  // Update Username in Storage
  static setUsername = (userName) => {
    try {
      let user = JSON.parse(sessionStorage.user);
      user.name = userName;
      sessionStorage.setItem("user", JSON.stringify(user));
    } catch (err) {}
  };

  // Update Email in Storage
  static setEmail = (email) => {
    try {
      let user = JSON.parse(sessionStorage.user);
      user.email = email;
      sessionStorage.setItem("user", JSON.stringify(user));
    } catch (err) {}
  };

  // Delete Session Storage and go to Login
  static logout = () => {
    sessionStorage.clear();
    route("/login", true);
  };

  // Check if current User is admin
  static check_admin = () => {
    try {
      let user = JSON.parse(sessionStorage.user);
      return user.is_admin;
    } catch (err) {
      return false;
    }
  };

  // Check if User is set in Session Storage
  static getAuth = () => {
    if (sessionStorage.user !== undefined) {
      return true;
    }
  };
}
