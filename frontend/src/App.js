import {Route, Switch} from "react-router-dom";
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import LandingPage from './pages/LandingPage';
import {Backdrop, CircularProgress, CssBaseline} from "@material-ui/core";
import React, {useContext, useEffect, useState} from "react";
import CustomerContext from "./CustomerContext";
import Dashboard from "./Dashboard";

// Allow to customize theme (e.g. change primary, secondary colors, ... )
const theme = createMuiTheme();

const useStyles = makeStyles({
    root: {
        display: "inline"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
});

const axios = require('axios').default
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8080'


function App() {
    const classes = useStyles();
    const customerContext = useContext(CustomerContext);
    const [customer, setCustomer] = useState(customerContext.customer);
    const [isLoggedIn, setIsLoggedIn] = useState(customerContext.isLoggedIn);

    // Check if customer is logged in, update context if so (done on page refresh or close & open)
    useEffect(() => {
        axios.get('/customer/me')
            .then((res) => {
                console.log("App retrieved logged customer: " + res.data);
                const newCus = res.data;
                const prevCus = customer;

                if (newCus.id !== prevCus.id || newCus.username !== prevCus.username || newCus.email !== prevCus.email
                    || newCus.callsCount !== prevCus.callsCount || newCus.plan !== prevCus.plan) {
                    setCustomer(newCus);
                }
                if (!isLoggedIn) {
                    setIsLoggedIn(true);
                }
            })
            .catch((err) => {
                console.log("Customer not logged in");
                setIsLoggedIn(false);
            });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <CustomerContext.Provider
                value={{
                    customer: customer,
                    setCustomer: setCustomer,
                    isLoggedIn: isLoggedIn,
                    setIsLoggedIn: setIsLoggedIn}}
            >
                <div className={classes.root}>
                    <Backdrop className={classes.backdrop} open={isLoggedIn === undefined}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Main />
                </div>
            </CustomerContext.Provider>
        </ThemeProvider>
    );
}

const Main = () => (
    <Switch>  { /* Render only the first Route that matches the URL */ }
        <Route path='/' component={LandingPage} /> { /* Render component Home when the URL matches the path '/' */ }
        <Route path='/dashboard' component={Dashboard} />
    </Switch>
);


export default App;