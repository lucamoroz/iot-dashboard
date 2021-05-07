import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import LandingHeader from '../components/LandingHeader';


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
export default function LandingPage() {
  const classes = useStyles();
    
  return (
    <div className={classes.root}>
        <CssBaseline />
        <LandingHeader/>
        <NextSection />
    </div>
    
  );
}
