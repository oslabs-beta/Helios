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
import Speed from '@material-ui/icons/Speed';
// core components
import GridItem from '../../components/Grid/GridItem.js';
import GridContainer from '../../components/Grid/GridContainer.js';
import Table from '../../components/Table/Table.js';
import Tasks from '../../components/Tasks/Tasks.js';
import CustomTabs from '../../components/CustomTabs/CustomTabs.js';
import Danger from '../../components/Typography/Danger.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardIcon from '../../components/Card/CardIcon.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import * as actions from '../../../Actions/actions';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import metricAllFuncBarChart from '../../variables/metricAllFuncBarChart.js';
import metricByFuncBarChart from '../../variables/metricByFuncBarChart.js';
import FetchTime from '../../components/FetchTime/FetchTime.js';
import DataTable from '../TableList/LambdaMetrics.js';
import LambdaChartByFunc from './ChartByFunction/ChartsByFunction';

import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle.js';
import getArnArrayIDB from '../../../indexedDB/getArnArrayIDB.js';
import getRegionIDB from '../../../indexedDB/getRegionIDB';
import getUserInfoArrayIDB from '../../../indexedDB/getUserInfo.js';
import { useLiveQuery } from 'dexie-react-hooks';

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  arn: state.main.arn,
  credentials: state.main.credentials,
  region: state.main.region,
  aws: state.aws,
  invocationsAllData: state.aws.invocationsAllData,
  errorsAllData: state.aws.errorsAllData,
  throttlesAllData: state.aws.throttlesAllData,
  dashboardLoading: state.aws.dashboardLoading,
  awsByFunc: state.awsByFunc,
  invocationsByFuncData: state.awsByFunc.invocationsByFuncData,
  errorsByFuncData: state.awsByFunc.errorsByFuncData,
  throttlesByFuncData: state.awsByFunc.throttlesByFuncData,
});

const mapDispatchToProps = (dispatch) => ({
  addCredentials: (userInfo) => dispatch(actions.addCredentials(userInfo)),
  addLambda: (functions) => dispatch(actions.addLambda(functions)),
  addRegion: (region) => dispatch(actions.addRegion(region)),
  addInvocationsAlldata: (invocationsAllData) =>
    dispatch(actions.addInvocationsAlldata(invocationsAllData)),
  addErrorsAlldata: (errorsAllData) =>
    dispatch(actions.addErrorsAlldata(errorsAllData)),
  addThrottlesAlldata: (throttlesAllData) =>
    dispatch(actions.addThrottlesAlldata(throttlesAllData)),
  updateRender: () => dispatch(actions.updateRender()),
  updateFetchTime: () => dispatch(actions.updateFetchTime()),

  addInvocationsByFuncData: (invocationsByFuncData) =>
    dispatch(actions.addInvocationsByFuncData(invocationsByFuncData)),
  addErrorsByFuncData: (errorsByFuncData) =>
    dispatch(actions.addErrorsByFuncData(errorsByFuncData)),
  addThrottlesByFuncData: (throttlesByFuncData) =>
    dispatch(actions.addThrottlesByFuncData(throttlesByFuncData)),
  updateRenderByFunc: () => dispatch(actions.updateRenderByFunc()),
  updateFetchTimeByFunc: () => dispatch(actions.updateFetchTimeByFunc()),
  updateEmail: (email) => dispatch(actions.updateEmail(email)),
  updateFirstName: (name) => dispatch(actions.updateFirstName(name)),
  updateArn: (arn) => dispatch(actions.updateArn(arn)),
  updateDashboardTimePeriod: (timePeriod) =>
    dispatch(actions.updateDashboardTimePeriod(timePeriod)),
  updateDashboardLoading: () => {
    dispatch(actions.updateDashboardLoading());
  },
  updateByFunctionLoading: () => {
    dispatch(actions.updateByFunctionLoading());
  },
});

function Dashboard(props) {
  const classes = useStyles();

  const arnArray = useLiveQuery(getArnArrayIDB);
  const userInfoArray = useLiveQuery(getUserInfoArrayIDB);
  const regionArray = useLiveQuery(getRegionIDB);

  const [dateSelect, setDateRange] = useState('7d');
  const [funcSelect, setFuncName] = useState('None');

  useEffect(() => {
    if (userInfoArray && userInfoArray[0]) {
      props.updateEmail(userInfoArray[0].email);
      props.updateFirstName(userInfoArray[0].firstName);
    }
  }, [userInfoArray]);

  useEffect(() => {
    if (regionArray && regionArray[0]) {
      props.addRegion(regionArray[0].region);
    }
  }, [regionArray]);

  useEffect(() => {
    if (!props.credentials) {
      // check before accessing arnArray, because
      // it can be undefined if IDB is not yet ready
      if (arnArray && arnArray[0]) {
        props.updateArn(arnArray[0].arn);
        const reqParams = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            arn: arnArray[0].arn,
          }),
        };
        props.addCredentials(reqParams);
      }
    }
  }, [arnArray]);

  useEffect(() => {
    if (
      props.aws.render &&
      props.credentials &&
      props.region &&
      !props.dashboardLoading
    ) {
      props.updateDashboardLoading();
      metricAllFuncBarChart(props, dateSelect, props.region);
    }
  }, [props.credentials, props.aws.render]);

  //fetch by Func metrics
  useEffect(() => {
    if (
      props.awsByFunc.renderByFunc &&
      props.credentials &&
      props.aws.functions.length &&
      props.region &&
      !props.awsByFunc.byFuncLoading
    ) {
      props.updateByFunctionLoading();
      metricByFuncBarChart(props, dateSelect, props.region);
    }
  }, [props.aws.functions]);

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
    props.updateDashboardTimePeriod(e.target.value);
    props.updateRender();
    props.updateRenderByFunc();
  };

  let timePeriod;

  if (dateSelect === '7d') {
    timePeriod = 'Last 7 Days';
  } else if (dateSelect === '30min') {
    timePeriod = 'Last 30 Minutes';
  } else if (dateSelect === '1hr') {
    timePeriod = 'Last Hour';
  } else if (dateSelect === '24hr') {
    timePeriod = 'Last 24 Hours';
  } else if (dateSelect === '14d') {
    timePeriod = 'Last 14 Days';
  } else if (dateSelect === '30d') {
    timePeriod = 'Last 30 Days';
  } else {
    timePeriod = 'Invalid Time Period';
  }

  return (
    <div>
      <div className={classes.sortBy}>
        <FormControl className={classes.timeRange}>
          <InputLabel htmlFor='date-change-select' className={classes.dateSpec}>
            {' '}
            <DateRange /> Time Period
          </InputLabel>
          <br />
          <Select
            id='date-change-select'
            value={props.aws.dashboardTimePeriod}
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
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color='success' stats icon>
              <CardIcon color='success'>
                <Speed />
              </CardIcon>
              <p className={classes.cardCategory}>Total Throttles</p>
              <h3 className={classes.cardTitle}>
                {props.throttlesAllData.total}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {timePeriod}
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color='info' stats icon>
              <CardIcon color='info'>
                <Cloud />
              </CardIcon>
              <p className={classes.cardCategory}>Total Invocations</p>
              <h3 className={classes.cardTitle}>
                {props.invocationsAllData.total}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {timePeriod}
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color='danger' stats icon>
              <CardIcon color='danger'>
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Errors</p>
              <h3 className={classes.cardTitle}>{props.errorsAllData.total}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                {timePeriod}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color='success'>
              <ChartistGraph
                className='ct-chart'
                data={props.throttlesAllData.data}
                type='Bar'
                options={props.throttlesAllData.options}
                responsiveOptions={props.throttlesAllData.responsiveOptions}
                listener={props.throttlesAllData.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Total Throttles</h4>
            </CardBody>
            <CardFooter chart>
              <FetchTime lastMetricFetchTime={props.aws.lastMetricFetchTime} />
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color='info'>
              <ChartistGraph
                className='ct-chart'
                data={props.invocationsAllData.data}
                type='Bar'
                options={props.invocationsAllData.options}
                responsiveOptions={props.invocationsAllData.responsiveOptions}
                listener={props.invocationsAllData.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Total Invocations</h4>
            </CardBody>
            <CardFooter chart>
              <FetchTime lastMetricFetchTime={props.aws.lastMetricFetchTime} />
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color='danger'>
              <ChartistGraph
                className='ct-chart'
                data={props.errorsAllData.data}
                type='Bar'
                options={props.errorsAllData.options}
                responsiveOptions={props.errorsAllData.responsiveOptions}
                listener={props.errorsAllData.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Total Errors</h4>
              <p className={classes.cardCategory}>Errors</p>
            </CardBody>
            <CardFooter chart>
              <FetchTime lastMetricFetchTime={props.aws.lastMetricFetchTime} />
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color='info'>
              <h4 className={classes.cardTitleWhite}>
                Metric Totals by Lambda Function
              </h4>
            </CardHeader>
            <CardBody>
              <DataTable
                funcNames={props.aws.functions}
                invocations={props.invocationsByFuncData.data}
                errors={props.errorsByFuncData.data}
                throttles={props.throttlesByFuncData.data}
              />
            </CardBody>
            <CardFooter chart>
              <FetchTime lastMetricFetchTime={props.aws.lastMetricFetchTime} />
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <LambdaChartByFunc
        invocationsByFuncData={props.invocationsByFuncData}
        errorsByFuncData={props.errorsByFuncData}
        throttlesByFuncData={props.throttlesByFuncData}
        funcList={props.aws.functions}
        dateSelect={dateSelect}
      />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
