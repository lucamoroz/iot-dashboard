import React from "react";


const axios = require('axios').default

class ShopCart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error:false,
            data:"",
        };

        console.log("constructor");
    }

    componentDidMount() {
        console.log("didmount");
        axios.get('/order/cartInfo').then((res) => {
            console.log("cartinfo");
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
        
        console.log("render");
        if (this.state.error) {
            
            return (
                <span>Error Loading data</span>
            );
        } else {
            console.log(this.state);
            const element = <h1>Hello, {this.state}</h1>;
            return (
                element
            );
        }
    }
}

export default ShopCart

/*

TODO:
- buy cart button. PostMapping("/buyCart"). orderId, orderAddress
- get cart info. @GetMapping("/cartInfo")
- edit product quantity. PostMapping("/editProductQuantity"). productId, newQuantity
- remove product from cart. DeleteMapping("/removeProductFromCart/{id}")
- 



*/