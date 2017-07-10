/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchLogin } from '../api';
import Process from './Process';

const LoginProcess = {
  processName: 'LoginProcess',

  create() {
    let process = Object.create(LoginProcess);
    process.initProcess(LoginProcess.processName);
    return process;
  },

  start(name, password) {
    fetchLogin(name, password)
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(LoginProcess, Process);

export default LoginProcess;
