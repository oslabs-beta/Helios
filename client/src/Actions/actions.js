import * as types from '../Constants/actionTypes';

export const addUserInfo = (userInfo) => {
  return { type: types.ADD_USER_INFO, payload: userInfo };
};

export const addAwsAccount = (awsDetails) => {
  return { type: types.ADD_AWS_ACCOUNT, payload: awsDetails };
};

export const addRegion = (region) => {
  return { type: types.ADD_REGION, payload: region };
};

export const addLoginInfo = (userInfo) => {
  return { type: types.ADD_LOGIN_INFO, payload: userInfo };
};

export const addCredentials = (reqParams) => {
  return (dispatch) => {
    dispatch(addCredentialsStarted());
    fetch('/aws/getCreds', reqParams)
      .then((res) => res.json())
      .then((credentialsData) => {
        if (!credentialsData.err) {
          dispatch(addCredentialsSuccess(credentialsData));
        }
      })
      .catch((err) => console.error('Error inside getting credentials: ', err));
  };
};

const addCredentialsStarted = () => {
  return { type: types.ADD_CREDENTIALS_STARTED };
};

export const addCredentialsSuccess = (credentials) => {
  return { type: types.ADD_CREDENTIALS, payload: credentials };
};

//###############################################
//AWS Reducer All Functions
//###############################################

export const updateDashboardLoading = () => {
  return { type: types.UPDATE_DASHBOARD_LOADING };
};

export const updateByFunctionLoading = () => {
  return { type: types.UPDATE_BY_FUNCTION_LOADING };
};
export const addLambda = (reqParams) => {
  return (dispatch) => {
    dispatch(addLambdaStarted());

    fetch('/aws/getLambdaFunctions', reqParams)
      .then((res) => res.json())
      .then((functions) => {
        dispatch(addLambdaSuccess(functions));
      })
      .catch((err) => console.error(err));
  };
};

const addLambdaStarted = () => {
  return { type: types.ADD_LAMBDA_STARTED };
};

const addLambdaSuccess = (functions) => {
  return { type: types.ADD_LAMBDA, payload: functions };
};

export const addFunctionLogs = (logObj) => {
  return { type: types.ADD_FUNCTION_LOGS, payload: logObj };
};

export const removeFunctionLogs = (functionName) => {
  return { type: types.REMOVE_FUNCTION_LOGS, payload: functionName };
};

export const addInvocationsAlldata = (invocationsAllData) => {
  return { type: types.ADD_INVOCATIONS_ALLDATA, payload: invocationsAllData };
};
export const addErrorsAlldata = (errorsAllData) => {
  return { type: types.ADD_ERRORS_ALLDATA, payload: errorsAllData };
};

export const addThrottlesAlldata = (throttlesAllData) => {
  return { type: types.ADD_THROTTLES_ALLDATA, payload: throttlesAllData };
};

export const updateRender = () => {
  return { type: types.UPDATE_RENDER };
};

export const updateFetchTime = () => {
  return { type: types.UPDATE_FETCH_TIME };
};

export const updateFunctionLogs = (updatedLogs) => {
  return { type: types.UPDATE_FUNCTION_LOGS, payload: updatedLogs };
};

//###############################################
//AWS Reducer By Function
//###############################################
export const addInvocationsByFuncData = (invocationsByFuncData) => {
  return {
    type: types.ADD_INVOCATIONS_BYFUNCDATA,
    payload: invocationsByFuncData,
  };
};

export const addErrorsByFuncData = (errorsByFuncData) => {
  return { type: types.ADD_ERRORS_BYFUNCDATA, payload: errorsByFuncData };
};

export const addThrottlesByFuncData = (throttlesByFuncData) => {
  return { type: types.ADD_THROTTLES_BYFUNCDATA, payload: throttlesByFuncData };
};

export const updateFetchTimeByFunc = () => {
  return { type: types.UPDATE_FETCH_TIME_BYFUNC };
};

export const updateRenderByFunc = () => {
  return { type: types.UPDATE_RENDER_BYFUNC };
};
export const handleLogout = () => {
  return { type: types.HANDLE_LOGOUT };
};

export const addApiGateways = (reqParams) => {
  return (dispatch) => {
    dispatch(addApiGatewaysStarted());
    fetch('/aws/apiGateway', reqParams)
      .then((res) => res.json())
      .then((apiData) => {
        dispatch(addApiGatewaysSuccess(apiData));
      })
      .catch((err) => console.error('Error inside API Gateway: ', err));
  };
};

const addApiGatewaysStarted = () => {
  return { type: types.ADD_API_GATEWAYS_STARTED };
};

const addApiGatewaysSuccess = (apiData) => {
  return { type: types.ADD_API_GATEWAYS, payload: apiData };
};

export const addApiMetrics = (apiMetrics) => {
  return { type: types.ADD_API_METRIC_CHARTS, payload: apiMetrics };
};

export const removeApiMetrics = (apiName) => {
  return { type: types.REMOVE_API_METRIC_CHARTS, payload: apiName };
};

export const updateApiMetrics = (updatedApiMetrics) => {
  return { type: types.UPDATE_API_METRIC_CHARTS, payload: updatedApiMetrics };
};

export const updateEmail = (updatedEmail) => {
  return { type: types.UPDATE_EMAIL, payload: updatedEmail };
};

export const updateUserDetailsAfterProfileUpdate = (userDetails) => {
  return {
    type: types.UPDATE_USER_DETAILS_AFTER_PROFILE_UPDATE,
    payload: userDetails,
  };
};

export const updateFirstName = (firstName) => {
  return { type: types.UPDATE_NAME, payload: firstName };
};

export const updateArn = (arn) => {
  return { type: types.UPDATE_ARN, payload: arn };
};

export const updateLogsRender = () => {
  return { type: types.UPDATE_LOGS_RENDER };
};

export const updateApiRender = () => {
  return { type: types.UPDATE_API_RENDER };
};

export const updateDashboardTimePeriod = (timePeriod) => {
  return { type: types.UPDATE_DASHBOARD_TIME_PERIOD, payload: timePeriod };
};

export const updateLogsTimePeriod = (timePeriod) => {
  return { type: types.UPDATE_LOGS_TIME_PERIOD, payload: timePeriod };
};

export const updateApiTimePeriod = (timePeriod) => {
  return { type: types.UPDATE_API_TIME_PERIOD, payload: timePeriod };
};
