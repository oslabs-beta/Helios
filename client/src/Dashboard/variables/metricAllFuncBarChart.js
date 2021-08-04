

// ##############################
// Function :
//   Fetch AWS Lambda Metrics (Totals)
//   Update the AWS Reducers
// 
// #############################

const metricAllFuncBarChart = (props, timePeriod, region) => {

  const reqParams = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credentials: props.credentials,
      timePeriod: timePeriod,
      region: region,
    }),
  };

  props.addLambda(reqParams);

  //Invocations
  //********************************************************* */
  fetch('/aws/getMetricsAllfunc/Invocations', reqParams)
    .then((res) => res.json())
    .then((invocationData) => {
      props.addInvocationsAlldata(invocationData);
    })
    .catch((err) => console.error(err));

  //Errors
  //********************************************************* */
  fetch('/aws/getMetricsAllfunc/Errors', reqParams)
    .then((res) => res.json())
    .then((errorData) => {
      props.addErrorsAlldata(errorData);
    })
    .catch((err) => console.error(err));

  //Throttles
  //********************************************************* */

  fetch('/aws/getMetricsAllfunc/Throttles', reqParams)
    .then((res) => res.json())
    .then((throttleData) => {
      props.addThrottlesAlldata(throttleData);

      props.updateFetchTime();
    })
    .catch((err) => console.error(err));
};

export default metricAllFuncBarChart;
