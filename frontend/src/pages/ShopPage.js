import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import ShopHeader from '../components/ShopHeader';
import SensorsToBuy from '../components/SensorsToBuy';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundImage:`url(${process.env.PUBLIC_URL + "/assets/bg.jpg"})`,
    backgroundRepeat:"no-repeat",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}));

export default function ShopPage() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
        <CssBaseline />
        <ShopHeader/>
        <SensorsToBuy />
    </div>
    
  );
}
