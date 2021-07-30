import React from 'react';
import { useEffect, useState } from 'react';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';
import { connect } from 'react-redux';
// @material-ui/core
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
// @material-ui/icons
import Store from '@material-ui/icons/Store';
import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import Update from '@material-ui/icons/Update';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AccessTime from '@material-ui/icons/AccessTime';
import Accessibility from '@material-ui/icons/Accessibility';
import BugReport from '@material-ui/icons/BugReport';
import Code from '@material-ui/icons/Code';
import Cloud from '@material-ui/icons/Cloud';
// core components
import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import LogTable from '../../components/Table/LogTable.js';
import LambdaList from '../../components/LambdaList/LambdaList.js';
import CustomTabs from '../../components/CustomTabs/CustomTabs.js';
import Danger from '../../components/Typography/Danger.js';
import LogCard from '../../components/Card/LogCard.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardIcon from '../../components/Card/CardIcon.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';

import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import * as actions from '../../../Actions/actions';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import styles from '../../assets/jss/material-dashboard-react/views/logsStyle.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  arn: state.main.arn,
  credentials: state.main.credentials,
  aws: state.aws,
});

const mapDispatchToProps = (dispatch) => ({
  addCredentials: (userInfo) => dispatch(actions.addCredentials(userInfo)),
  addLambda: (functions) => dispatch(actions.addLambda(functions)),
  addFunctionLogs: (logObj) => dispatch(actions.addFunctionLogs(logObj)),
  removeFunctionLogs: (functionName) =>
    dispatch(actions.removeFunctionLogs(functionName)),
  updateFunctionLogs: (updatedLogs) =>
    dispatch(actions.updateFunctionLogs(updatedLogs)),
});

function Logs(props) {
  const classes = useStyles();
  const indexArr = props.aws.functions.map((el, i) => {
    return i;
  });

  const logsShown = props.aws.functionLogs.map((logObj) => {
    return logObj.name;
  });

  const mappedMsgs = props.aws.functionLogs.map((logObj, i) => {
    return (
      <CustomTabs
        key={i}
        headerColor='warning'
        title={logObj.name}
        tabs={[
          {
            tabName: 'Logs',
            tabIcon: Cloud,
            tabContent: (
              <LogTable
                tableHeaderColor='warning'
                tableHead={[
                  'Last 5 Characters of Log Stream Name',
                  'Date',
                  'Message',
                ]}
                tableData={logObj.streams}
                status='logs'
              />
            ),
          },
          {
            tabName: 'Errors',
            tabIcon: Warning,
            tabContent: (
              <LogTable
                tableHeaderColor='danger'
                tableHead={[
                  'Last 5 Characters of Log Stream Name',
                  'Date',
                  'Message',
                ]}
                tableData={logObj.errors}
                status='errors'
              />
            ),
          },
        ]}
      />
    );
  });

  const [dateSelect, setDateRange] = useState('1hr');
  const { promiseInProgress } = usePromiseTracker();

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
    if (props.aws.functionLogs) {
      const reqParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: props.aws.functionLogs,
          newTimePeriod: e.target.value,
          credentials: props.credentials,
        }),
      };
      trackPromise(fetch('/aws/updateLogs', reqParams))
        .then((res) => res.json())
        .then((updatedLogs) => {
          props.updateFunctionLogs(updatedLogs);
        })
        .catch((err) => console.log('Error in refreshing updateLogs: ', err));
    }
  };

  return (
    <div className={classes.logGrid}>
      <div className={classes.sortBy}>
        <FormControl className={classes.timeRange}>
          <InputLabel htmlFor='date-change-select' className={classes.dateSpec}>
            {' '}
            <DateRange /> Time Period
          </InputLabel>
          <br />
          <Select
            id='date-change-select'
            value={dateSelect}
            className={classes.dateSpec}
            onChange={handleDateChange}
          >
            <MenuItem value='30min' className={classes.dateSpec}>
              Last 30 Minutes
            </MenuItem>
            <MenuItem value='1hr' className={classes.dateSpec}>
              Last Hour
            </MenuItem>
            <MenuItem value='24hr' className={classes.dateSpec}>
              Last 24 Hours
            </MenuItem>
            <MenuItem value='7d' className={classes.dateSpec}>
              Last 7 Days
            </MenuItem>
            <MenuItem value='14d' className={classes.dateSpec}>
              Last 14 Days
            </MenuItem>
            <MenuItem value='30d' className={classes.dateSpec}>
              Last 30 Days
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <br />
      <GridContainer>
        <GridItem xs={4} sm={4} md={4}>
          <CustomTabs
            // title='Lambda Functions:'
            headerColor='info'
            tabs={[
              {
                tabName: 'Lambda Functions',
                tabIcon: Cloud,
                tabContent: (
                  <LambdaList
                    logsShown={logsShown}
                    functions={props.aws.functions}
                    credentials={props.credentials}
                    addFunctionLogs={props.addFunctionLogs}
                    removeFunctionLogs={props.removeFunctionLogs}
                    timePeriod={dateSelect}
                    updatePromise={promiseInProgress}
                  />
                ),
              },
            ]}
          />
        </GridItem>

        <GridItem xs={8} sm={8} md={8}>
          {mappedMsgs}
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
