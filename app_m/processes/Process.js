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
    this.name = name;

    //instance methods
    this.dispatchProcessFinishedOk = this.dispatchProcessFinishedOk.bind(this);
    this.dispatchProcessFinishedError = this.dispatchProcessFinishedError.bind(this);
    this.graphQLErrorAPI = this.graphQLErrorAPI.bind(this);
    this.getPropertyValueInputs = this.getPropertyValueInputs.bind(this);
  },

  dispatchProcessFinishedOk(result) {
    dispatch(new ProcessFinishedOk(this.name, result));
  },

  dispatchProcessFinishedError(error) {
    let errorMessages = error.errorMessages;

    if (!(errorMessages && Array.isArray(errorMessages))) {
      errorMessages = ['Unbekantes Fehlerformat. Sehe log!'];
      console.error('error:');
      console.error(error);
    }

    dispatch(new ProcessFinishedError(this.name, errorMessages));
  },

  graphQLErrorAPI(graphQLResult) {
    if (graphQLResult.errors)
      throw { errorMessages: graphQLResult.errors.map(e => e.message) };

    return graphQLResult;
  },

  getPropertyValueInputs(propertyDescriptions) {
    return propertyDescriptions.map(pd => new PropertyValueInput(pd));
  }
};

function PropertyValueInput(propertyDescription) {
  return {
    property: propertyDescription.property,
    value: this.getValue(propertyDescription)
  };
}
PropertyValueInput.prototype.getValue = function(propertyDescription) {
  switch (propertyDescription.__typename) {
    case 'StringProperty':
      return propertyDescription.string;
    case 'BooleanProperty':
      return propertyDescription.bool.toString();
    case 'IdArrayProperty':
      return propertyDescription.ids.toString();
    case 'DataURLProperty':
      return propertyDescription.dataurl;
    case 'FileUploadStatusProperty':
      return propertyDescription.uploadStatus;
    case 'TranslatedStringsProperty':
      return JSON.stringify(propertyDescription.translatedStrings);
    case 'LocalizedStringsProperty':
      return JSON.stringify(propertyDescription.localizedStrings);
    default:
      throw new Error(
        `Cannot get PropertyValueInput for __typename ${propertyDescription.__typename}`
      );
  }
};

export default Process;
