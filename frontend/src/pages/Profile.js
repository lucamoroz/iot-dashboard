import React, {useEffect, useState} from "react";
import {Button, Container, Typography, Paper, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';
import SnackbarAlert from "../components/SnackbarAlert";

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(2),
            padding: theme.spacing(1)
        },
    }
}));


export default function Profile(props) {
    const classes = useStyles();

    const [customer, setCustomer] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [deleteClicked, setDeleteClicked] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Todo save logged customer globally, and redirect to e.g. profile from higher order component if already logged
        axios.get('/customer/me')
            .then((res) => {
                setCustomer(res.data)
            })
            .catch((err) => {
                console.log(err.response);
                if (err.response) {
                    setIsLoggedIn(false);
                } else {
                    setError("No response from backend");
                }
            });
    }, []);

    if (!isLoggedIn) {
        // Redirect to signin
        props.history.push("/signin");
    }

    if (deleteClicked) {
        axios.delete('/customer/me')
            .then((res) => {
                props.history.push("/");
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data.description : "No response from backend";
                setError(errorMsg);
            });
        setDeleteClicked(false);
    }

    return (
        <Container className={classes.root} maxWidth={"sm"}>
            <Paper elevation={2}>
                <Typography color="textSecondary" align="center">Username: </Typography>
                <Typography variant="body1" align="center">{customer && customer.username}</Typography>
            </Paper>
            <Paper elevation={2}>
                <Typography color="textSecondary" align="center">Email: </Typography>
                <Typography variant="body1" align="center">{customer && customer.email}</Typography>
            </Paper>
            <Paper elevation={2}>
                <Typography color="textSecondary" align="center">Plan: </Typography>
                <Typography variant="body1" align="center">{customer && customer.plan}</Typography>
            </Paper>
            <Paper elevation={2}>
                <Typography color="textSecondary" align="center">Calls count: </Typography>
                <Typography variant="body1" align="center">{customer && customer.callsCount}</Typography>
            </Paper>
            <Box textAlign='center'>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteClicked(true)}
                >
                    Delete
                </Button>
            </Box>
            <SnackbarAlert
                open={error !== ""}
                autoHideDuration={3000}
                onTimeout={() => setError("")}
                severity="error"
                message={error}
            />
        </Container>
    );
}