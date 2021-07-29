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
import APIList from '../../components/APIList/APIList.js';
import CustomTabs from '../../components/CustomTabs/CustomTabs.js';
import Danger from '../../components/Typography/Danger.js';
import LogCard from '../../components/Card/LogCard.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardIcon from '../../components/Card/CardIcon.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import Card from '../../components/Card/Card.js';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import * as actions from '../../../Actions/actions';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import styles from '../../assets/jss/material-dashboard-react/views/apiStyle.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { latencyChart } from '../../variables/apiCharts';

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  arn: state.main.arn,
  credentials: state.main.credentials,
  aws: state.aws,
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({
  addCredentials: (userInfo) => dispatch(actions.addCredentials(userInfo)),
  addApiGateways: (apiData) => dispatch(actions.addApiGateways(apiData)),
  addApiMetrics: (apiData) => dispatch(actions.addApiMetrics(apiData)),
  removeApiMetrics: (apiName) => dispatch(actions.removeApiMetrics(apiName)),
});

function APIGateway(props) {
  const classes = useStyles();
  const [dateSelect, setDateRange] = useState('1hr');

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
      // fetch('/aws/updateLogs', reqParams)
      //   .then((res) => res.json())
      //   .then((updatedLogs) => {
      //     props.updateFunctionLogs(updatedLogs);
      //   })
      //   .catch((err) => console.log('Error in refreshing updateLogs: ', err));
    }
  };

  useEffect(() => {
    console.log(props.api.apiMetrics);
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentials: props.credentials,
      }),
    };
    fetch('/aws/apiGateway', reqParams)
      .then((res) => res.json())
      .then((apiData) => {
        console.log('logging from API Gateway useEffect fetch: ', apiData);
        props.addApiGateways(apiData);
      })
      .catch((err) =>
        console.log('Error inside API Gateway useEffect fetch: ', err)
      );
  }, []);
  console.log(props.api.apiMetrics);

  const mappedMetrics = props.api.apiMetrics.map((apiName, i) => {
    return (
      <CustomTabs
        key={i}
        headerColor='warning'
        tabs={[
          {
            tabName: 'Latency',
            tabContent: (
              <Card chart>
                <CardHeader color='success'>
                  <ChartistGraph
                    className='ct-chart'
                    data={apiName.Latency.data}
                    type='Bar'
                    options={apiName.Latency.options}
                    responsiveOptions={apiName.Latency.responsiveOptions}
                    listener={apiName.Latency.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>
                    {apiName.name} API Latency
                  </h4>
                </CardBody>
                <CardFooter chart>
                  <p>Total: {apiName.Latency.total}ms</p>
                </CardFooter>
              </Card>
            ),
          },
          {
            tabName: 'Count',
            tabContent: (
              <Card chart>
                <CardHeader color='success'>
                  <ChartistGraph
                    className='ct-chart'
                    data={apiName.Count.data}
                    type='Line'
                    options={apiName.Count.options}
                    responsiveOptions={apiName.Count.responsiveOptions}
                    listener={apiName.Count.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>
                    {apiName.name} API Count
                  </h4>
                </CardBody>
                <CardFooter chart>
                  <p>Total: {apiName.Count.total}</p>
                </CardFooter>
              </Card>
            ),
          },
          {
            tabName: '5XX',
            tabContent: (
              <Card chart>
                <CardHeader color='success'>
                  <ChartistGraph
                    className='ct-chart'
                    data={apiName['5XX'].data}
                    type='Bar'
                    options={apiName['5XX'].options}
                    responsiveOptions={apiName['5XX'].responsiveOptions}
                    listener={apiName['5XX'].animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>{apiName.name} API 5XX</h4>
                </CardBody>
                <CardFooter chart>
                  <p>Total: {apiName['5XX'].total}</p>
                </CardFooter>
              </Card>
            ),
          },
          {
            tabName: '4XX',
            tabContent: (
              <Card chart>
                <CardHeader color='success'>
                  <ChartistGraph
                    className='ct-chart'
                    data={apiName['4XX'].data}
                    type='Bar'
                    options={apiName['4XX'].options}
                    responsiveOptions={apiName['4XX'].responsiveOptions}
                    listener={apiName['4XX'].animation}
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>{apiName.name} API 4XX</h4>
                </CardBody>
                <CardFooter chart>
                  <p>Total: {apiName['4XX'].total}</p>
                </CardFooter>
              </Card>
            ),
          },
        ]}
      />
    );
  });

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
          <Card>
            <CardHeader color='danger'>
              <h4 className={classes.cardTitleWhite}>Rest APIs</h4>
            </CardHeader>
            <CardBody>
              <APIList
                apiList={props.api.apiKeys}
                timePeriod={dateSelect}
                credentials={props.credentials}
                addApiMetrics={props.addApiMetrics}
                removeApiMetrics={props.removeApiMetrics}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={8} sm={8} md={8}>
          {mappedMetrics}
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(APIGateway);
