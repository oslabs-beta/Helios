const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

const { STS, STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');
const {
  Lambda,
  LambdaClient,
  ListFunctionsCommand,
} = require('@aws-sdk/client-lambda');


const roleParams = {
  RoleArn: 'arn:aws:iam::142167254676:role/HeliosDelegationRole',
  RoleSessionName: 'testingSessionWork',
};

const provider = fromIni({
  profile: 'work-account',
});

console.log(provider);

const region = 'us-east-2';

const sts = new STS({
  region: region,
  credentials: provider,
});

console.log(sts.Credentials);


async function assume(
  provider = provider,
  region = region,
  assumedParams = roleParams
) {
  const sts = new STS({
    region: region,
    credentials: provider,
  });
  console.log(sts.Credentials);

  // const stsCommand = new AssumeRoleCommand(roleParams);
  const result = await sts.assumeRole(assumedParams);
  console.log(result);

  return ({
    accessKeyId: String(result.Credentials.AccessKeyId),
    secretAccessKey: String(result.Credentials.SecretAccessKey),
    sessionToken: result.Credentials.SessionToken,
  });
}

const assumedRoleCredentials = {
  credentials: fromIni({ roleAssumer: assume }),
};

async function func1() {
  // use the provider that can assume roles for the client
  const lambda = new Lambda({
    region: 'us-east-2',
    //credentials: provider,
    credentials: fromIni({ roleAssumer: assume }),
  });
  const lamParams = { FunctionVersion: 'ALL' };
  const command = new ListFunctionsCommand(lamParams);
  try {
    const results = await lambda.listFunctions(lamParams);
    console.log('Lambda Func from Async', results);
  } catch (err) {
    console.error(err);
  }
}

func1();

// const lambda = new Lambda({region: 'us-east-2',
// //credentials: provider,
// // credentials: fromIni({
// //     profile: 'work-account',
// //   })
// });

// lambda.listFunctions(lamParams, function (err, data) {
//     if (err) console.log('ERROR IN LIST FUNCTIONS', err, err.stack);
//     else console.log('LAMBDA DATA FROM THE ACCOUNT WE ASSUMED A NEW ROLE FOR: ', data,'\n**************\n');
//   });

// assume(provider, region, roleParams);

// const sts = new STSClient({
//   region: 'us-east-2',
//   credentialDefaultProvider: provider,
// });

// const stsCommand = new AssumeRoleCommand(roleParams);

// sts
//   .send(stsCommand)
//   .then((data) => {
//     console.log('Assumed Role Data New:  ', data);
//   })
//   .catch((err) => {
//     console.log('ERROR IN ASSUME ROLE: ', err, err.stack);
//   });
