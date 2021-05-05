import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { AppBar, Badge, Collapse, CssBaseline, IconButton, Toolbar } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Link as Scroll } from 'react-scroll'
import { Link as RouterLink } from 'react-router-dom';

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
    container: {
        textAlign: 'center',
    },
    goDownIcon: {
        color: '#5AFF3D',
        fontSize: '4rem'
    },

}));


export default function ShopHeader() {
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
                    <Badge badgeContent={1} component={RouterLink} to="/cart" color="secondary">
                        <ShoppingCartIcon className={classes.icon}/>
                    </Badge>
                </Toolbar>
            </AppBar>

            

        {/*    <Collapse in={checked} {... (checked ? { timeout: 1000 } : {})} collapsedHeight={50}>
                <div className={classes.container}>
                    <h1 className={classes.title}>
                        Welcome to <br /> IoT<span className={classes.colorText}>-Dash</span>
                    </h1>
                    <Scroll to='sensors-to-buy' smooth={true}>
                        <IconButton>
                            <ExpandMoreIcon className={classes.goDownIcon}/>
                        </IconButton>
                    </Scroll>
                </div>
            </Collapse>
        */}
            
        </div>
    );
}