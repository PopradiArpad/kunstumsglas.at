/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchIsLoggedIn } from '../api';
import Process from './Process';

const IsLoggedInProcess = {
  processName: 'IsLoggedInProcess',

  create() {
    let process = Object.create(IsLoggedInProcess);

    process.initProcess(IsLoggedInProcess.processName);

    return process;
  },

  start() {
    fetchIsLoggedIn()
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(IsLoggedInProcess, Process);

export default IsLoggedInProcess;
