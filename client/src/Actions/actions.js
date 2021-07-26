import * as types from '../Constants/actionTypes';

export const addUserInfo = (userInfo) => {
  console.log(userInfo);
  return { type: types.ADD_USER_INFO, payload: userInfo };
};

export const addArn = (arn) => {
  console.log('Addding ARN: ', arn);
  return { type: types.ADD_ARN, payload: arn };
};

export const addLoginInfo = (userInfo) => {
  console.log('adding login info in action: ', userInfo);
  return { type: types.ADD_LOGIN_INFO, payload: userInfo };
};

export const addCredentials = (credentials) => {
  return { type: types.ADD_CREDENTIALS, payload: credentials };
};

//###############################################
//AWS Reducer All Functions
//###############################################

export const addLambda = (functions) => {
  console.log('inside add Lambda action: ', functions);
  return { type: types.ADD_LAMBDA, payload: functions };
};

export const addFunctionLogs = (logObj) => {
  console.log('inside add function logs action: ', logObj);
  return { type: types.ADD_FUNCTION_LOGS, payload: logObj };
};

export const removeFunctionLogs = (functionName) => {
  return { type: types.REMOVE_FUNCTION_LOGS, payload: functionName };
};


export const addInvocationsAlldata = (invocationsAllData) => {
  console.log('inside add Invocation action: ', invocationsAllData);
  return { type: types.ADD_INVOCATIONS_ALLDATA, payload: invocationsAllData };
};
export const addErrorsAlldata = (errorsAllData) => {
  console.log('inside add Error action: ', errorsAllData);
  return { type: types.ADD_ERRORS_ALLDATA, payload: errorsAllData };
};

export const addThrottlesAlldata = (throttlesAllData) => {
  console.log('inside add Throttle action: ', throttlesAllData);
  return { type: types.ADD_THROTTLES_ALLDATA, payload: throttlesAllData };
};

export const updateRender = () => {
  console.log('inside update Render action: ');
  return { type: types.UPDATE_RENDER };
};

export const updateFetchTime = () => {
  console.log('inside update Render action: ');
  return { type: types.UPDATE_FETCH_TIME };
};

export const updateFunctionLogs = (updatedLogs) => {
  return { type: types.UPDATE_FUNCTION_LOGS, payload: updatedLogs };
};

//###############################################
//AWS Reducer By Function
//###############################################
export const addInvocationsByFuncdata = (invocationsByFuncData) => {
  console.log('inside add Invocation By Func action: ', invocationsByFuncData);
  return { type: types.ADD_INVOCATIONS_BYFUNCDATA, payload: invocationsByFuncData };
};

export const updateFetchTimeByFunc = () => {
  console.log('inside update Fetch Time By Func action: ');
  return { type: types.UPDATE_FETCH_TIME_BYFUNC };
};

export const updateRenderByFunc = () => {
  console.log('inside update Render By Func action: ');
  return { type: types.UPDATE_RENDER_BYFUNC };
};
