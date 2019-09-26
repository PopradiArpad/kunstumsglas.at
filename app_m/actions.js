/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


//Action types
  //components -> reducer
    //cms config handling
export const SET_REGISTERING_ALLOWED = 'SET_REGISTERING_ALLOWED';
    //user handling requests
export const IS_LOGGED_IN        = 'IS_LOGGED_IN';
export const LOGIN               = 'LOGIN';
export const LOGOUT              = 'LOGOUT';
export const SIGNUP              = 'SIGNUP';
export const SET_NEW_PASSWORD    = 'SET_NEW_PASSWORD'
    //entity handling requests
export const LOAD_ENTITY        = 'LOAD_ENTITY';
export const BACK               = 'BACK';
export const SAVE_ENTITY        = 'SAVE_ENTITY';
export const REMOVE_ENTITY      = 'REMOVE_ENTITY';
    //error handling
export const ADD_ERROR          = 'ADD_ERROR'; //process -> process
export const ERROR_ACKNOWLEDGED = 'ERROR_ACKNOWLEDGED';
  //processes handling
export const PROCESS_FINISHED_OK    = 'PROCESS_FINISHED_OK';
export const PROCESS_FINISHED_ERROR = 'PROCESS_FINISHED_ERROR';

//action constructors
    //cms config handling
export function SetRegisteringAllowed(value) {
  return {
    type: SET_REGISTERING_ALLOWED,
    value
  }
}
    //user handling requests
export function IsLoggedIn() {
  return {
    type: IS_LOGGED_IN
  }
}

export function Login(name,password) {
  return {
    type: LOGIN,
    name,
    password
  }
}

export function Logout() {
  return {
    type: LOGOUT
  }
}

export function Signup(name,password) {
  return {
    type: SIGNUP,
    name,
    password
  }
}

export function SetNewPassword(password,newPassword) {
  return {
    type: SET_NEW_PASSWORD,
    password,
    newPassword
  }
}

    //entity handling requests
export function LoadEntity(identity) {
  return {
    type: LOAD_ENTITY,
    identity
  }
}

export function Back() {
  return {
    type: BACK
  }
}

export function SaveEntity(entityDescriptionDiff) {
  return {
    type: SAVE_ENTITY,
    entityDescriptionDiff
    //structure
    // {
    //   identity,
    //   propertyDescriptions of the changed properties
    // }
  }
}

export function LoadTemporaryEntity(parentIdentity,parentProperty,dbModel) {
  return {
    type: LOAD_ENTITY,
    identity:{id:'temporary',dbModel},
    parentIdentity,
    parentProperty
  }
}

export function RemoveEntity(identity) {
  return {
    type: REMOVE_ENTITY,
    identity
  }
}


    //error handling
export function AddError(title, errorMessages) {
  return {
    type: ADD_ERROR,
    title,
    errorMessages
  }
}

export function ErrorAcknowledged() {
  return {
    type: ERROR_ACKNOWLEDGED
  }
}

  //processes handling
export function ProcessFinishedOk(processName,result) {
  return {
    type: PROCESS_FINISHED_OK,
    processName,
    result
  }
}

export function ProcessFinishedError(processName,errorMessages) {
  return {
    type: PROCESS_FINISHED_ERROR,
    processName,
    errorMessages
  }
}
