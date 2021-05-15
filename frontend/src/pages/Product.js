import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, CardMedia, Grow, Typography } from '@material-ui/core';
import axios from 'axios';
import { Link as RouterLink } from "react-router-dom";
import { capitalized } from '../hook/util'


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
    flexDirection: 'column',
  },
  card1: {
    //minHeight: '60vh',
    //width: '70%',
    height: '100%',
    width: '80%',
    display: 'flex',
    justifyContent: 'flex-top',
    alignItems: 'flext-end',
    flexDirection: 'column',
    borderRadius: 15,
  },

  topContent: {
    display: 'flex',
    justifyContent: 'flex-top',
    alignItems: 'flex-top',
  },
  productImage: {
    height: '50vh',
    width: '50vh',
    display: 'flex',
  },

  description: {
    //margin: '20px',
  },
  productName: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: '2rem',
  },
  freeShippingDeliveryText: {
    color: 'black',

  },

  productPrice: {
    marginBottom: 10,
    fontSize: '1.5rem',
    color: 'red',
  },

  taxes: {
    marginBottom: 10,
  },
  availableText: {
    marginBottom: 10,
    color: 'green',
  },
  shippingTime: {
    marginBottom: 10,
  },
  secureTransactions: {
    marginRight: 10,
    fontSize: '0.9rem',
  },
  shippedby: {
    marginBottom: 20,
    fontSize: '0.8rem',
  },
  addToCartButton: {
    //marginTop: '50%',
    marginRight: 5,
  },
  buyNowButton: {
    marginLeft: 5,
  },
  buttonsContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
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
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    axios.get("/products/" + props.match.params.id)
      .then((res) => {
        console.log(res);

        var imageUrl = res.data.id === 1 ? process.env.PUBLIC_URL + '/assets/temp_sensor.jpg' : process.env.PUBLIC_URL + '/assets/wind_sensor.jpg';
        setState({ loading: false, product: res.data, imageUrl: imageUrl });
        setChecked(true);
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
      <Grow in={checked} >
        <div className={classes.root}>
          <Card className={classes.card1}>
            <CardContent className={classes.topContent}>
              <CardMedia
                className={classes.productImage}
                component="img"
                height="80"
                image={state.imageUrl}

              />

              <CardContent className={classes.cardContent1}>

                <Typography className={classes.productName}>
                  {capitalized(state.product.name)}
                </Typography>

                <Typography className={classes.productPrice}>
                  {state.product.price.toFixed(2)}$
              </Typography>

                <Typography className={classes.taxes}>
                  All prices include IVA
              </Typography>

                <Typography className={classes.availableText}>
                  Immediately Available.
              </Typography>

                <Typography className={classes.shippingTime}>
                  Delivered in 7-10 days
              </Typography>

                <Typography className={classes.description} style={{ whiteSpace: "pre-wrap" }}>
                  {state.product.description}
                </Typography>
              </CardContent>
            </CardContent>

            <CardContent className={classes.buttonsContent}>

              <Typography className={classes.secureTransactions}>
                Secure transactions
            </Typography>

              <Button className={classes.addToCartButton} variant="contained" color="primary" onClick={() => { onAddToCart(state.product.id); setNumProdInCart(numProdInCart + quantity) }}>
                AddToCart
           </Button>

              <Button className={classes.buyNowButton} variant="contained" color="primary" component={RouterLink} to="/dashboard/shop/cart" onClick={() => { onAddToCart(state.product.id); setNumProdInCart(numProdInCart + quantity) }}>
                Buy Now
          </Button>
            </CardContent>
          </Card>
        </div>
      </Grow>

    );
  }
}

export default Product;
