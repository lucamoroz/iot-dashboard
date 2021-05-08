import React, {useState,useEffect} from "react";

//material UI imports
import {Button,ButtonGroup, Container, TextField, Typography, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

//Button imports
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

// Table imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//Dialog pop-up imports
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Grid from '@material-ui/core/Grid';

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
    
    const [orderId,setOrderId]=useState(-1); 
    const [address,setAddress]=useState("");
    const [products,setProducts]=useState([]);
    const [error, setError] = useState("");


    //Calculate the sum of the prices of the products
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
            setOrderId(res.data.order.id);
            setAddress(res.data.order.address);
            setProducts(res.data.orderProducts);            
        })
        .catch((error) => {
            console.log(error.response);

        });
    }

    //GET requests: user info
    function customerInfo(){
        axios.get('/customer/me')
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }


    //Code runned just once
    useEffect(() => {
        cartInfo();
        customerInfo();
    }, [])

    

    //If user clicked on "+" button of a product
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
    //If user clicked on "-" button of a product
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
    //If user clicked on "delete" button of a product
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

    
    ///////////////////////////////////////////////////////////////////
    // COMPLETE ORDER MECHANISM
    const [open, setOpen] = useState(false);   
    //When user click on the "confirm" button inseide the dialog
    function completeOrder(){
        setOpen(false); //close dialog
        
        axios.post('/order/buyCart?orderId='+orderId+"&orderAddress="+address)
            .then((res) => {
                console.log(res);

                setProducts([]);
                cartInfo();
            })
            .catch((error) => {
                console.log(error.response);
            });
    }
    // Dialog confirm order
    // If user clicked on "complete order" button
    const handleClickOpen = () => {
        //Check if all the text forms are filled
        if (!address){
            console.log("NO address");
        }else if (products.length===0){
            console.log("no products");
        }else{
            console.log("buy cart")
            console.log(products)
            setOpen(true);  // open dialog
        }
    };
    const handleClose = () => {
        setOpen(false); //close dialog
    };
    function dialogConfirmOrder(){
        return (
        <Dialog
            open={open}
            onClose={handleClose}
            >
            <DialogTitle id="alert-dialog-title">{"Are you sure to complete the order?"}</DialogTitle>
            
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={completeOrder} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
        )
    }

    
    
    ///////////////////////////////////////////////////////////////////
    //RENDER FUNCTION
    return(
        <Container maxWidth={"md"}>
            <h1>Your Products</h1>

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
            
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                >
                    <form className={classes.form}>
                        <TextField 
                            label="Address"
                            value={address}
                            onChange={(e)=>setAddress(e.target.value)}
                        />
                    </form>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        >
                        Complete Order
                    </Button>
            </Grid>
            

            {dialogConfirmOrder()}
        </Container>

        

    );

}

/*
TODO:


- POp up di conferma per rimuovere oggetto dal carrello
- SNackbar errore indirizzo non inserito ed errore compra carrello vuoto


*/