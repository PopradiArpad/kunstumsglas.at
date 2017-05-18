/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {ProcessFinishedOk,
        ProcessFinishedError} from '../actions';

let dispatch;

function Process(name) {
  //Why not simple constructor.name ?
  //Because the uglification gives the same name for different constructors
  this.name = this.constructor.processName;
}

Process.prototype = {
  constructor:Process,

  dispatchProcessFinishedOk(result) {
    dispatch(new ProcessFinishedOk(this.name,result));
  },

  dispatchProcessFinishedError(error) {
    let  errorMessages = [];

    if (error && error.errorMessages && Array.isArray(error.errorMessages)) {
      errorMessages = error.errorMessages;
    } else {
      errorMessages = ['Unbekantes Fehlerformat. Sehe log!']
      console.error('error:');
      console.error(error);
    }

    dispatch(new ProcessFinishedError(this.name,errorMessages));
  },
};

Process.setDispatch = function (storeDispatch) {
  dispatch = storeDispatch;
}


export default Process;
