import * as types from '../Constants/actionTypes';

const initialState = {
  functions: [],
  render: true,
};

const awsReducer = (state = initialState, action) => {
  let functions;
  let render;
  switch (action.type) {
    case types.ADD_LAMBDA: {
      functions = action.payload;
      render = !state.render;
      return { ...state, functions, render };
    }
    default: {
      return state;
    }
  }
};

export default awsReducer;
