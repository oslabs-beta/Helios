import * as types from '../Constants/actionTypes';

export const addUserInfo = (userInfo) => {
  console.log(userInfo);
  return { type: types.ADD_USER_INFO, payload: userInfo };
};

export const addArn = (arn) => {
  return { type: types.ADD_ARN, payload: arn };
};

export const addLoginInfo = (userInfo) => {
  console.log(userInfo);
  return { type: types.ADD_LOGIN_INFO, payload: userInfo };
};

export const addCredentials = (credentials) => {
  return { type: types.ADD_CREDENTIALS, payload: credentials };
};

export const addLambda = (functions) => {
  console.log('inside add Lambda action: ', functions);
  return { type: types.ADD_LAMBDA, payload: functions };
};

export const addFunctionLogs = (logObj) => {
  console.log('inside add function logs action: ', logObj)
  return {type: types.ADD_FUNCTION_LOGS, payload: logObj}
}

export const removeFunctionLogs = (functionName) => {
  return {type: types.REMOVE_FUNCTION_LOGS, payload: functionName}
}