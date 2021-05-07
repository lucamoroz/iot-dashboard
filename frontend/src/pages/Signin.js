import {Button, Container, TextField, Typography, Box} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from "@material-ui/core/styles";


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

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [submit, setSubmit] = useState(false);

    // todo read global user var and redirect if already logged in
    useEffect(() => {
        axios.get('/customer/me')
            .then((res) => {
                setIsLoggedIn(true);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }, []);

    if (submit) {
        if (!username || !password) {
            setError("Please fill the form");
        } else {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            axios.post('/customer/login', params)
                .then((res) => {
                    console.log(res);
                    setIsLoggedIn(true);
                })
                .catch((error) => {
                    console.log(error.response);
                    setError(error.response.data.description);
                });
        }

        setSubmit(false);
    }

    if (isLoggedIn) {
        props.history.push("/profile");
    }

    return (
        <Container maxWidth={"sm"}>
            <form  className={classes.form}>
                <Typography variant="h5">Login</Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    name="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value)} }
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
                />
                <Box textAlign='center'>
                    <Button
                        variant="contained"
                        color="primary"
                        className="form-input"
                        size="large"
                        onClick={() => setSubmit(true)}
                    >
                        Login
                    </Button>
                </Box>

                <Snackbar
                    open={error !== ""}
                    autoHideDuration={3000}
                    onClose={(e, r) => r === "timeout" && setError("")}
                >
                    <Alert severity="error" onClick={() => setError("")}>
                        {error}
                    </Alert>
                </Snackbar>
            </form>
        </Container>
    )

}

function Alert(props) {
    return <MuiAlert elevation={5} variant="filled" {...props} />;
}