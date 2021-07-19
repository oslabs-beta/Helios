import  { fromIni } from '@aws-sdk/credential-provider-ini';
import { STSClient }  from '@aws-sdk/client-sts';

// Set the AWS Region.
export const REGION = 'us-east-2'; //e.g. "us-east-1"
// Create an Amazon CloudWatch Logs service client object.
export const stsClient = new STSClient({
  region: REGION,
  credentials: fromIni({
    profile: 'work-account',
  }),
});
