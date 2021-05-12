import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, CardMedia, CssBaseline, IconButton, Typography } from '@material-ui/core';
import LandingHeader from '../components/LandingHeader';
import axios from 'axios';
import ImageCardExpanded from '../components/ImageCardExpanded';
import {Link as RouterLink, Link, Route, Switch, useRouteMatch} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  cardContent1: {

    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  card1: {
    minHeight: '70vh',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '10px',

  },
  card2: {

    minHeight: '70vh',
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10px',

  },
  productImage: {
    height: '50%',
    width: '50%',
    display: 'flex',
  },
 
  description: {
    margin: '20px',
  },
  productName: {
    fontSize: '2rem',
  },
  availableText: {
    color: 'green',
  },
  freeShippingDeliveryText: {
    color: 'black',
    
  }

}));

function onAddToCart(id) {
  const params = new URLSearchParams();
  params.append('productId', id);
  axios.post("/order/addProductToCart", params)
    .then((res) => {
      console.log(res)
    });
}

function Product(props) {
  const classes = useStyles();
  const [state, setState] = useState({ loading: true, product: null, imageUrl: "" });
  useEffect(() => {
    axios.get("/products/" + props.match.params.id)
      .then((res) => {
        console.log(res);

        var imageUrl = res.data.id === 1 ? process.env.PUBLIC_URL + '/assets/temp_sensor.jpg' : process.env.PUBLIC_URL + '/assets/wind_sensor.jpg';
        setState({ loading: false, product: res.data, imageUrl: imageUrl });
      }).catch((err) => {
        console.log(err);
      })
  }, []);

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
      })
      ;
  }, []);

  useEffect(() => {
    console.log(numProdInCart);
    props.handleSetCartCount(numProdInCart)
  }, [numProdInCart]);
  const quantity = 1;
  if (state.loading) {
    return (
      <div >
        Loading data
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        <Card className={classes.card1}>

          <CardContent className={classes.cardContent1}>

            <CardMedia
              className={classes.productImage}
              component="img"
              height="80"
              image={state.imageUrl}

            />

            <CardContent >

              <Typography className={classes.productName} >
                {state.product.name}
              </Typography>

              <Typography>
                  {state.product.price}
              </Typography>

              <Typography className={classes.freeShippingDeliveryText}>
                 Free shipping delivery
              </Typography>
              

            </CardContent>

          </CardContent>

          <Typography className={classes.description}>
            {state.product.description}
          </Typography>


        </Card>

        <Card className={classes.card2} childStyle={{margin: 8}}>

          <Typography >
            {state.product.name}
          </Typography>

          <Typography >
            {state.product.price}
          </Typography>

          <Typography >
            All prices include IVA
          </Typography>

          <Typography className={classes.availableText}>
            Immediately Available.
          </Typography>

          <Typography >
            Delivered in 7-10 days
          </Typography>

          <Button variant="contained" color="primary" onClick={() => { onAddToCart(state.product.id); setNumProdInCart(numProdInCart + quantity) }}>
            AddToCart
          </Button>

          <Button variant="contained" color="primary" component={RouterLink} to="/dashboard/shop/cart" onClick={() => { onAddToCart(state.product.id); setNumProdInCart(numProdInCart + quantity) }}>
            Buy Now
          </Button>

          <Typography>
            Secure transactions
          </Typography>

          <Typography>
            Sold and Shipped by Iot-Dash
          </Typography>

        </Card>
      </div>
    );
  }
}

export default Product;
