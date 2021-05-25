import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Box, Button, Collapse, CssBaseline, Toolbar, Typography} from '@material-ui/core';
import CustomerContext from "../CustomerContext";
import {Link as RouterLink, NavLink, Route, Switch} from "react-router-dom";
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
        fontSize: '1.4rem',
        fontWeight: 'bold',
    },
    appBarTitleLink: {
        flexGrow: '1',
        textDecoration: "none", 
        color: 'inherit',
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
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
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
        borderRadius: 25,
    },
    buttonsStyle: {
        borderRadius: 50
    },
    headerButton: {
        fontSize: `calc(max(0.6rem,min(0.8rem, 1vw)))`,
        maxFontSize: '0.5rem',
        borderRadius: 50
    },
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
            <Typography 
            className={classes.subtitle}
            >
                Don't you have an account?
            </Typography>

            <Button component={RouterLink} to="/signup" variant="contained" color="primary" size="large"
                    className={classes.buttonsStyle}>
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
                    <NavLink to="/" className={classes.appBarTitleLink}>
                        <Typography
                           className={classes.appBarTitle}
                        >
                            IoT<span className={classes.colorText}>-Dash</span>
                        </Typography>
                       
                    </NavLink>
                    <Box m="0.5vw">
                        <Button component={RouterLink} to="/dashboard/shop" variant="outlined" color="primary"
                                className={classes.headerButton}>Shop</Button>
                    </Box>
                    <Box m="0.5vw">
                        <Button component={RouterLink} to="/dashboard" variant="outlined" color="primary"
                                 className={classes.headerButton}>Dashboard</Button>
                    </Box>
                    <Box m="0.5vw">
                        <Button component={RouterLink} to="/signin" variant="contained" color="primary"
                                 className={classes.headerButton}>LogIn</Button>
                    </Box>
                </Toolbar>
            </AppBar>


            <div className={classes.container}>
                <Collapse in={checked} {...(checked ? {timeout: 1000} : {})} collapsedHeight={50}>
                    <Typography className={classes.title}>
                        Welcome to <br/> IoT<span className={classes.colorText}>-Dash</span>
                    </Typography>
                    <Box className={classes.paper} p='2rem'>
                        {main}
                    </Box>
                </Collapse>
            </div>

        </div>

    );
}
