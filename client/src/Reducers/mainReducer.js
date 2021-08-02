import * as types from '../Constants/actionTypes';

const initialState = {
  email: '',
  firstName: '',
  arn: '',
  region: '',
  credentials: null,
  credentialsLoading: false,
};

const mainReducer = (state = initialState, action) => {
  let email;
  let firstName;
  let arn;
  let credentials;
  let region;
  let credentialsLoading;

  switch (action.type) {
    // after signup adds new user's email and firstName to state
    case types.ADD_USER_INFO: {
      email = action.payload.email;
      firstName = action.payload.firstName;
      return {
        ...state,
        email,
        firstName,
      };
    }

    // after registration page, adds details to state
    case types.ADD_AWS_ACCOUNT: {
      arn = action.payload.arn;
      region = action.payload.region;
      return {
        ...state,
        arn,
        region,
      };
    }

    // if region is reset on User Profile page, updaes region in state
    case types.ADD_REGION: {
      region = action.payload;
      return {
        ...state,
        region,
      };
    }

    // after login verification, adds user details to state
    case types.ADD_LOGIN_INFO: {
      email = action.payload.email;
      firstName = action.payload.firstName;
      arn = action.payload.arn;
      region = action.payload.region;
      return {
        email,
        firstName,
        arn,
        region,
      };
    }

    // after refreshes, adds AWS credentials to state
    case types.ADD_CREDENTIALS: {
      credentials = action.payload;
      credentialsLoading = false;
      return {
        ...state,
        credentials,
        credentialsLoading,
      };
    }

    // signals the promise for fetching credentials has started
    case types.ADD_CREDENTIALS_STARTED: {
      credentialsLoading = true;
      return {
        ...state,
        credentialsLoading,
      };
    }

    // if logout is clicked, resets state
    case types.HANDLE_LOGOUT: {
      return {
        ...initialState,
      };
    }

    // if email is updated on User Profile page, updates it in state too
    case types.UPDATE_EMAIL: {
      email = action.payload;
      return {
        ...state,
        email,
      };
    }

    // if ARN is updated on User Profile page, updates it in state too
    case types.UPDATE_ARN: {
      arn = action.payload;
      return {
        ...state,
        arn,
      };
    }

    // if a refresh happens, re-adds name to state
    case types.UPDATE_NAME: {
      firstName = action.payload;
      return {
        ...state,
        firstName,
      };
    }

    // if refresh happens, readds details to state
    case types.UPDATE_USER_DETAILS_AFTER_PROFILE_UPDATE: {
      email = action.payload.email;
      firstName = action.payload.firstName;
      arn = action.payload.arn;
      return {
        ...state,
        email,
        firstName,
        arn,
      };
    }

    default: {
      return state;
    }
  }
};

export default mainReducer;
