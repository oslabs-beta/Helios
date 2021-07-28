import React from "react";
import { useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import { connect } from "react-redux";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Speed from "@material-ui/icons/Speed";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Tasks from "../../components/Tasks/Tasks.js";
import CustomTabs from "../../components/CustomTabs/CustomTabs.js";
import Danger from "../../components/Typography/Danger.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import * as actions from "../../../Actions/actions";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";

import { bugs, website, server } from "../../variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
  invocationsChart,
} from "../../variables/charts.js";

<<<<<<< HEAD
import invocationBarChartFunc from "../../variables/invocationBarChart.js";
import errorBarChartFunc from "../../variables/errorBarChart.js";
=======
import metricAllFuncBarChart from '../../variables/metricAllFuncBarChart.js';
import FetchTime from '../../components/FetchTime/FetchTime.js';
>>>>>>> 1014ce3498a27d21971e9134ce2d4018e3e18273

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import getArnArrayIDB from "../../../indexedDB/getArnArrayIDB.js";
import { useLiveQuery } from "dexie-react-hooks";

const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  arn: state.main.arn,
  credentials: state.main.credentials,
  aws: state.aws,
  invocationsAllData: state.aws.invocationsAllData,
  errorsAllData: state.aws.errorsAllData,
  throttlesAllData: state.aws.throttlesAllData,
});

const mapDispatchToProps = (dispatch) => ({
  addCredentials: (userInfo) => dispatch(actions.addCredentials(userInfo)),
  addLambda: (functions) => dispatch(actions.addLambda(functions)),

  addInvocationsAlldata: (invocationsAllData) =>
    dispatch(actions.addInvocationsAlldata(invocationsAllData)),
  addErrorsAlldata: (errorsAllData) =>
    dispatch(actions.addErrorsAlldata(errorsAllData)),
  addThrottlesAlldata: (throttlesAllData) =>
    dispatch(actions.addThrottlesAlldata(throttlesAllData)),
  updateRender: () => dispatch(actions.updateRender()),
  updateFetchTime: () => dispatch(actions.updateFetchTime()),
});

function Dashboard(props) {
  const classes = useStyles();
  console.log("logging from dashboard component (parent): ", props.credentials);
  const [totalInvocations, setInvocationTotal] = useState(0);

  const arnArray = useLiveQuery(getArnArrayIDB);

  // const [lastFetched, setLastFetched] = React.useState(moment(props.lastMetricFetchTime).fromNow());
  console.log('logging from dashboard component (parent): ', props.credentials);

  const [dateSelect, setDateRange] = useState('7d');

  useEffect(() => {
    if (!props.credentials) {
      // check before accessing arnArray, because
      // it can be undefined if IDB is not yet ready
      if (arnArray && arnArray[0]) {
        const reqParams = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ arn: arnArray[0].arn }),
        };

        fetch("/aws/getCreds", reqParams)
          .then((res) => res.json())
          .then((credentialsData) => {
            console.log("logging from useEffect fetch: ", credentialsData);
            props.addCredentials(credentialsData);
          })
          .catch((err) =>
            console.log("Error inside initial get credentials fetch: ", err)
          );
      }
    }
<<<<<<< HEAD

    // setInterval(function() {setLastFetched(moment(props.lastMetricFetchTime).fromNow())}, 60000)
  }, [arnArray]);

  const [dateSelect, setDateRange] = useState("7d");
=======
  }, []);

  if (props.aws.render && props.credentials) {
    metricAllFuncBarChart(props, dateSelect);
  }
>>>>>>> 1014ce3498a27d21971e9134ce2d4018e3e18273

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
    console.log(e.target.value);
    props.updateRender();
  };

  let timePeriod;

  if (dateSelect === "7d") {
    timePeriod = "Last 7 Days";
  } else if (dateSelect === "30min") {
    timePeriod = "Last 30 Minutes";
  } else if (dateSelect === "1hr") {
    timePeriod = "Last Hour";
  } else if (dateSelect === "24hr") {
    timePeriod = "Last 24 Hours";
  } else if (dateSelect === "14d") {
    timePeriod = "Last 14 Days";
  } else if (dateSelect === "30d") {
    timePeriod = "Last 30 Days";
  } else {
    timePeriod = "Invalid Time Period";
  }

  return (
    <div>
      <div className={classes.sortBy}>
        <FormControl className={classes.timeRange}>
          <InputLabel htmlFor="date-change-select" className={classes.dateSpec}>
            {" "}
            <DateRange /> Time Period
          </InputLabel>
          <br />
          <Select
            id="date-change-select"
            value={dateSelect}
            className={classes.dateSpec}
            onChange={handleDateChange}
          >
            <MenuItem value="30min" className={classes.dateSpec}>
              Last 30 Minutes
            </MenuItem>
            <MenuItem value="1hr" className={classes.dateSpec}>
              Last Hour
            </MenuItem>
            <MenuItem value="24hr" className={classes.dateSpec}>
              Last 24 Hours
            </MenuItem>
            <MenuItem value="7d" className={classes.dateSpec}>
              Last 7 Days
            </MenuItem>
            <MenuItem value="14d" className={classes.dateSpec}>
              Last 14 Days
            </MenuItem>
            <MenuItem value="30d" className={classes.dateSpec}>
              Last 30 Days
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <br />
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
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
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
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
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
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

        {/* <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color='warning' stats icon>
              <CardIcon color='warning'>
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Followers</p>
              <h3 className={classes.cardTitle}>+245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem>*/}
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={props.throttlesAllData.data}
                type="Bar"
                options={props.throttlesAllData.options}
                responsiveOptions={props.throttlesAllData.responsiveOptions}
                listener={props.throttlesAllData.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Total Throttles</h4>
            </CardBody>
            <CardFooter chart>
<<<<<<< HEAD
              <div className={classes.stats}>
                <AccessTime /> Last Fetched{" "}
                {moment(props.lastMetricFetchTime).fromNow()}
              </div>
=======
              <FetchTime lastMetricFetchTime={props.aws.lastMetricFetchTime} />
>>>>>>> 1014ce3498a27d21971e9134ce2d4018e3e18273
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="info">
              <ChartistGraph
<<<<<<< HEAD
                className="ct-chart"
                data={invocationBarChartFunc(props, dateSelect).invocationData}
                type="Bar"
=======
                className='ct-chart'
                data={props.invocationsAllData.data}
                type='Bar'
>>>>>>> 1014ce3498a27d21971e9134ce2d4018e3e18273
                options={props.invocationsAllData.options}
                responsiveOptions={props.invocationsAllData.responsiveOptions}
                listener={props.invocationsAllData.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Total Invocations</h4>
            </CardBody>
            <CardFooter chart>
<<<<<<< HEAD
              <div className={classes.stats}>
                <AccessTime /> Last Fetched{" "}
                {moment(props.lastMetricFetchTime).fromNow()}
              </div>
=======
              <FetchTime lastMetricFetchTime={props.aws.lastMetricFetchTime} />
>>>>>>> 1014ce3498a27d21971e9134ce2d4018e3e18273
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={props.errorsAllData.data}
                type="Bar"
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
<<<<<<< HEAD
              <div className={classes.stats}>
                <AccessTime /> Last Fetched{" "}
                {moment(props.lastMetricFetchTime).fromNow()}
              </div>
=======
              <FetchTime lastMetricFetchTime={props.aws.lastMetricFetchTime} />
>>>>>>> 1014ce3498a27d21971e9134ce2d4018e3e18273
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      {/* <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title='Tasks:'
            headerColor='primary'
            tabs={[
              {
                tabName: 'Bugs',
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                  />
                ),
              },
              {
                tabName: 'Website',
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                ),
              },
              {
                tabName: 'Server',
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                ),
              },
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color='warning'>
              <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
              <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor='warning'
                tableHead={['ID', 'Name', 'Salary', 'Country']}
                tableData={[
                  ['1', 'Dakota Rice', '$36,738', 'Niger'],
                  ['2', 'Minerva Hooper', '$23,789', 'Curaçao'],
                  ['3', 'Sage Rodriguez', '$56,142', 'Netherlands'],
                  ['4', 'Philip Chaney', '$38,735', 'Korea, South'],
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer> */}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
