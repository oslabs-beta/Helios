import React from 'react';
import { useState } from 'react';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';
import { connect } from 'react-redux';
// @material-ui/core
import { makeStyles } from '@material-ui/core/styles';
// @material-ui/icons
import Cloud from '@material-ui/icons/Cloud';
// core components
import GridItem from '../../../components/Grid/GridItem.js';
import GridContainer from '../../../components/Grid/GridContainer.js';
import CustomTabs from '../../../components/CustomTabs/CustomTabs.js';
import CardHeader from '../../../components/Card/CardHeader.js';
import CardBody from '../../../components/Card/CardBody.js';
import CardFooter from '../../../components/Card/CardFooter.js';
import Card from '../../../components/Card/Card.js';

import styles from '../../../assets/jss/material-dashboard-react/views/logsStyle.js';

import LambdaListMetrics from '../../../components/LambdaListMetrics/LambdaListMetrics';

const useStyles = makeStyles(styles);

const getDataByFunc = (metricData, funcName) => {
  let data = JSON.parse(JSON.stringify({ ...metricData }));
  let series_data = [...metricData.series];

  series_data = series_data.filter(
    (plotData) =>
      (plotData.name.search(funcName) > 0) | (plotData.name === 'dummy')
  );

  // return data;
  return { series: series_data };
};

const getTotalByFunc = (metricData, funcName) => {
  let series_data = metricData.series.filter(
    (funcData) => funcData.name.search(funcName) > 0
  );

  let total = series_data[0].total;

  if (total >= 0) return total;
};

function LambdaChartByFunc(props) {
  const {
    invocationsByFuncData,
    errorsByFuncData,
    throttlesByFuncData,
    funcList,
    dateSelect,
  } = props;

  const [lambdaFuncSelected, setLambdaFuncSelected] = useState([]);

  const handleAddFunctionMetrics = (funcName) => {
    const lambdaFuncList = [...lambdaFuncSelected];
    if (!lambdaFuncList.includes(funcName)) lambdaFuncList.push(funcName);
    setLambdaFuncSelected(lambdaFuncList);
  };

  const handleRemoveFunctionMetrics = (funcName) => {
    const lambdaFuncList = [...lambdaFuncSelected];
    if (lambdaFuncList.includes(funcName)) {
      const index = lambdaFuncList.indexOf(funcName);
      lambdaFuncList.splice(index, 1);
    }
    setLambdaFuncSelected(lambdaFuncList);
  };

  const classes = useStyles();
  const indexArr = funcList.map((el, i) => {
    return i;
  });

  const mappedMetrics = lambdaFuncSelected.map((funcName, i) => {
    return (
      <CustomTabs
        key={i}
        headerColor='info'
        tabs={[
          {
            tabName: 'Throttles',
            tabContent: (
              <Card chart>
                <CardHeader color='success'>
                  <ChartistGraph
                    className='ct-chart'
                    data={getDataByFunc(throttlesByFuncData.data, funcName)}
                    type='Bar'
                    options={throttlesByFuncData.options}
                    responsiveOptions={throttlesByFuncData.responsiveOptions}
                    listener={throttlesByFuncData.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                    {/* Throttles:{' '}
                    <Box
                      component='span'
                      fontWeight='fontWeightLight'
                      fontStyle='italic'
                    >
                      {funcName}
                    </Box> */}
                    <big>Throttles: </big>
                    {funcName}
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {getTotalByFunc(throttlesByFuncData.data, funcName)}
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
                    data={getDataByFunc(invocationsByFuncData.data, funcName)}
                    type='Bar'
                    options={invocationsByFuncData.options}
                    responsiveOptions={invocationsByFuncData.responsiveOptions}
                    listener={invocationsByFuncData.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                    {/* Invocations:{' '}
                    <Box
                      component='span'
                      fontWeight='fontWeightLight'
                      fontStyle='italic'
                    >
                      {funcName}
                    </Box> */}
                    <big>Invocations: </big>
                    {funcName}
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {getTotalByFunc(invocationsByFuncData.data, funcName)}
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
                    data={getDataByFunc(errorsByFuncData.data, funcName)}
                    type='Bar'
                    options={errorsByFuncData.options}
                    responsiveOptions={errorsByFuncData.responsiveOptions}
                    listener={errorsByFuncData.animation}
                  />
                </CardHeader>
                <CardBody>
                  <h3 className={classes.cardTitle}>
                    {/* Errors:{' '}
                    <Box
                      component='span'
                      fontWeight='fontWeightLight'
                      fontStyle='italic'
                    >
                      {funcName}
                    </Box> */}
                    <big>Errors: </big>
                    {funcName}
                  </h3>
                </CardBody>
                <CardFooter chart>
                  <h5 className={classes.cardTitle}>
                    <big>Total: </big>
                    {getTotalByFunc(errorsByFuncData.data, funcName)}
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
