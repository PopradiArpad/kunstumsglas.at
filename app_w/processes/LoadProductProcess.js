/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import Process from './Process';
import { fetchProduct } from '../api';

const LoadProductProcess = {
  processName: 'LoadProductProcess',

  create() {
    let process = Object.create(LoadProductProcess);
    process.initProcess(LoadProductProcess.processName);
    return process;
  },

  start(pid, pgid, locale) {
    this.pid = pid;
    this.pgid = pgid;

    return fetchProduct(pid, locale)
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(LoadProductProcess, Process);

export default LoadProductProcess;
