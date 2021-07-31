import React from "react";
import { useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import { connect } from "react-redux";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

import DateRange from "@material-ui/icons/DateRange";

// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import LogTable from "../../components/Table/LogTable.js";
import APIList from "../../components/APIList/APIList.js";
import CustomTabs from "../../components/CustomTabs/CustomTabs.js";
import Danger from "../../components/Typography/Danger.js";
import LogCard from "../../components/Card/LogCard.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import Card from "../../components/Card/Card.js";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import * as actions from "../../../Actions/actions";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import styles from "../../assets/jss/material-dashboard-react/views/apiStyle.js";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import { latencyChart } from "../../variables/apiCharts";
import getArnArrayIDB from "../../../indexedDB/getArnArrayIDB.js";
import getUserInfoArrayIDB from "../../../indexedDB/getUserInfo.js";
import getRegionIDB from "../../../indexedDB/getRegionIDB";
import { useLiveQuery } from "dexie-react-hooks";
const useStyles = makeStyles(styles);

const mapStateToProps = (state) => ({
  arn: state.main.arn,
  credentials: state.main.credentials,
  region: state.main.region,
  aws: state.aws,
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({
  addCredentials: (userInfo) => dispatch(actions.addCredentials(userInfo)),
  addApiGateways: (apiData) => dispatch(actions.addApiGateways(apiData)),
  addApiMetrics: (apiData) => dispatch(actions.addApiMetrics(apiData)),
  removeApiMetrics: (apiName) => dispatch(actions.removeApiMetrics(apiName)),
  updateApiMetrics: (updatedList) =>
    dispatch(actions.updateApiMetrics(updatedList)),
  updateRender: () => dispatch(actions.updateRender()),
  updateFirstName: (name) => dispatch(actions.updateFirstName(name)),
  updateArn: (arn) => dispatch(actions.updateArn(arn)),
  addRegion: (region) => dispatch(actions.addRegion(region)),
  addCredentials: (credentials) =>
    dispatch(actions.addCredentials(credentials)),
  updateEmail: (newEmail) => dispatch(actions.updateEmail(newEmail)),
});

function APIGateway(props) {
  const classes = useStyles();
  const [dateSelect, setDateRange] = useState("1hr");
  const arnArray = useLiveQuery(getArnArrayIDB);
  const userInfoArray = useLiveQuery(getUserInfoArrayIDB);
  const regionArray = useLiveQuery(getRegionIDB);

  // after refresh, fetches user region from IndexedDB and updates state
  useEffect(() => {
    if (regionArray && regionArray[0]) {
      props.addRegion(regionArray[0].region);
    }
  }, [regionArray]);

  // after refresh, credentials disappear and have to be refetched based off the arn
  // grabs user arn from IndexedDB and then gets new credentials and updates state
  // with both arn and new credentials
  useEffect(() => {
    if (!props.credentials) {
      if (arnArray && arnArray[0]) {
        props.updateArn(arnArray[0].arn);
        const reqParams = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            arn: arnArray[0].arn,
          }),
        };

        fetch("/aws/getCreds", reqParams)
          .then((res) => res.json())
          .then((credentialsData) => {
            console.log("logging from useEffect fetch: ", credentialsData);
            if (!credentialsData.err) {
              props.addCredentials(credentialsData);
            }
          })
          .catch((err) =>
            console.log("Error inside initial get credentials fetch: ", err)
          );
      }
    }
  }, [arnArray]);

  // after a refresh this fetches the user info from IndexedDB and then updates state again
  useEffect(() => {
    if (userInfoArray && userInfoArray[0]) {
      props.updateEmail(userInfoArray[0].email);
      props.updateFirstName(userInfoArray[0].firstName);
    }
  }, [userInfoArray]);

  // if time period is adjusted, this updates the metrics for the currently displayed apis
  const handleDateChange = (e) => {
    setDateRange(e.target.value);
    if (props.api.apiMetrics) {
      const reqParams = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiList: props.api.apiMetrics,
          newTimePeriod: e.target.value,
          credentials: props.credentials,
          region: props.region,
        }),
      };
      fetch("/aws/updateApiMetrics", reqParams)
        .then((res) => res.json())
        .then((updatedApiMetrics) => {
          console.log(updatedApiMetrics);
          props.updateApiMetrics(updatedApiMetrics);
        })
        .catch((err) =>
          console.log("Error in refreshing update API Metrics: ", err)
        );
    }
  };

  // if props has been updated, this refetches the APIs that exists on the account to be displayed
  // props.addApiGateways sets props.api.render to false so it doesn't run continously
  // only runs again after a refresh
  if (props.region && props.credentials && props.api.render) {
    const apiGatewayReqParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        credentials: props.credentials,
        region: props.region,
      }),
    };
    fetch("/aws/apiGateway", apiGatewayReqParams)
      .then((res) => res.json())
      .then((apiData) => {
        props.addApiGateways(apiData);
      })
      .catch((err) =>
        console.log("Error inside API Gateway useEffect fetch: ", err)
      );
  }

  // creates an array of which apis are currently checked
  // when a user navigates away from this page and then back, this ensures the original
  // checked apis remain checked and persist
  const apiMetricsShown = props.api.apiMetrics.map((api) => {
    return api.name;
  });

  // loops through the checked apis and creates the four charts for them in separate tabs
  // on their own card so users can see multiple api metrics at the same time
  const mappedMetrics = props.api.apiMetrics.map((apiName, i) => {
    return (
      <CustomTabs
        key={i}
        headerColor="info"
        tabs={[
          {
            tabName: "Latency",
            tabContent: (
              <Card chart>
                <CardHeader color="success">
                  <ChartistGraph
                    className="ct-chart"
                    data={apiName.Latency.data}
                    type="Bar"
                    options={apiName.Latency.options}
                    responsiveOptions={apiName.Latency.responsiveOptions}
                    listener={apiName.Latency.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                    {apiName.name} API Latency
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {apiName.Latency.total} <small>ms</small>
                  </h5>
                </CardFooter>
              </Card>
            ),
          },
          {
            tabName: "Count",
            tabContent: (
              <Card chart>
                <CardHeader color="success">
                  <ChartistGraph
                    className="ct-chart"
                    data={apiName.Count.data}
                    type="Bar"
                    options={apiName.Count.options}
                    responsiveOptions={apiName.Count.responsiveOptions}
                    listener={apiName.Count.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                    {apiName.name} API Count
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {apiName.Count.total}
                  </h5>
                </CardFooter>
              </Card>
            ),
          },
          {
            tabName: "5XX",
            tabContent: (
              <Card chart>
                <CardHeader color="success">
                  <ChartistGraph
                    className="ct-chart"
                    data={apiName["5XX"].data}
                    type="Bar"
                    options={apiName["5XX"].options}
                    responsiveOptions={apiName["5XX"].responsiveOptions}
                    listener={apiName["5XX"].animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>{apiName.name} API 5XX</h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {apiName["5XX"].total}
                  </h5>
                </CardFooter>
              </Card>
            ),
          },
          {
            tabName: "4XX",
            tabContent: (
              <Card chart>
                <CardHeader color="success">
                  <ChartistGraph
                    className="ct-chart"
                    data={apiName["4XX"].data}
                    type="Bar"
                    options={apiName["4XX"].options}
                    responsiveOptions={apiName["4XX"].responsiveOptions}
                    listener={apiName["4XX"].animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>{apiName.name} API 4XX</h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {apiName["4XX"].total}
                  </h5>
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
      {/* Time Period dropdown bar */}
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

      {/* List of existing APIs on user's AWS account */}
      <GridContainer>
        <GridItem xs={4} sm={4} md={4}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Rest APIs</h4>
            </CardHeader>
            <CardBody>
              {/* sends to APIList to organize the list */}
              <APIList
                apiList={props.api.apiKeys}
                apiMetricsShown={apiMetricsShown}
                timePeriod={dateSelect}
                credentials={props.credentials}
                region={props.region}
                addApiMetrics={props.addApiMetrics}
                removeApiMetrics={props.removeApiMetrics}
              />
            </CardBody>
          </Card>
        </GridItem>

        {/* Our mapped metric cards (each API will have their own card and then four tabs
        containing each of the API's metric charts) */}
        <GridItem xs={8} sm={8} md={8}>
          {mappedMetrics}
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(APIGateway);
