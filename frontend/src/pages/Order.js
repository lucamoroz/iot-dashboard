import React, {useState,useEffect,useContext} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {Button,ButtonGroup, Container, TextField, Typography, Box} from "@material-ui/core";

// Table imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import SearchIcon from '@material-ui/icons/Search';

import {useParams} from 'react-router-dom';

import CustomerContext from "../CustomerContext";

const axios = require('axios').default


const useStyles = makeStyles((theme) => ({
    form: {
        '& > *': {
            padding: theme.spacing(1),
        },
    },
    table: {
        minWidth: 400,
    },
}));




export default function Order(props){
    const classes = useStyles();

    let { id } = useParams();
    const [orderId,setOrderId]=useState(id);
    const [order,setOrder]=useState();

    // IF user not logged in redirect
    const customerContext = useContext(CustomerContext);
    const customer = customerContext.customer;
    if (!customerContext.isLoggedIn) {
        props.history.push('/signin');

    }
    

    //GET requests: completed orders of the current user
    function completedOrders(){
        axios.get('/order/completedOrders')
            .then((res) => {
                console.log(res.data);
                
                //Find the order with id=orderId
                var ord=res.data.find(element => String(element.id)===orderId);

                //Calculate total $
                var total=0;
                ord.orderProducts.forEach(prod => {
                    total+=prod.product.price*prod.quantity;
                    console.log(prod.product.price,prod.quantity);
                });
                ord["total"]=total;

                setOrder(ord);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }

    //Code runned just once
    useEffect(() => {
        //setOrderId(id);
        console.log("orderid:"+orderId);
        completedOrders();
    }, [])

    function timestampFormat(timestamp) {
        return new Date(Date.parse(timestamp)).toLocaleString();
    }

    function renderOrder(){
        if (!order){
            return (<h1>This Order does not exist</h1>);
        }

        return(
            <Container maxWidth={"sm"}>
                
                <Typography variant="h4">Order ID = {orderId}</Typography>
                <Typography variant="subtitle1">Delivered at: {order.address}</Typography>
                <Typography variant="subtitle1">Paid on: {timestampFormat(order.timestamp)}</Typography>

                <br/>
                
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="spanning table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Sum</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderProducts.map((prod,index)=>
                                <TableRow>
                                    <TableCell>{prod.product.name}</TableCell>
                                    <TableCell align="right">{prod.quantity}</TableCell>
                                    <TableCell align="right">{prod.product.price.toFixed(2)} $</TableCell>
                                    <TableCell align="right">{(prod.quantity*prod.product.price).toFixed(2)} $</TableCell>
                                </TableRow>
                            )}


                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                            <TableCell align="right"><strong>{order.total.toFixed(2)} $</strong></TableCell>
                        </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>);
    }

    return renderOrder();
}
/*

todo:

 */