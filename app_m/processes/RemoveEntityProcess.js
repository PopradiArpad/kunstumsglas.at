/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchGraphQL} from '../api'
import Process        from './Process'

const RemoveEntity = `
mutation ($id:Identity!,$pid:Identity!) {
  RemoveEntity(identity: $id, parentIdentity: $pid){
    void
  }
}`

function RemoveEntityProcess() {
  Process.call(this);
}

RemoveEntityProcess.prototype = Object.create(Process.prototype);
RemoveEntityProcess.prototype.constructor = RemoveEntityProcess;
RemoveEntityProcess.processName = 'RemoveEntityProcess';

RemoveEntityProcess.prototype.start = function(identity,parentIdentity) {
  this.identity = identity;

  return fetchGraphQL(RemoveEntity, {id:identity,pid:parentIdentity})
          .then(this.graphQLErrorAPI.bind(this))
          .then(this.dispatchProcessFinishedOk.bind(this))
          .catch(this.dispatchProcessFinishedError.bind(this));
}


export default RemoveEntityProcess;
