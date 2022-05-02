## How-to
The application consists a REST-API (Flask) and a Preact-Client. 
Both can be started locally for development or initialized directly via Docker-Compose.


## ✨ Quick Start in `Docker`

> Get the code

```bash
$ git clone git@bitbucket.org:vpsysteme/webapp.git
$ cd webapp
```

> Start the app in Docker

```bash
$ docker-compose up --build  
```

The Client server will start using the PORT `8080`.



## ✨ Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Modules](#modules)
4. [Testing](#testing)

<br />

## ✨ How to use the code

> **Step #1** - Clone the project

```bash
$ git clone git@bitbucket.org:vpsysteme/webapp.git
$ cd webapp
```

<br />

> **Step #2** - create virtual environment using python3 and activate it (keep it outside our project directory)

```bash
$ # Virtualenv modules installation (Unix based systems)
$ virtualenv env
$ source env/bin/activate
$
$ # Virtualenv modules installation (Windows based systems)
$ # virtualenv env
$ # .\env\Scripts\activate
```

<br />

> **Step #3** - Install dependencies in virtualenv

```bash
$ pip install -r requirements.txt
```

<br />

> **Step #4** - setup `flask` command for our app

```bash
$ export FLASK_APP=run.py
$ export FLASK_ENV=development
$ export PREACT_APP_HOST_URI=http://127.0.0.1:5000
```

 For **Windows-based** systems

```powershell
$ (Windows CMD) set FLASK_APP=run.py
$ (Windows CMD) set FLASK_ENV=development
$
$ (Powershell) $env:FLASK_APP = ".\run.py"
$ (Powershell) $env:FLASK_ENV = "development"
```

<br />

> **Step #5** - start test APIs server at `localhost:5000`

```bash
$ flask run
```

Use the API via `POSTMAN` or Swagger Dashboard.

![Flask API Server - Swagger Dashboard.](https://user-images.githubusercontent.com/51070104/141950891-ea315fca-24c2-4929-841c-38fb950a478d.png) 

<br />

> **Step #6** - start test client `localhost:8080`
```bash
$ yarn install
$ yarn dev
```
If above commands return `ERROR: [Errno 2] No such file or directory: 'install'` or `ERROR: [Errno 2] No such file or directory: 'dev'` try:
```bash
$ npm install
$ npm run dev
```

## ✨ Azure Deployment
> **Step #1** - Clone the project





## ✨ Project Structure

```bash
api-server-flask/
├── api
│   ├── config.py
│   ├── __init__.py
│   ├── models.py
│   └── routes.py
│   ├── config.py
├── nginx
│   ├── config.py
├── src
│   ├── assets
│   ├── components
│   ├── logo
│   ├── routes
│   ├── style
├── README.md
├── requirements.txt
├── run.py
└── tests.py
├── Dockerfile.api
├── Dockerfile.client
├── docker-compose-yml
└── package.json
```

<br />

## ✨ API

> **Register** - `api/users/register` (**POST** request)

```
POST api/users/register
Content-Type: application/json

{
    "username":"test",
    "password":"pass", 
    "email":"test@example.org"
}
```

<br />

> **Login** - `api/users/login` (**POST** request)

```
POST /api/users/login
Content-Type: application/json

{
    "password":"pass", 
    "email":"test@example.org"
}
```

<br />

> **Logout** - `api/users/logout` (**POST** request)

```
POST api/users/logout
Content-Type: application/json
authorization: JWT_TOKEN (returned by Login request)

{
    "token":"JWT_TOKEN"
}
```

<br />

## ✨ Testing

Run tests using `pytest tests.py`

<br />

---
VP-Systeme GmbH | Lyrenstr 13 | 44866 Bochum