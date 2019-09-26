/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchSetRegisteringAllowed } from '../api';
import Process from './Process';

const SetRegisteringAllowedProcess = {
  processName: 'SetRegisteringAllowedProcess',

  create() {
    let process = Object.create(SetRegisteringAllowedProcess);
    process.initProcess(SetRegisteringAllowedProcess.processName);
    return process;
  },

  start(value) {
    fetchSetRegisteringAllowed(value)
      .then(this.dispatchProcessFinishedOk)
      .catch(this.dispatchProcessFinishedError);
  }
};
Object.setPrototypeOf(SetRegisteringAllowedProcess, Process);

export default SetRegisteringAllowedProcess;
