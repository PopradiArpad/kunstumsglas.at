/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import {
  IS_LOGGED_IN,
  LOGIN,
  LOGOUT,
  SIGNUP,
  SET_NEW_PASSWORD,
  PROCESS_FINISHED_OK,
  PROCESS_FINISHED_ERROR,
  AddError,
  LoadEntity
} from '../actions';
import IsLoggedInProcess from '../processes/IsLoggedInProcess';
import LogoutProcess from '../processes/LogoutProcess';
import LoginProcess from '../processes/LoginProcess';
import SignupProcess from '../processes/SignupProcess';
import SetNewPasswordProcess from '../processes/SetNewPasswordProcess';
import merge from 'lodash.merge';

const defaultState = {
  _runningProcess: null,
  user: undefined,
  //structure
  //  {
  //   name      string
  //   //superuser bool
  //  }
  signupSucceeded: null,
  registeringAllowed: false
};

const auth = (state = defaultState, action) => {
  switch (action.type) {
    //from components
    case IS_LOGGED_IN:
      return isLoggedIn(state);
    case LOGIN:
      return login(state, action);
    case LOGOUT:
      return logout(state);
    case SIGNUP:
      return signup(state, action);
    case SET_NEW_PASSWORD:
      return setNewPassword(state, action);
    case PROCESS_FINISHED_OK:
      return processFinishedOk(state, action);
    case PROCESS_FINISHED_ERROR:
      return processFinishedError(state, action);
    //from processes
    default:
      return state;
  }
};

const isLoggedIn = state => {
  return startProcess(state, IsLoggedInProcess);
};

const login = (state, action) => {
  return startProcess(state, LoginProcess, action.name, action.password);
};

const logout = state => {
  return startProcess(state, LogoutProcess);
};

const signup = (state, action) => {
  return startProcess(state, SignupProcess, action.name, action.password);
};

const setNewPassword = (state, action) => {
  return startProcess(
    state,
    SetNewPasswordProcess,
    action.password,
    action.newPassword
  );
};

const processFinishedOk = (state, action) => {
  if (!isMyRunningProcess(state, action)) return state;

  switch (state._runningProcess.name) {
    case IsLoggedInProcess.processName:
      return processOkIsLoggedIn(state, action);
    case LogoutProcess.processName:
      return processOkLogout(state, action);
    case LoginProcess.processName:
      return processOkLogin(state, action);
    case SignupProcess.processName:
      return processOkSignup(state);
    case SetNewPasswordProcess.processName:
      return processOkSetNewPassword(state, action);
  }
};

const processFinishedError = (state, action) => {
  if (!isMyRunningProcess(state, action)) return state;

  dispatchInNextTick(
    new AddError(state._runningProcess.name, action.errorMessages)
  );
  return merge({}, state, { _runningProcess: null });
};

const processOkIsLoggedIn = (state, action) => {
  let result = action.result;
  let user = result.userName ? { name: result.userName } : null;

  if (user)
    dispatchInNextTick(new LoadEntity({ id: 'mainview', dbModel: 'MainView' }));

  return merge(
    {},
    state,
    //remove completely
    {
      user: null
    },
    //merge
    {
      _runningProcess: null,
      user,
      registeringAllowed: result.registeringAllowed
    }
  );
};

const processOkLogout = (state, action) => {
  let result = action.result;

  return merge({}, state, {
    _runningProcess: null,
    user: null,
    registeringAllowed: result.registeringAllowed
  });
};

const processOkLogin = (state, action) => {
  dispatchInNextTick(new LoadEntity({ id: 'mainview', dbModel: 'MainView' }));
  let result = action.result;

  return merge({}, state, {
    _runningProcess: null,
    user: { name: result.userName },
    signupSucceeded: null
  });
};

const processOkSignup = state => {
  return merge({}, state, {
    _runningProcess: null,
    signupSucceeded: true
  });
};

const processOkSetNewPassword = (state, action) => {
  return processOkLogout(state, action);
};

// utils
//--------------
let dispatchInNextTick;

const startProcess = (state, process, p1, p2) => {
  if (state._runningProcess) return state;

  let _runningProcess = process.create();
  _runningProcess.start(p1, p2);

  return merge({}, state, { _runningProcess });
};

const isMyRunningProcess = (state, action) => {
  let _runningProcess = state._runningProcess;

  return _runningProcess && _runningProcess.name === action.processName;
};

auth.setDispatchInNextTick = function(storeDispatchInNextTick) {
  dispatchInNextTick = storeDispatchInNextTick;
};

export default auth;
