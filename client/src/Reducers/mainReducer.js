import * as types from '../Constants/actionTypes';

const initialState = {
  email: '',
  firstName: '',
  arn: '',
  region: '',
  credentials: null,
};

const mainReducer = (state = initialState, action) => {
  let email;
  let firstName;
  let arn;
  let credentials;
  let region;

  switch (action.type) {
    case types.ADD_USER_INFO: {
      email = action.payload.email;
      firstName = action.payload.firstName;
      return {
        ...state,
        email,
        firstName,
      };
    }

    case types.ADD_AWS_ACCOUNT: {
      arn = action.payload.arn;
      region = action.payload.region;
      return {
        ...state,
        arn,
        region,
      };
    }

    case types.ADD_REGION: {
      region = action.payload;
      return {
        ...state,
        region,
      };
    }

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

    case types.ADD_CREDENTIALS: {
      credentials = action.payload;
      return {
        ...state,
        credentials,
      };
    }

    case types.HANDLE_LOGOUT: {
      return {
        email: '',
        firstName: '',
        arn: '',
        credentials: null,
      };
    }

    default: {
      return state;
    }
  }
};

export default mainReducer;
