const AWS = require('aws-sdk');

AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: 'work-account',
});

var sts = new AWS.STS({
  apiVersion: '2011-06-15',
  httpOptions: { xhrAsync: false },
});

AWS.config.update({ region: 'us-east-2' });

const roleParams = {
  RoleArn: 'arn:aws:iam::142167254676:role/HeliosDelegationRole',
  RoleSessionName: 'testingSessionWork',
};

const assumedRole = sts.assumeRole(roleParams, function (err, data) {
  if (err) console.log('ERROR IN ASSUME ROLE: ', err, err.stack);
  else console.log('Assumed Role Data: ', data, '\n\n');
});

assumedRole.on('complete', function (response) {
  const accessKeyId = response.data.Credentials.AccessKeyId;
  const secretAccessKey = response.data.Credentials.SecretAccessKey;
  const sessionToken = response.data.Credentials.SessionToken;
  const credentials = { accessKeyId, secretAccessKey, sessionToken };
  var lambda = new AWS.Lambda({
    credentials,
  });

  var lamParams = { FunctionVersion: 'ALL' };
  let funcNames = [];

  lambda.listFunctions(lamParams, function (err, data) {
    if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
    else {
      funcNames = data.Functions.map((el) => el.FunctionName)
      const cw = new AWS.CloudWatch({ apiVersion: '2010-08-01', credentials });



      let metrics = [
        {
          name: 'Invocations',
          Stat: 'Sum',
        },
        {
          name: 'Errors',
          Stat: 'Sum',
        },
        {
          name: 'Throttles',
          Stat: 'Sum',
        },
      ];
    
    
    //inputs from the FrontEnd
      let period = 2 * 7 * 24 * 3600; // Two Weeks in seconds: this will be a input from the Front End
      let interval = 3600 //1 hr in secs: this will be a input from the Front End (graph unit)
    
    //define the End and Start times in UNIX time Stamp format for getMetricsData method
      //Rounded off to nearest 15 min
      let EndTime = Math.round(new Date().getTime() / 1000/60/60)*60*60; //current time in Unix TimeStamp
      let StartTime = EndTime - period;
    
    //initialize the parameters
      let getMetricsParams = {
        StartTime,
        EndTime,
        LabelOptions: {
          Timezone: '-0400',
        },
        MetricDataQueries: [
        
        ],
      };
      //initiate a counter
      let counter = 0;
    
    //programatically update the data queries array of the parameters
      for(metric of metrics) {
        console.log(metric)
        funcNames.forEach((func) => {
          let MetricDataQuery = {
            Id: `m${counter}`,
            Label: `Lambda ${metric.name} ${func}`,
            MetricStat: {
              Metric: {
                Namespace: 'AWS/Lambda',
                MetricName: `${metric.name}`,
                Dimensions: [
                  {
                    Name: `FunctionName`,
                    Value: `${func}`
                  }
                ]
              },
              Period: interval,
              Stat: `${metric.Stat}`
            }
    
          }
          getMetricsParams.MetricDataQueries.push(MetricDataQuery) //Add the Data queries for the getMetricsData method
          counter++
    
    
    
        })
    
    
      }

      console.log('getMetricsParams: ', getMetricsParams)
    
    
      cw.getMetricData(getMetricsParams, function (err, data) {
        if (err) {
          console.log('Error in CW getMetricsData', err);
        } else {
          console.log('Get Metrics Data:  ', JSON.stringify(data, null, 2));
        }
      });


      console.log(
        'LAMBDA DATA FROM THE ACCOUNT WE ASSUMED A NEW ROLE FOR: ',
        funcNames,
        '\n**************\n'
      );
    }
  });

  // lambda
  // .listFunctions(lamParams)
  // .then((data) => {
  //   funcNames = data.Functions.map((el) => el.FunctionName)
  //   console.log(
  //     'LAMBDA DATA FROM THE ACCOUNT WE ASSUMED A NEW ROLE FOR: ',
  //     funcNames,
  //     '\n**************\n'
  //   );

  // })
  // .catch((err) => {
  //   console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
  // })



});

let outsideLambda = new AWS.Lambda();

let outsideLamParams = { FunctionVersion: 'ALL', MaxItems: 5 };

outsideLambda.listFunctions(outsideLamParams, function (err, data) {
  if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
  else
    console.log(
      '\n******------******\n',
      'Data from the Parent Lambda Functions: ',
      data,
      '\n******------******\n'
    );
});

