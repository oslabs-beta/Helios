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
import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';
import LogTable from '../../../components/Table/LogTable.js';
import LambdaList from '../../../components/LambdaList/LambdaList.js';
import CustomTabs from '../../../components/CustomTabs/CustomTabs.js';
import Danger from '../../../components/Typography/Danger.js';
import LogCard from '../../../components/Card/LogCard.js';
import CardHeader from '../../../components/Card/CardHeader.js';
import CardIcon from '../../../components/Card/CardIcon.js';
import CardBody from '../../../components/Card/CardBody.js';
import CardFooter from '../../../components/Card/CardFooter.js';
import Card from '../../../components/Card/Card.js';

import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import styles from '../../../assets/jss/material-dashboard-react/views/logsStyle.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';

import LambdaListMetrics from '../../../components/LambdaListMetrics/LambdaListMetrics'

const useStyles = makeStyles(styles);

const getDataByFunc = (metricData, funcName) => {
  console.log('Original Data: ', metricData);

  let data = JSON.parse(JSON.stringify({ ...metricData }));
  let series_data = [...metricData.series];

  series_data = series_data.filter(
    (plotData) =>
      (plotData.name.search(funcName) > 0) | (plotData.name === 'dummy')
  );


  console.log('Function Data: ', data);

  // return data;
  return { series: series_data };
};

const getTotalByFunc = (metricData, funcName) => {

  let series_data  = metricData.series.filter((funcData) => funcData.name.search(funcName) > 0)
  console.log("Series Data for Total: ", series_data)
  let total = series_data[0].total;
  console.log(total)
  if (total>=0) return total

};


function LambdaChartByFunc(props) {

  const {invocationsByFuncData,
    errorsByFuncData,
    throttlesByFuncData,
    funcList,
    dateSelect} = props

  const [lambdaFuncSelected, setLambdaFuncSelected] = useState([]);

  const handleAddFunctionMetrics = funcName => {
    const lambdaFuncList = [...lambdaFuncSelected]
    if (!lambdaFuncList.includes(funcName)) lambdaFuncList.push(funcName)
    setLambdaFuncSelected(lambdaFuncList)
  }

  const handleRemoveFunctionMetrics = funcName => {
    const lambdaFuncList = [...lambdaFuncSelected]
    if (lambdaFuncList.includes(funcName))  {
      const index = lambdaFuncList.indexOf(funcName)
      lambdaFuncList.splice(index,1)

    }
    setLambdaFuncSelected(lambdaFuncList)
  }  



  const classes = useStyles();
  const indexArr = funcList.map((el, i) => {
    return i;
  });

  const mappedMetrics = lambdaFuncSelected.map((funcName, i) => {
    return (
      <CustomTabs
        key={i}
        headerColor='primary'
        tabs={[
          {
            tabName: 'Throttles',
            tabContent: (
              <Card chart>
                <CardHeader color='success'>
                  <ChartistGraph
                    className='ct-chart'
                    data={getDataByFunc(
                      throttlesByFuncData.data,
                      funcName
                    )}
                    type='Bar'
                    options={throttlesByFuncData.options}
                    responsiveOptions={throttlesByFuncData.responsiveOptions}
                    listener={throttlesByFuncData.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                  Throttles: <Box component="span" fontWeight="fontWeightLight" fontStyle="italic">{funcName}</Box>
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {getTotalByFunc(
                      throttlesByFuncData.data,
                      funcName
                    )}
                  </h5>
                </CardFooter>
              </Card>
            ),
          },

          {
            tabName: 'Invocations',
            tabContent: (
              <Card chart>
                <CardHeader color='info'>
                  <ChartistGraph
                    className='ct-chart'
                    data={getDataByFunc(
                      invocationsByFuncData.data,
                      funcName
                    )}
                    type='Bar'
                    options={invocationsByFuncData.options}
                    responsiveOptions={invocationsByFuncData.responsiveOptions}
                    listener={invocationsByFuncData.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                  Invocations: <Box component="span" fontWeight="fontWeightLight" fontStyle="italic">{funcName}</Box>
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {getTotalByFunc(
                      invocationsByFuncData.data,
                      funcName
                    )}
                  </h5>
                </CardFooter>
              </Card>
            ),
          },
          {
            tabName: 'Errors',
            tabContent: (
              <Card chart>
                <CardHeader color='danger'>
                  <ChartistGraph
                    className='ct-chart'
                    data={getDataByFunc(
                      errorsByFuncData.data,
                      funcName
                      
                    )}
                    type='Bar'
                    options={errorsByFuncData.options}
                    responsiveOptions={errorsByFuncData.responsiveOptions}
                    listener={errorsByFuncData.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                  Errors: <Box component="span" fontWeight="fontWeightLight" fontStyle="italic">{funcName}</Box>
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {getTotalByFunc(
                      errorsByFuncData.data,
                      funcName
                    )}
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
                  <LambdaListMetrics
                    checkedIndexes={[]}
                    tasksIndexes={indexArr}
                    tasks={funcList}
                    addFunctionMetrics={handleAddFunctionMetrics}
                    removeFunctionMetrics={handleRemoveFunctionMetrics}
                    timePeriod={dateSelect}
                  />
                ),
              },
            ]}
          />
        </GridItem>

        <GridItem xs={8} sm={8} md={8}>
          {mappedMetrics}
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default LambdaChartByFunc;
