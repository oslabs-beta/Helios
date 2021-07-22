const express = require('express');
const router = express.Router();

//AWS specific details
const getCredentials = require('../controllers/aws/Credentials/getCreds');
const getFunctions = require('../controllers/aws/Metrics/getLambdaFuncs');
const getMetricsAllFunc = require('../controllers/aws/Metrics/getMetricsAllFunc');
const getLogs = require('../controllers/aws/Logs/getLogs');

//AWS Root User Credentials

router
.route("/getCreds")
.post(getCredentials, (req, res) => {
    console.log('you hit get Creds');
    console.log(req.body);
    res.status(200).json(res.locals.credentials);
  });

 //Returing Lambda Functions List
  router
  .route('/getLambdaFunctions')
  .post(getFunctions, (req, res) => {
    console.log("Returning Lambda Functions:")
    res.status(200).json(res.locals.functions);
  });

 //Returing Lambda Functions Total Invocations
 router
 .route('/getMetricsAllfunc/:metricName')
 .post(getMetricsAllFunc, (req, res) => {
  console.log("Returning Lambda Functions Invocations:")
  res.status(200).json(res.locals.metricAllFuncData);
});

// //Returing Lambda Functions Total Invocations
// router
//   .route('/getLambdaInvocationsAllfunc')
//   .post(getInvocationsAllFunc, (req, res) => {
//     console.log('Returning Lambda Functions Invocations:');
//     res.status(200).json(res.locals.invocationsAllFunc);
//   });

//Returing Lambda Functions Logs
router.route('/getLogs').post(getLogs, (req, res) => {
  console.log('Returning Lambda Functions Logs');
  res.status(200).json(res.locals.functionLogs);
});

module.exports = router;
