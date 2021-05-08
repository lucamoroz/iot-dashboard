import React, {useState,useEffect} from "react";

//material UI imports
import {Button,ButtonGroup, Container, TextField, Typography, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const axios = require('axios').default


const useStyles = makeStyles((theme) => ({
    form: {
        '& > *': {
            padding: theme.spacing(1),
        },
    },
    table: {
        minWidth: 700,
    },
}));

export default function ShopCart(props) {
    const classes = useStyles();
    
    const [address,setAddress]=useState("");
    const [products,setProducts]=useState([]);
    const [buy,setBuy]=useState(false); //Buy Cart button
    const [error, setError] = useState("");

    const [count, setCount] = useState(1);  //just for testing the +/- buttons on cart

    function cartInvoiceTotal(items){
        var ans=0;
        items.forEach(prod => {
            ans=ans+prod.quantity*prod.product.price;
        });
        return ans;
    }
    const invoiceTotal = cartInvoiceTotal(products);

    
    //GET request: cart informations
    function cartInfo(){
        axios.get('/order/cartInfo').then((res) => {
            console.log(res.data);

            setAddress(res.data.order.address);
            setProducts(res.data.orderProducts);

            var q=[];
            products.forEach(prod => {
                q.push(prod.orderProducts.quantity);
            });
            
        })
        .catch((error) => {
            console.log(error.response);

        });
    }


    //Code run just once
    useEffect(() => {
        cartInfo();

        //GET requests: user info
        axios.get('/customer/me')
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err.response);
            });

    }, [])


    // If user clicked on buy button
    if (buy){
        //Check if all the text forms are filled
        if (!address){
            setError("Please fill the form.");
        }else{
            //TODO: BUY CART.....

        }
        

        setBuy(false);
    }

    function increaseQuantity(index){
        var newQuantity=products[index].quantity+=1;
        var productId=products[index].product.id;
        axios.post('/order/editProductQuantity?productId='+productId+"&newQuantity="+newQuantity)
            .then((res) => {
                console.log(res);

                let newarr=[...products];
                newarr[index].quantity=newQuantity;
                setProducts(newarr);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
    function decreaseQuantity(index){
        var newQuantity=Math.max(1,products[index].quantity-1);
        var productId=products[index].product.id;
        axios.post('/order/editProductQuantity?productId='+productId+"&newQuantity="+newQuantity)
            .then((res) => {
                console.log(res);

                let newarr=[...products];
                newarr[index].quantity=newQuantity;
                setProducts(newarr);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
    function removeProduct(index){
        var productId=products[index].product.id;
        axios.delete('/order/removeProductFromCart/'+productId)
            .then((res) =>{
                console.log(res);
                setProducts([]);
                cartInfo();
            })
            .catch((error) =>{
                console.log(error.response);
            });
    }
    
    return(
        <Container maxWidth={"md"}>
            
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Sum</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((prod,index)=>
                        <TableRow>
                            <TableCell>{prod.product.name}</TableCell>
                            <TableCell align="right">{prod.quantity}</TableCell>
                            <TableCell align="right">{prod.product.price.toFixed(2)} $</TableCell>
                            <TableCell align="right">{(prod.quantity*prod.product.price).toFixed(2)} $</TableCell>
                            <TableCell align="center">
                                <ButtonGroup  orientation="horizontal" fontSize="small">
                                    <Button onClick={() => {increaseQuantity(index)}} >
                                        <AddIcon fontSize="small" />
                                    </Button>
                                    <Button onClick={()=>decreaseQuantity(index)} >
                                        <RemoveIcon fontSize="small" />
                                    </Button>
                                    <Button onClick={()=>removeProduct(index)}>
                                        <DeleteIcon fontSize="small" />
                                    </Button>
                                </ButtonGroup>
                            </TableCell>
                      </TableRow>
                    )}


                <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                    <TableCell align="right"><strong>{invoiceTotal.toFixed(2)} $</strong></TableCell>
                </TableRow>
                </TableBody>
            </Table>
            </TableContainer>
            




            <form className={classes.form}>
                <TextField 
                    label="Address"
                    value={address}
                    onChange={(e)=>setAddress(e.target.value)}
                />
            </form>
        </Container>

        

    );

}
/*

    const info = <p>Cart info:, {cartInfo.id}, {cartInfo.address}</p>;
    prods=prods+"abaa<p>"+prod.id+" "+prod.quantity+" ("+prod.product.id+" "+prod.product.description+" "+prod.product.image+" "+prod.product.name+" "+prod.product.price+")</p>"

/*

TODO:
- display cart info. @GetMapping("/cartInfo")
- buy cart button. PostMapping("/buyCart"). orderId, orderAddress
- edit product quantity. PostMapping("/editProductQuantity"). productId, newQuantity
- remove product from cart. DeleteMapping("/removeProductFromCart/{id}")
- 



*/