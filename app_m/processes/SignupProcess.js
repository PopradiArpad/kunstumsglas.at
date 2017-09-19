/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchSignup } from '../api';
import Process from './Process';

const SignupProcess = {
  processName: 'SignupProcess',

  create() {
    let process = Object.create(SignupProcess);
    process.initProcess(SignupProcess.processName);
    return process;
  },

  start(name, password) {
    fetchSignup(name, password)
      .then(this.dispatchProcessFinishedOk)
      .catch(this.dispatchProcessFinishedError);
  }
};
Object.setPrototypeOf(SignupProcess, Process);

export default SignupProcess;
