import {makeStyles} from "@material-ui/core/styles";
import {Button, Container, TextField, Typography, Box} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import React, {useState} from "react";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";


const useStyles = makeStyles((theme) => ({
    form: {
        '& > *': {
            padding: theme.spacing(1),
        },
    }
}));

export default function Signup(props) {
    const classes = useStyles();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState("");

    if (submit) {
        if (password === passwordConfirm) {
            const customer = {
                email: email,
                username: username,
                password: password
            }
            axios.post('/customer/register', customer)
                .then((res) => {
                    // Sign in if successfully registered
                    const params = new URLSearchParams();
                    params.append('username', username);
                    params.append('password', password);

                    axios.post('/customer/login', params)
                        .then((res) => {
                            console.log(res);
                            props.history.push("/profile");
                        })
                        .catch((error) => {
                            console.log(error.response);
                            props.history.push("/signin");
                        });
                })
                .catch((err) => {
                    console.log(err.response)
                    setError(err.response.data.description)
                })
        } else {
            setError("Passwords don't match, please retry.");
        }

        setSubmit(false);
    }

    return (
        <Container maxWidth={"sm"}>
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
                />
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
                <TextField
                    label="Repeat password"
                    variant="outlined"
                    fullWidth
                    className="form-input"
                    type="password"
                    name="password"
                    value={passwordConfirm}
                    onChange={(e) => { setPasswordConfirm(e.target.value)} }
                />
                <Box textAlign='center'>
                    <Button
                        variant="contained"
                        color="primary"
                        className="form-input"
                        size="large"
                        onClick={() => {setSubmit(true)} }
                    >
                        Register
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

    );
}

function Alert(props) {
    return <MuiAlert elevation={5} variant="filled" {...props} />;
}