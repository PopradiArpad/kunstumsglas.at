/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchGraphQL } from '../api';
import Process from './Process';

const CreateEntityTo = `
mutation ($dbm: String!,
          $pvis:[PropertyValueInput]!,
          $pid: Identity!,
          $prop:String!
        ) {
  CreateEntityTo(dbModel:  $dbm,
                 data:     $pvis,
                 parent:   $pid
                 property: $prop){
    void
  }
}`;

const CreateEntityToProcess = {
  processName: 'CreateEntityToProcess',

  create() {
    let process = Object.create(CreateEntityToProcess);
    process.initProcess(CreateEntityToProcess.processName);

    return process;
  },

  start(entityDescriptionDiff, parentIdentity, parentProperty) {
    this.identity = entityDescriptionDiff.identity;
    let propertyValueInputs = this.getPropertyValueInputs(
      entityDescriptionDiff.propertyDescriptions
    );

    return fetchGraphQL(CreateEntityTo, {
      dbm: this.identity.dbModel,
      pvis: propertyValueInputs,
      pid: parentIdentity,
      prop: parentProperty
    })
      .then(this.graphQLErrorAPI.bind(this))
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(CreateEntityToProcess, Process);

export default CreateEntityToProcess;
