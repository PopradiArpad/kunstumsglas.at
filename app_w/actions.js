/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
//Action types
  //components -> reducer
    //locale handling requests
export const SET_LOCALE                  = 'SET_LOCALE';
export const SET_PRODUCT_GROUP           = 'SET_PRODUCT_GROUP';
export const SET_PRODUCT                 = 'SET_PRODUCT';
export const SET_NEXT_PRODUCT            = 'SET_NEXT_PRODUCT';
export const SET_PREVIOUS_PRODUCT        = 'SET_PREVIOUS_PRODUCT';
export const SET_NEXT_PRODUCT_GROUP      = 'SET_NEXT_PRODUCT_GROUP';
export const SET_PREVIOUS_PRODUCT_GROUP  = 'SET_PREVIOUS_PRODUCT_GROUP';
export const SET_ARTIST            = 'SET_ARTIST';
  //processes handling
export const PROCESS_FINISHED_OK    = 'PROCESS_FINISHED_OK';
export const PROCESS_FINISHED_ERROR = 'PROCESS_FINISHED_ERROR';

//action constructors
    //user handling requests
export function SetLocale(locale) {
  return {
    type: SET_LOCALE,
    locale
  }
}

export function SetProductGroup(id) {
  return {
    type: SET_PRODUCT_GROUP,
    id
  }
}

export function SetProduct(pid,pgid) {
  return {
    type: SET_PRODUCT,
    pid,
    pgid
  }
}

export function SetArtist(name) {
  return {
    type: SET_ARTIST,
    name
  }
}

export function SetNextProduct() {
  return {
    type: SET_NEXT_PRODUCT
  }
}

export function SetPreviousProduct() {
  return {
    type: SET_PREVIOUS_PRODUCT
  }
}

export function SetNextProductGroup(currentPgId) {
  return {
    type: SET_NEXT_PRODUCT_GROUP,
    currentPgId
  }
}

export function SetPreviousProductGroup(currentPgId) {
  return {
    type: SET_PREVIOUS_PRODUCT_GROUP,
    currentPgId
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
