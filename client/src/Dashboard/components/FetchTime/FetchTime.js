import React from 'react';
import { useEffect, useState } from 'react';
import AccessTime from '@material-ui/icons/AccessTime';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle.js';
import moment from 'moment';

const useStyles = makeStyles(styles);



export default function FetchTime(props) {

    const classes = useStyles();

    const [fetchTime, setFetchTime] = useState(moment(props.lastMetricFetchTime).fromNow())
    useEffect(() => {
    
        const interval = setInterval(() => {

          setFetchTime(moment(props.lastMetricFetchTime).fromNow())
    
        }, 1000)
    
        return () => clearInterval(interval);
    
    
    
      }, [props.lastMetricFetchTime]);    

    return (
        <div className={classes.stats}>
        <AccessTime /> Last Fetched{' '}
        {fetchTime}
      </div>
    );
  }