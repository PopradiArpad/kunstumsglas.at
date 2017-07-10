/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchSetNewPassword } from '../api';
import Process from './Process';

const SetNewPasswordProcess = {
  processName: 'SetNewPasswordProcess',

  create() {
    let process = Object.create(SetNewPasswordProcess);
    process.initProcess(SetNewPasswordProcess.processName);
    return process;
  },

  start(password, newPassword) {
    fetchSetNewPassword(password, newPassword)
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(SetNewPasswordProcess, Process);

export default SetNewPasswordProcess;
