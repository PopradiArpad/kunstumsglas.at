/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchLogout } from '../api';
import Process from './Process';

const LogoutProcess = {
  processName: 'LogoutProcess',

  create() {
    let process = Object.create(LogoutProcess);
    process.initProcess(LogoutProcess.processName);
    return process;
  },

  start() {
    fetchLogout()
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(LogoutProcess, Process);

export default LogoutProcess;
