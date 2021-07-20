import * as types from '../Constants/actionTypes';

const initialState = {
  functions: [],
  render: true,
  functionLogs: []
};

const awsReducer = (state = initialState, action) => {
  let functions;
  let render;
  let functionLogs;
  switch (action.type) {
    case types.ADD_LAMBDA: {
      functions = action.payload;
      render = !state.render;
      return { ...state, functions, render };
    }
    case types.ADD_FUNCTION_LOGS: {
      functionLogs = state.functionLogs.slice(0)
      functionLogs.push(action.payload)
      return {...state, functionLogs}
    }
    case types.REMOVE_FUNCTION_LOGS: {
      functionLogs = state.functionLogs.slice(0)
      for (let i = 0; i < functionLogs.length; i += 1) {
        if (functionLogs[i].name === action.payload) {
          functionLogs.splice(i, 1)
        }
      }
      return {...state, functionLogs}
    }
    default: {
      return state;
    }
  }
};

export default awsReducer;
