import React, {useState,useEffect} from "react";
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




export default function OrderList(prop){
    const classes = useStyles();

    const [orders,setOrders]=useState([]);


    //GET requests: completed orders of the current user
    function completedOrders(){
        axios.get('/order/completedOrders')
            .then((res) => {
                console.log(res.data);
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }

    //Code runned just once
    useEffect(() => {
        completedOrders();
    }, [])

    //If there are no orders
    function noOrdersMessage(){
        if (orders.length===0){
            console.log("no orders");
            return(
                <TableRow>
                    <TableCell>No orders completed ...</TableCell>
                </TableRow>
            );
        }
    }
    

    // RENDER
    return (
        <Container maxWidth={"sm"}>
            <h1>Order History</h1>
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order,index)=>
                        <TableRow>
                            <TableCell>{order.id}</TableCell>
                            <TableCell align="right">{order.timestamp.substring(0,10)} {order.timestamp.substring(11,16)}</TableCell>
                            <TableCell align="right">{(9999).toFixed(2)} $</TableCell>
                            <TableCell align="center">
                                <ButtonGroup  orientation="horizontal" fontSize="small">
                                    <Button >
                                        <SearchIcon fontSize="small" />
                                    </Button>
                                    
                                </ButtonGroup>
                            </TableCell>
                      </TableRow>
                    )}

                        
                {noOrdersMessage()}
                
                </TableBody>
            </Table>
            </TableContainer>
        </Container>
    );
}


/*
TODO:
- CALCULATE ORDER TOTAL
- migliora visualizzazione timestamp

*/