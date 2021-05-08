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

import {useParams} from 'react-router-dom';

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

    
    const [orderId,setOrderId]=useState(-1); 
    const [address,setAddress]=useState("");
    const [timestamp,setTimestap]=useState("0");
    const [products,setProducts]=useState([]);

    
    let { id } = useParams();
    //Code runned just once
    useEffect(() => {
        //completedOrders();
        setOrderId(id);
    }, [])

    return (
        <Container maxWidth={"sm"}>
            <h1>Order id={orderId}</h1>
            <h2>Delivered at {address}</h2>
            <h2>Paid on </h2>
        </Container>
    )
}