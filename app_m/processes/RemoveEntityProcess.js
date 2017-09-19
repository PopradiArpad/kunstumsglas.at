/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchGraphQL } from '../api';
import Process from './Process';

const RemoveEntity = `
mutation ($id:Identity!,$pid:Identity!) {
  RemoveEntity(identity: $id, parentIdentity: $pid){
    void
  }
}`;

const RemoveEntityProcess = {
  processName: 'RemoveEntityProcess',

  create() {
    let process = Object.create(RemoveEntityProcess);
    process.initProcess(RemoveEntityProcess.processName);

    return process;
  },

  start(identity, parentIdentity) {
    this.identity = identity;

    return fetchGraphQL(RemoveEntity, { id: identity, pid: parentIdentity })
      .then(this.graphQLErrorAPI)
      .then(this.dispatchProcessFinishedOk)
      .catch(this.dispatchProcessFinishedError);
  }
};
Object.setPrototypeOf(RemoveEntityProcess, Process);

export default RemoveEntityProcess;
