import {Button, Typography} from "@material-ui/core";
import React from "react";

const axios = require('axios').default

class Signin extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.handleClickMe = this.handleClickMe.bind(this);
    }

    handleClickLogin() {
        const params = new URLSearchParams();
        params.append('username', 'username2');
        params.append('password', 'password');

        axios.post('/customer/login', params)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    handleClickLogout() {
        axios.post('/customer/logout')
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    handleClickMe() {
        axios.get('/customer/me')
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }

    render() {
        return (
            <div>
                <Typography>Hey</Typography>
                <Button variant="contained" color="primary" onClick={this.handleClickLogin}>Login</Button>
                <Button variant="contained" color="primary" onClick={this.handleClickLogout}>Logout</Button>
                <Button variant="contained" color="primary" onClick={this.handleClickMe}>Me</Button>
            </div>
        )
    }
}

export default Signin