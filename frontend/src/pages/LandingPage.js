import React, {useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import LandingHeader from '../components/LandingHeader';
import CustomerContext from "../CustomerContext";


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundImage:`url(${process.env.PUBLIC_URL + "/assets/bg.jpeg"})`,
    backgroundRepeat:"no-repeat",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  nextSection: {
    //minHeight: '100vh',
    backgroundColor: 'red',
    
  }
}));

function NextSection() {
    const classes = useStyles();
    return (
        <div className={classes.nextSection}>
            Welcome to the future!
        </div>
    );
}

//Not optimized for network calls. For every render it calls the axiom.get function. TODO: Solve this by using react component
export default function LandingPage(props) {
  const classes = useStyles();

    const customerContext = useContext(CustomerContext);
    if (customerContext.isLoggedIn === undefined) {
        // Waiting to know if customer is logged in
    } else if (customerContext.isLoggedIn) {
        props.history.push('/dashboard');
    }
    
  return (
    <div className={classes.root}>
        <CssBaseline />
        <LandingHeader/>
        <NextSection />
    </div>
    
  );
}
