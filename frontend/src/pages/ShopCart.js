import React, {useState,useEffect} from "react";

//material UI imports
import {Button,ButtonGroup, Container, TextField, Typography, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const axios = require('axios').default


const useStyles = makeStyles((theme) => ({
    form: {
        '& > *': {
            padding: theme.spacing(1),
        },
    }
}));

export default function ShopCart(props) {
    const classes = useStyles();
    
    const [address,setAddress]=useState("");
    const [products,setProducts]=useState([]);
    const [buy,setBuy]=useState(false); //Buy Cart button
    const [error, setError] = useState("");

    const [count, setCount] = useState(1);  //just for testing the +/- buttons on cart


    
    //Code run just once
    useEffect(() => {
        //GET request: cart informations
        axios.get('/order/cartInfo').then((res) => {
            console.log(res.data);

            setAddress(res.data.order.address)
            setProducts(res.data.orderProducts);

            var q=[];
            products.forEach(prod => {
                q.push(prod.orderProducts.quantity);
            });
            
        })
        .catch((error) => {
            console.log(error.response);

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

    return(
        <Container maxWidth={"sm"}>
            <form className={classes.form}>
                <TextField 
                    label="Address"
                    value={address}
                    onChange={(e)=>setAddress(e.target.value)}
                />
            </form>

            
            {
                products.map((prod,index)=>
                    <p>product id: {prod["id"]}, product quantity: {prod["quantity"]}
                    
                        <ButtonGroup>
                            <Button
                                aria-label="reduce"
                                onClick={() => {
                                    let newarr=[...products];
                                    newarr[index].quantity=Math.max(1,newarr[index].quantity-1);
                                    setProducts(newarr);
                                }}
                            >
                                <RemoveIcon fontSize="small" />
                            </Button>
                            <Button
                                aria-label="increase"
                                onClick={() => {
                                    let newarr=[...products];
                                    newarr[index].quantity++;
                                    setProducts(newarr);
                                }}
                            >
                                <AddIcon fontSize="small" />
                            </Button>
                        </ButtonGroup>
                    </p>

                )
                
            }
            
        </Container>

    );

}
/*
class ShopCart extends React.Component {

    
    constructor(props) {
        super(props);

        this.state = {
            error:false,
            info:"",
            products:[],
        };

        
    }

    componentDidMount() {
        
        //GET request for cart informations
        axios.get('/order/cartInfo').then((res) => {
            console.log(res.data);
            this.setState({
                error: false,
                info:res.data.order,
                products:res.data.orderProducts,
            });
        })
        .catch((error) => {
            console.log(error.response);

            this.setState({
                info:"",
                products:[],
            });
        });

    }

    

    render() {
        if (this.state.error) {
            return (
                <span>Error Loading data</span>
            );
        } else {
            

            var cartInfo=this.state.info;
            var address=""
            if (cartInfo!==""){
                address=String(cartInfo.address)

            }

            const info = <p>Cart info:, {cartInfo.id}, {cartInfo.address}</p>;

            const products=this.state.products;
            
            var prods="";
            if (products){
                products.forEach(prod => {
                    prods=prods+"abaa<p>"+prod.id+" "+prod.quantity+" ("+prod.product.id+" "+prod.product.description+" "+prod.product.image+" "+prod.product.name+" "+prod.product.price+")</p>"
                });
            }
            
            
            return (
                
                <form noValidate autoComplete="off">
                    <div>
                    <TextField required id="customer_address" label="Address" value={address} onChange={this.handleChange}/>
                    </div>
                </form>
            );

            //
            
        }
    }
}

export default ShopCart*/

/*

TODO:
- get cart info. @GetMapping("/cartInfo")
- buy cart button. PostMapping("/buyCart"). orderId, orderAddress
- edit product quantity. PostMapping("/editProductQuantity"). productId, newQuantity
- remove product from cart. DeleteMapping("/removeProductFromCart/{id}")
- 



*/