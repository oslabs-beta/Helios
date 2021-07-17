import * as types from '../Constants/actionTypes';

const initialState = {
  email: '',
  firstName: '',
  arn: '',
};

const mainReducer = (state = initialState, action) => {
  let email;
  let firstName;
  let arn;
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
      arn = action.payload.arn;
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

    default: {
      return state;
    }
  }
};

export default mainReducer;
