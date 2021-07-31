// #######################################
// Lambda Metrics All Function Totals
// #######################################

const metricByFuncBarChart = (props, timePeriod) => {

  console.log("AWS Get Invocations By Func: ", props.awsByFunc.getInvocations);
  console.log("AWS Render By Func: ",props.awsByFunc.render )
  console.log("Credentials: ", props.credentials)

  console.log('data before if: ', props.awsByFunc.invocationsByFuncData);
  // if (props.aws.render && props.credentials) {
    const reqParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        credentials: props.credentials,
        timePeriod: timePeriod,
        funcNames: props.aws.functions,
        // funcNames: funcNameArray
        }),
    };

//Invocations
//********************************************************* */
    fetch('/aws/getMetricsByFunc/Invocations', reqParams)
      .then((res) => res.json())
      .then((invocationData) => {
        console.log("Invocations Data By Func from Server: ", invocationData)

        props.addInvocationsByFuncData(invocationData);
        console.log("Printing from Inside By Func Invocations Bar Chart Func: ", props.invocationsByFuncData)

      })
      .catch((err) => console.log(err));




//Errors
//********************************************************* */
    fetch('/aws/getMetricsByFunc/Errors', reqParams)
      .then((res) => res.json())
      .then((errorData) => {

        console.log("Invocations Data By Func from Server: ", errorData)

        props.addErrorsByFuncData(errorData);
        
        console.log("Printing from Inside Errors Bar Chart: ", props.errorsByFuncData)

      })
      .catch((err) => console.log(err));

// //Throttles
// //********************************************************* */

      fetch('/aws/getMetricsByFunc/Throttles', reqParams)
      .then((res) => res.json())
      .then((throttleData) => {

        props.addThrottlesByFuncData(throttleData);

// //COME BACK HERE to check on this

//         props.updateFetchTime()

//         console.log("Printing from Inside Throttles Bar Chart: ", props.throttlesByFuncData)

      })
      .catch((err) => console.log(err));


};

export default metricByFuncBarChart;
