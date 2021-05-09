import {NavLink, Route, Switch} from "react-router-dom";
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Device from "./pages/Device";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import {CssBaseline} from "@material-ui/core";
import React, {useContext, useEffect, useState} from "react";
import CustomerContext from "./CustomerContext";
import ShopCart from "./pages/ShopCart";
import OrderList from "./pages/OrderList";
import Order from "./pages/Order";

// Allow to customize theme (e.g. change primary, secondary colors, ... )
const theme = createMuiTheme();

const useStyles = makeStyles({
    root: {
        display: "inline"
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
                console.log("Customer not logged in")
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
                    <Navbar />
                    <Main />
                    <Footer />
                </div>
            </CustomerContext.Provider>
        </ThemeProvider>
    );
}

const Navbar = () => (
    <nav>
        <ul>
            <li><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/signup'>Signup</NavLink></li>
            <li><NavLink to='/signin'>Signin</NavLink></li>
            <li><NavLink to='/profile'>Profile</NavLink></li>
            <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
            <li><NavLink to='/shop/cart'>Shop Cart</NavLink></li>
            <li><NavLink to='/shop/orders'>Order List</NavLink></li>
            <li><NavLink to='/device'>Device</NavLink></li>
        </ul>
    </nav>
);

const Main = () => (
    <Switch>  { /* Render only the first Route that matches the URL */ }
        <Route exact path='/' component={Home} /> { /* Render component Home when the URL matches the path '/' */ }
        <Route exact path='/signup' component={Signup} /> { /* Note: removing 'exact' we could have a Rout with path='/device' that matches child paths e.g. '/device/status' */ }
        <Route exact path='/signin' component={Signin} />
        <Route exact path='/shop/cart' component={ShopCart} />
        <Route exact path='/shop/orders' component={OrderList} />
        <Route exact path='/shop/order/:id' component={Order} />
        <Route exact path='/profile' component={Profile} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/device/:id' component={Device} />
    </Switch>
);

const Footer = () => (
    <div>This is the footer</div>
);


export default App;