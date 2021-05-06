import React from "react";


const axios = require('axios').default

class ShopCart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error:false,
            data:"",
        };

        
    }

    componentDidMount() {
        console.log("didmount");
        axios.get('/order/cartInfo').then((res) => {
            console.log(res.data);
            this.setState({
                error: false,
                data:res.data,
            });
        })
        .catch((error) => {
            console.log(error.response);

            this.setState({
                error: true,
                data:"",
            });
        });

    }


    render() {
        if (this.state.error) {
            return (
                <span>Error Loading data</span>
            );
        } else {
            
            
            if (this.state.data!==""){
                const cartInfo=this.state.data.order;

                const info = <p>Cart info:, {cartInfo.id}, {cartInfo.address}</p>;

                const products=this.state.data.orderProducts;
                
                var prods="";
                if (products){
                    products.forEach(prod => {
                        prods=prods+"<p>"+prod.id+" "+prod.quantity+" ("+prod.product.id+" "+prod.product.description+" "+prod.product.image+" "+prod.product.name+" "+prod.product.price+")</p>"
                    });
                }
                return (
                    info,
                    prods
                );
            }
            return(<h1>no data</h1>);
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