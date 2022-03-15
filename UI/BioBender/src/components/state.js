class User {
    constructor(id, name, email, token) {
        this.id = id;
        this.name = name;
        this.emai = email;
        this.token = token
    }

    setId = (val) => {
        this.id = val;
    }

    getId = () => {
        return this.id;
    }

    setName = (val) => {
        this.name = val;
    }

    getName = () => {
        return this.name;
    }

    setEmail = (val) => {
        this.emai = val;
    }

    getEmail = () => {
        return this.emai;
    }

    setToken = (val) => {
        this.token = val;
    }

    getToken = () => {
        return this.token;
    }
}

export default class Auth {
    static user;

    static createUser = (response) => {
        // console.log(response.token)
        this.user = new User(response.user._id, response.user.username, response.user.email, response.token);
    }

    static getAuth = () => {
        if (this.user != undefined) {
            return true;
        } else {
            return false;
        }
    }

    static getUser = () => {
        return this.user;
    }

    static setUser = (val) => {
        this.user = val;
    }
}

