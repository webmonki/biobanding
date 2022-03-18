export default class Auth {
    // static user;

    static createUser = (response) => {

        let user = {"id": response.user._id, "name": response.user.username, "email": response.user.email, "token": response.token}
        sessionStorage.clear();
        sessionStorage.setItem("user", JSON.stringify(user));
    }

    static getAuth = () => {
        if (sessionStorage.user != undefined) {
            return true;
        } else {
            return false;
        }
    }


    static getUser = () => {
        let user = JSON.parse(sessionStorage.user)
        return user;
    }


    static logout = () => {
        sessionStorage.clear();
        // console.log(sessionStorage)
    }
}

