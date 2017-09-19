/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchGraphQL } from '../api';
import Process from './Process';

const ChangeEntity = `
mutation ($id:Identity!,$pvis:[PropertyValueInput]!) {
  ChangeEntity(identity:$id, data:$pvis){
    void
  }
}`;

const SaveEntityProcess = {
  processName: 'SaveEntityProcess',

  create() {
    let process = Object.create(SaveEntityProcess);

    process.initProcess(SaveEntityProcess.processName);
    process.identity; //only to declare it. It will be used later.

    return process;
  },

  start(entityDescriptionDiff) {
    this.identity = entityDescriptionDiff.identity;

    let propertyValueInputs = this.getPropertyValueInputs(
      entityDescriptionDiff.propertyDescriptions
    );

    return fetchGraphQL(ChangeEntity, {
      id: this.identity,
      pvis: propertyValueInputs
    })
      .then(this.graphQLErrorAPI)
      .then(this.dispatchProcessFinishedOk)
      .catch(this.dispatchProcessFinishedError);
  }
};
Object.setPrototypeOf(SaveEntityProcess, Process);

export default SaveEntityProcess;
