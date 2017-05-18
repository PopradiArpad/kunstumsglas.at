/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {ADD_ERROR,
        ERROR_ACKNOWLEDGED} from '../actions';
import AppError             from '../AppError';
import merge from 'lodash.merge';


const defaultState = {
  currentError:        null,
  additionalErrors:    []
};

const error = (state=defaultState, action) => {
  switch (action.type) {
    case ADD_ERROR:               return addError(state,action);
    case ERROR_ACKNOWLEDGED:      return errorAcknowledged(state);
    default:
      return state;
  }
}

const addError = (state,action) => {
  let appError = new AppError(action.title, action.errorMessages)

  if (! state.currentError)
    return merge({},state,{currentError:appError});
  else {
    let additionalErrors = state.additionalErrors.slice(0);
    additionalErrors.push(appError);
    return merge({},state,{additionalErrors});
  }
}

const errorAcknowledged = (state) => {
  let currentError     = null;
  let additionalErrors = state.additionalErrors.slice(0);

  if (additionalErrors.length) {
    currentError = additionalErrors[0];
    additionalErrors = additionalErrors.slice(1)
  }

  return {
    currentError,
    additionalErrors
  };
}


export default error;
