import React from "react";

//material UI imports
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const axios = require('axios').default

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
                    <TextField required id="customer_address" label="Address" defaultValue={address}/>
                    </div>
                </form>
            );

                
            
        }
    }
}

export default ShopCart

/*

TODO:
- get cart info. @GetMapping("/cartInfo")
- buy cart button. PostMapping("/buyCart"). orderId, orderAddress
- edit product quantity. PostMapping("/editProductQuantity"). productId, newQuantity
- remove product from cart. DeleteMapping("/removeProductFromCart/{id}")
- 



*/