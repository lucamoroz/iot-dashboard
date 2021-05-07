import React, { useEffect, useState } from 'react';
import {Link as Scroll} from 'react-scroll';
import {makeStyles} from '@material-ui/core/styles';
import { AppBar, Toolbar, Collapse, IconButton, Button, Box, Paper } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { spacing } from '@material-ui/system';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        fontFamily: 'Nunito',
    },
    appbar: {
        background: 'none',
        fontFamily: 'Nunito',
    },
    appBarTitle: {
        flexGrow: '1',
    },
    appBarWrapper: {
        width: '80%',
        margin: '0 Auto',
    },
    colorText: {
        color: '#5AFF3D'
    },
    icon: {
        color: '#fff',
        fontSize:"2rem",
    },
    title: {
        color: '#fff',
        fontSize: '4.5rem',
    },
    subtitle: {
        color: '#fff',
        fontSize: '2rem',
    },
    container: {
        textAlign: 'center',
    },
    goDownIcon: {
        color: '#5AFF3D',
        fontSize: '4rem'
    },
    paper: {
        backgroundColor: 'rgba(55, 55, 55, 0.5)',
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
                    <Box m="1rem">
                        <Button component={RouterLink} to="/shop" variant="outlined" color="secondary">Shop</Button>
                    </Box>
                    <Box m="1rem">
                        <Button component={RouterLink} to="/dashboard" variant="outlined" color="secondary">Dashboard</Button>
                    </Box>
                    <Box m="1rem">
                        <Button component={RouterLink} to="/signin" variant="contained" color="secondary">LogIn</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            

            <Collapse in={checked} {... (checked ? { timeout: 1000 } : {})} collapsedHeight={50}>
                <div className={classes.container}>
                    <h1 className={classes.title}>
                        Welcome to <br /> IoT<span className={classes.colorText}>-Dash</span>
                    </h1>
                    <Paper className={classes.paper}>
                    <h1 className={classes.subtitle}>
                        You don't have an account?
                    </h1>

                    <Button component={RouterLink} to="/signup" variant="contained" color="secondary" size="large">
                        Signup
                    </Button>
                    </Paper>
                    
                    
                </div>
            </Collapse>
        
            
        </div>
    );
}