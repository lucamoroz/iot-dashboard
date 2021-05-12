import React, {useEffect, useState,useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import ShopHeader from '../components/ShopHeader';
import SensorsToBuy from '../components/SensorsToBuy';

import CustomerContext from "../CustomerContext";

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundImage:`url(${process.env.PUBLIC_URL + "/assets/bg.jpeg"})`,
    backgroundRepeat:"no-repeat",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}));

export default function ShopPage(props) {

  // IF user not logged in redirect
  const customerContext = useContext(CustomerContext);
  const customer = customerContext.customer;
  if (!customerContext.isLoggedIn) {
      props.history.push('/signin');

  }

  const classes = useStyles();
  const [numProdInCart, setNumProdInCart] = useState(0);
  useEffect(() => {
    axios.get("/order/cartInfo")
    .then((res) => {
        console.log(res);
        var numProducts = 0;
        res.data.orderProducts.forEach((orderProd) => {
            numProducts += orderProd.quantity
        });
        setNumProdInCart(numProducts);
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    console.log(numProdInCart);
  }, [numProdInCart]);
  
  return (
    <div className={classes.root}>
        <CssBaseline />
        <ShopHeader numProdInCart={numProdInCart}/>
        <SensorsToBuy onProductAdded={(quantity) => {setNumProdInCart(prev => prev + quantity)}}/>
    </div>
    
  );
}
