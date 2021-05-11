import {Button, Container, TextField, Typography, Box} from "@material-ui/core";
import React, {useContext, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import SnackbarAlert from "../components/SnackbarAlert";

import CustomerContext from "../CustomerContext";

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: 'center'
    },
    form: {
        '& > *': {
            padding: theme.spacing(1),
        },
    }
}));

export default function Signin(props) {
    const classes = useStyles();
    const customerContext = useContext(CustomerContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (customerContext.isLoggedIn) {
        props.history.push('/dashboard/profile');
    }

    function submit() {
        if (!username || !password) {
            setError("Please fill the form");
        } else {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            axios.post('/customer/login', params)
                .then((res) => {
                    axios.get('customer/me')
                        .then((res) => {
                            // Update customer context (use get /me)
                            customerContext.setCustomer(res.data);
                            customerContext.setIsLoggedIn(true);
                        })
                        .catch((err) => {
                            const errorMsg = err.response ? "Error retrieving customer after logging in" : "No response from backend";
                            setError(errorMsg);
                            customerContext.setIsLoggedIn(false);
                        })

                })
                .catch((err) => {
                    console.log(error.response);
                    const errorMsg = err.response ? err.response.data.description : "No response from backend";
                    setError(errorMsg);
                });
        }
    }

    return (
        <Container maxWidth={"sm"}>
            <form className={classes.form}>
                <Typography variant="h5">Login</Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    name="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <Box textAlign='center'>
                    <Button
                        variant="contained"
                        color="primary"
                        className="form-input"
                        size="large"
                        onClick={submit}
                    >
                        Login
                    </Button>
                </Box>
                <SnackbarAlert
                    open={error !== ""}
                    autoHideDuration={3000}
                    onTimeout={() => setError("")}
                    severity="error"
                    message={error}
                />
            </form>
        </Container>
    )
}