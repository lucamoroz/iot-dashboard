import {makeStyles} from "@material-ui/core/styles";
import {Button, Container, TextField, Typography, Box} from "@material-ui/core";
import React, {useState} from "react";
import axios from "axios";
import SnackbarAlert from "../components/SnackbarAlert";


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
        if (password !== passwordConfirm) {
            setError("Passwords don't match, please retry.");
        } else if (!password || !username || !email) {
            setError("Please fill the form.")
        } else {
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
                    console.log(err.response);
                    const errorMsg = err.response ? err.response.data.description : "No response from backend";
                    setError(errorMsg);
                })
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
                <SnackbarAlert
                    open={error !== ""}
                    autoHideDuration={3000}
                    onTimeout={() => setError("")}
                    severity="error"
                    message={error}
                />
            </form>
        </Container>

    );
}