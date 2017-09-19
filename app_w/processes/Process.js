/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { ProcessFinishedOk, ProcessFinishedError } from '../actions';

let dispatch;

/*
  The Process objects make a pure prototypical hierarchy.
*/
const Process = {
  setDispatch(storeDispatch) {
    dispatch = storeDispatch;
  },

  initProcess(name) {
    //Why not simple constructor.name ?
    //Because the uglification gives the same name for different constructors
    this.name = name;

    //instance methods
    this.dispatchProcessFinishedOk = this.dispatchProcessFinishedOk.bind(this);
    this.dispatchProcessFinishedError = this.dispatchProcessFinishedError.bind(this);
  },

  dispatchProcessFinishedOk(result) {
    dispatch(new ProcessFinishedOk(this.name, result));
  },

  dispatchProcessFinishedError(error) {
    let errorMessages = [];

    if (error && error.errorMessages && Array.isArray(error.errorMessages)) {
      errorMessages = error.errorMessages;
    } else {
      errorMessages = ['Unbekantes Fehlerformat. Sehe log!'];
      console.error('error:');
      console.error(error);
    }

    dispatch(new ProcessFinishedError(this.name, errorMessages));
  }
};

export default Process;
