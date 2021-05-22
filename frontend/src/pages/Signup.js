import {makeStyles} from "@material-ui/core/styles";
import {Button, Container, TextField, Typography, Box} from "@material-ui/core";
import React, {useContext, useState} from "react";
import axios from "axios";
import SnackbarAlert from "../components/SnackbarAlert";
import CustomerContext from "../CustomerContext";
import {NavLink} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        paddingTop: theme.spacing(4)
    },
    form: {
        '& > *': {
            padding: theme.spacing(1),
        },
    }
}));

export default function Signup(props) {
    const classes = useStyles();
    const customerContext = useContext(CustomerContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState({
        feedback: "",
        username: "",
        email: "",
        password: "",
    });

    if (customerContext.isLoggedIn === undefined) {
        // Waiting to know if customer is logged in
    } else if (customerContext.isLoggedIn) {
        props.history.push('/dashboard');
    }

    function validateForm() {
        let errorFound = false;
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!email) {
            setError(prev => ({ ...prev, email: "Please enter your email"}));
            errorFound = true;
        } else if (!emailRegex.test(String(email).toLowerCase())) {
            setError(prev => ({ ...prev, email: "Please enter a valid email"}));
            errorFound = true;
        } else {
            setError(prev => ({ ...prev, email: ""}));
        }

        if (!username) {
            setError(prev => ({ ...prev, username: "Please enter your username"}));
            errorFound = true;
        } else {
            setError(prev => ({ ...prev, username: ""}));
        }

        if (!password) {
            setError(prev => ({ ...prev, password: "Please enter a password"}));
            errorFound = true;
        } else if (password !== passwordConfirm) {
            setError(prev => ({ ...prev, password: "Passwords don't match"}));
            errorFound = true;
        } else if (password.length < 8) {
            setError(prev => ({ ...prev, password: "Please enter a password with at least 8 characters"}));
            errorFound = true;
        } else {
            setError(prev => ({ ...prev, password: ""}));
        }

        return !errorFound;
    }

    function submit() {
        if (validateForm()) {
            const customer = {
                email: email,
                username: username,
                password: password
            }

            // Register and then try to sign in
            axios.post('/customer/register', customer)
                .then((res) => {
                    customerContext.setCustomer(res.data);

                    const params = new URLSearchParams();
                    params.append('username', username);
                    params.append('password', password);

                    axios.post('/customer/login', params)
                        .then((res) => {
                            console.log(res);
                            customerContext.setIsLoggedIn(true);
                        })
                        .catch((error) => {
                            console.log(error.response);
                            props.history.push("/signin");
                        });
                })
                .catch((err) => {
                    console.log(err.response);
                    const errorMsg = err.response ? err.response.data.description : "No response from backend";
                    setError(prev => ({ ...prev, feedback: errorMsg}));
                });
        }
    }

    return (
        <Container className={classes.root} maxWidth={"sm"}>
            <form className={classes.form}>
                <Typography variant="h5">Register</Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value)} }
                    error={error.email !== ""}
                    helperText={error.email}
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    name="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value)} }
                    error={error.username !== ""}
                    helperText={error.username}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value)} }
                    error={error.password !== ""}
                    helperText={error.password}
                />
                <TextField
                    label="Repeat password"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    type="password"
                    name="password"
                    value={passwordConfirm}
                    onChange={(e) => { setPasswordConfirm(e.target.value)} }
                    error={error.password !== ""}
                    helperText={error.password}
                />
                <Box textAlign='center'>
                    <Button
                        variant="contained"
                        color="primary"
                        className="form-input"
                        size="large"
                        onClick={submit}
                    >
                        Register
                    </Button>
                </Box>
                <SnackbarAlert
                    open={error.feedback !== ""}
                    autoHideDuration={3000}
                    onTimeout={() => setError(prev => ({ ...prev, feedback: ""}))}
                    severity="error"
                    message={error.feedback}
                />
            </form>
            <br/>
            <Typography align="center">
                Already have an account? <NavLink to="/signin">Sign in</NavLink>
            </Typography>
        </Container>

    );
}