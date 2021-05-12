import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, CssBaseline, IconButton, Typography } from '@material-ui/core';
import LandingHeader from '../components/LandingHeader';
import axios from 'axios';
import ImageCardExpanded from '../components/ImageCardExpanded';


const useStyles = makeStyles((theme) => ({
  root: {
    
    display: 'flex',
    backgroundColor: 'red',
    justifyContent: 'center',

  },

}));

/*class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, product: null, }
  }

  componentDidMount() {
    axios.get("/products/" + this.props.match.params.id)
      .then((res) => {
        console.log(res);
        this.setState({ loading: false, product: res.data });
      }).catch((err) => {
        console.log(err);
      })
  }

  render() {
    const { product } = this.state;
    const { loading } = this.state;
    if (loading) {
      return (
        <div >
          Loading data
        </div>
      );
    } else {
      return (
        <div>
          {product.name}
        </div>
      );
    }

  }
}*/

function Product(props) {
  const classes = useStyles();
  const [state, setState] = useState({ loading: true, product: null, });
  useEffect(() => {
    axios.get("/products/" + props.match.params.id)
      .then((res) => {
        console.log(res);
        setState({ loading: false, product: res.data });
      }).catch((err) => {
        console.log(err);
      })
  }, []);

  if (state.loading) {
    return (
      <div >
        Loading data
      </div>
    );
  } else {
    return (
      <ImageCardExpanded sensor={state.product} checked={true}/>
    );
  }
}

export default Product;
