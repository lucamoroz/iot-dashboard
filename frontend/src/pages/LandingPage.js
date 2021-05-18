import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Box, Button, Collapse, CssBaseline, Toolbar} from '@material-ui/core';
import CustomerContext from "../CustomerContext";
import {Link as RouterLink, NavLink, Route, Switch, useRouteMatch} from "react-router-dom";
import Signup from "./Signup";
import Signin from "./Signin";


const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL + "/assets/bg.jpeg"})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        fontFamily: 'Roboto',
    },
    appbar: {
        background: 'none',
        fontFamily: 'Roboto',
    },
    appBarTitle: {
        flexGrow: '1',
        color: 'fff',
    },
    appBarWrapper: {
        width: '80%',
        margin: '0 Auto',
    },
    colorText: {
        color: '#648dae'
    },
    icon: {
        color: '#fff',
        fontSize: "2rem",
    },
    title: {
        color: '#fff',
        fontSize: '4.5rem',
    },
    subtitle: {
        fontSize: '1.5rem',
    },
    container: {
        minHeight: '100vh',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goDownIcon: {
        color: '#5AFF3D',
        fontSize: '4rem'
    },
    paper: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    buttonsStyle: {
        borderRadius: 50
    }
}));

//Not optimized for network calls. For every render it calls the axiom.get function. TODO: Solve this by using react component
export default function LandingPage(props) {
    const classes = useStyles();

    const customerContext = useContext(CustomerContext);
    if (customerContext.isLoggedIn === undefined) {
        // Waiting to know if customer is logged in
    } else if (customerContext.isLoggedIn) {
        props.history.push('/dashboard');
    }

    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, [])

    const Welcome = () => (
        <div>
            <h1 className={classes.subtitle}>
                Don't you have an account?
            </h1>

            <Button component={RouterLink} to="/signup" variant="contained" color="primary" size="large"
                    style={{borderRadius: 50}}>
                Signup
            </Button>
        </div>
    );

    const main = (
        <main>
        <Switch>  { /* Render only the first Route that matches the URL */ }
            <Route exact path="/" component={Welcome}/>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
        </Switch>
        </main>
    );

    return (
        <div className={classes.root} id='header'>
            <CssBaseline/>
            <AppBar className={classes.appbar} elevation={0}>
                <Toolbar className={classes.appBarWrapper}>
                    <NavLink to="/" className={classes.appBarTitle} style={{textDecoration: "none", color: 'inherit'}}>
                        <h1>IoT<span className={classes.colorText}>-Dash</span></h1>
                    </NavLink>
                    <Box m="0.5vw">
                        <Button component={RouterLink} to="/dashboard/shop" variant="outlined" color="primary"
                                style={{fontSize: '1vw', borderRadius: 50}}>Shop</Button>
                    </Box>
                    <Box m="0.5vw">
                        <Button component={RouterLink} to="/dashboard" variant="outlined" color="primary"
                                style={{fontSize: '1vw', borderRadius: 50}}>Dashboard</Button>
                    </Box>
                    <Box m="0.5vw">
                        <Button component={RouterLink} to="/signin" variant="contained" color="primary"
                                style={{fontSize: '1vw', borderRadius: 50}}>LogIn</Button>
                    </Box>
                </Toolbar>
            </AppBar>


            <div className={classes.container}>
                <Collapse in={checked} {...(checked ? {timeout: 1000} : {})} collapsedHeight={50}>
                    <h1 className={classes.title}>
                        Welcome to <br/> IoT<span className={classes.colorText}>-Dash</span>
                    </h1>
                    <Box className={classes.paper} p='2rem' style={{borderRadius: 25}}>
                        {main}
                    </Box>
                </Collapse>
            </div>

        </div>

    );
}
