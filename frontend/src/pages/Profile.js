import React, {useContext, useState, useEffect} from "react";
import {Button, Container, Typography, Paper, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {ExitToApp} from "@material-ui/icons";
import SnackbarAlert from "../components/SnackbarAlert";

import CustomerContext from "../CustomerContext";

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
    const customerContext = useContext(CustomerContext);
    const [error, setError] = useState("");

    const customer = customerContext.customer;

    if (customerContext.isLoggedIn === undefined) {
        // Waiting to know if customer is logged in
    } else if (!customerContext.isLoggedIn) {
        props.history.push('/signin');
    }

    // Fetch customer data (could be changed)
    useEffect(() => {
        axios.get('/customer/me')
            .then((res) => {
                const newCus = res.data;
                const prevCus = customerContext.customer;

                if (newCus.id !== prevCus.id || newCus.username !== prevCus.username || newCus.email !== prevCus.email
                    || newCus.callsCount !== prevCus.callsCount || newCus.plan !== prevCus.plan) {
                    console.log("Updated customer with new data")
                    customerContext.setCustomer(res.data)
                }
            })
            .catch((err) => {
                console.log(err.response);
                const errorMsg = err.response ? err.response.data.description : "No response from backend";
                setError(errorMsg);
            });
    }, [customerContext]);


    function deleteCustomer() {
        axios.delete('/customer/me')
            .then((res) => {
                customerContext.setCustomer({});
                customerContext.setIsLoggedIn(false);
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data.description : "No response from backend";
                setError(errorMsg);
            });
    }

    function logoutCustomer() {
        axios.post('/customer/logout')
            .then((res) => {
                customerContext.setIsLoggedIn(false);
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data.description : "No response from backend";
                setError(errorMsg);
            })
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
            <Grid container>
                <Grid container direction="row" justify="center">
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ExitToApp />}
                            onClick={logoutCustomer}
                        >
                            Logout
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteForeverIcon />}
                            onClick={deleteCustomer}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <SnackbarAlert
                open={error !== ""}
                autoHideDuration={3000}
                onTimeout={() => setError("")}
                severity="error"
                message={error}
            />
        </Container>
    )
}