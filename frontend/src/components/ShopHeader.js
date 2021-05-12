import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Badge, Box, Collapse, IconButton, Toolbar } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link as Scroll } from 'react-scroll';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontFamily: 'Roboto',
    },
    appbar: {
        background: 'none',
        fontFamily: 'Roboto',
    },
    appBarTitle: {
        flexGrow: '1',
    },
    appBarWrapper: {
        width: '80%',
        margin: '0 Auto',
    },
    colorText: {
        color: '#648dae'
    },
    cartIcon: {
        color: '#fff',
        fontSize: "2rem",
    },
    title: {
        color: '#fff',
        fontSize: '2.5rem',
    },
    container: {
        textAlign: 'center',
    },
    goDownIcon: {
        color: '#5AFF3D',
        fontSize: '4rem'
    },
    backArrowIcon: {
        color: 'white',
        fontSize: '2rem',
    }

}));


export default function ShopHeader({ numProdInCart }) {
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, []);
    return (
        <div className={classes.root} id='header'>
            <AppBar className={classes.appbar} elevation={0}>
                <Toolbar className={classes.appBarWrapper}>
                    <IconButton component={RouterLink} to="/">
                        <ArrowBackIcon className={classes.backArrowIcon} />
                    </IconButton>
                    <h1 className={classes.appBarTitle}>IoT<span className={classes.colorText}>-Dash</span></h1>
                    <Badge badgeContent={numProdInCart} component={RouterLink} to="/shop/cart" color="secondary">
                        <ShoppingCartIcon className={classes.cartIcon} />
                    </Badge>
                </Toolbar>
            </AppBar>

            <div className={classes.container}>
                <h1 className={classes.title}>
                   Check our brand new Products
                </h1>
            </div>

        </div>
    );
}