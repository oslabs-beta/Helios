import * as types from '../Constants/actionTypes';

const initialState = {
  email: '',
  firstName: '',
  arn: '',
  credentials: null,
};

const mainReducer = (state = initialState, action) => {
  let email;
  let firstName;
  let arn;
  let credentials;

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

    case types.ADD_ARN: {
      arn = action.payload;
      return {
        ...state,
        arn,
      };
    }

    case types.ADD_LOGIN_INFO: {
      email = action.payload.email;
      firstName = action.payload.firstName;
      arn = action.payload.arn;
      return {
        email,
        firstName,
        arn,
      };
    }

    case types.ADD_CREDENTIALS: {
      credentials = action.payload;
      return {
        ...state,
        credentials,
      };
    }

    default: {
      return state;
    }
  }
};

export default mainReducer;
