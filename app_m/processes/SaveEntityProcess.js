/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchGraphQL} from '../api'
import Process        from './Process'

const ChangeEntity = `
mutation ($id:Identity!,$pvis:[PropertyValueInput]!) {
  ChangeEntity(identity:$id, data:$pvis){
    void
  }
}`

function SaveEntityProcess() {
  Process.call(this);
  this.identity;
}

SaveEntityProcess.prototype = Object.create(Process.prototype);
SaveEntityProcess.prototype.constructor = SaveEntityProcess;
SaveEntityProcess.processName = 'SaveEntityProcess';

SaveEntityProcess.prototype.start = function(entityDescriptionDiff) {
  this.identity = entityDescriptionDiff.identity;

  let propertyValueInputs = this.getPropertyValueInputs(entityDescriptionDiff.propertyDescriptions)

  return fetchGraphQL(ChangeEntity, {id:this.identity, pvis:propertyValueInputs})
          .then(this.graphQLErrorAPI.bind(this))
          .then(this.dispatchProcessFinishedOk.bind(this))
          .catch(this.dispatchProcessFinishedError.bind(this));
}


export default SaveEntityProcess;
