const { REGION } = require('../libs/stsClient.js');
const AWSUtilFunc = require('../utils/AWSUtilFunc.js');
const {
  CloudWatchClient,
  GetMetricDataCommand,
} = require('@aws-sdk/client-cloudwatch');

//Extract the CloudWatch Metrics for the Lambda Functions
//***********************Begin************************ */

const getInvocationsAllFunc = async (req, res, next) => {
  const cwClient = new CloudWatchClient({
    region: REGION,
    credentials: req.body.credentials,
  });

  let graphPeriod, graphUnits, metricStat;
  [graphPeriod, graphUnits, metricStat] = [7, 'days', 'Sum'];

  //Metrics for All Functions (combined)

  const invocationsAllFuncInput = AWSUtilFunc.prepCwMetricQueryLambdaAllFunc(
    7,
    'days',
    'Invocations',
    'Sum'
  );

  try {
    const invocationsAllFunc = await cwClient.send(
      new GetMetricDataCommand(invocationsAllFuncInput)
    );
    console.log(
      'Invocations All Lambda Functions:  ',
      JSON.stringify(invocationsAllFunc, null, 2)
    );
    res.locals.invocationsAllFunc = {
      title: invocationsAllFunc.MetricDataResults[0].Label,
      labels: invocationsAllFunc.MetricDataResults[0].Timestamps,
      series: [invocationsAllFunc.MetricDataResults[0].Values],
    };
    return next();
  } catch (err) {
    console.log('Error in CW getMetricsData All Functions', err);
  }
};

module.exports = getInvocationsAllFunc;
