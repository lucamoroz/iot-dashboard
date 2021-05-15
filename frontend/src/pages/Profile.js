import React, {useContext, useState, useEffect} from "react";
import {Button, Container, Typography, Paper, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import {ExitToApp} from "@material-ui/icons";
import SnackbarAlert from "../components/SnackbarAlert";

//Dialog pop-up imports
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import CustomerContext from "../CustomerContext";

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(2),
            padding: theme.spacing(1)
        },
    },
    upgradeButton: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        height: theme.spacing(5),
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
}));


export default function Profile(props) {
    const classes = useStyles();
    const customerContext = useContext(CustomerContext);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);

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

    function upgradeCustomer() {
        axios.post('/customer/me/upgrade')
            .then((res) => {
                customer.plan = "PREMIUM";
                customerContext.setCustomer(customer);
                setMessage("Successfully upgraded account!");
            })
            .catch((err) => {
                console.log(err)
                setError("Error upgrading account");
            })

        setOpenUpgradeDialog(false);
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
                            onClick={() => setOpenLogoutDialog(true)}
                        >
                            Logout
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteForeverIcon />}
                            onClick={() => setOpenDeleteDialog(true)}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container>
                <Grid container direction="row" justify="center">
                    <Button

                        className={classes.upgradeButton}
                        variant="contained"
                        color="secondary"
                        startIcon={<EventSeatIcon />}
                        onClick={() => setOpenUpgradeDialog(true)}
                        disabled={ customer.plan === "PREMIUM" }
                    >
                        Upgrade
                    </Button>
                </Grid>
            </Grid>
            <SnackbarAlert
                open={error !== ""}
                autoHideDuration={3000}
                onTimeout={() => setError("")}
                severity="error"
                message={error}
            />
            <SnackbarAlert
                open={message !== ""}
                autoHideDuration={3000}
                onTimeout={() => setMessage("")}
                severity="success"
                message={message}
            />

            <Dialog
                open={openLogoutDialog}
                onClose={() => setOpenLogoutDialog(false)}
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to log out?"}</DialogTitle>

                <DialogActions>
                    <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={logoutCustomer} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete your account?"}</DialogTitle>

                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={deleteCustomer} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openUpgradeDialog}
                onClose={() => setOpenUpgradeDialog(false)}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you want to upgrade your account? We will withdraw 10k from your personal balance "}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={() => setOpenUpgradeDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={upgradeCustomer} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}