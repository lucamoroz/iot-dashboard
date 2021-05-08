import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Collapse, Button, Box, Paper } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
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
        color: '#fff',
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
        backgroundColor: 'rgba(55, 55, 55, 0.5)',

    },
    buttonsStyle: {
        borderRadius: 50
    }

}));


export default function LandingHeader() {
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, [])
    return (
        <div className={classes.root} id='header'>
            <AppBar className={classes.appbar} elevation={0}>
                <Toolbar className={classes.appBarWrapper}>
                    <h1 className={classes.appBarTitle}>IoT<span className={classes.colorText}>-Dash</span></h1>
                    <Box m="0.5rem">
                        <Button component={RouterLink} to="/shop" variant="outlined" color="primary" style={{ borderRadius: 50 }}>Shop</Button>
                    </Box>
                    <Box m="0.5rem">
                        <Button component={RouterLink} to="/dashboard" variant="outlined" color="primary" style={{ borderRadius: 50 }}>Dashboard</Button>
                    </Box>
                    <Box m="0.5rem">
                        <Button component={RouterLink} to="/signin" variant="contained" color="primary" style={{ borderRadius: 50 }}>LogIn</Button>
                    </Box>
                </Toolbar>
            </AppBar>





            <div className={classes.container}>

                <Collapse in={checked} {... (checked ? { timeout: 1000 } : {})} collapsedHeight={50}>
                    <h1 className={classes.title}>
                        Welcome to <br /> IoT<span className={classes.colorText}>-Dash</span>
                    </h1>
                    <Box className={classes.paper} p='2rem' style={{ borderRadius: 25 }}>
                        <h1 className={classes.subtitle}>
                            Don't you have an account?
                        </h1>

                        <Button component={RouterLink} to="/signup" variant="contained" color="primary" size="large" style={{ borderRadius: 50 }}>
                            Signup
                        </Button>
                    </Box>

                </Collapse>

            </div>


        </div>
    );
}