/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import Process from './Process';
import { fetchProductGroup } from '../api';

const LoadProductGroupProcess = {
  processName: 'LoadProductGroupProcess',

  create() {
    let process = Object.create(LoadProductGroupProcess);
    process.initProcess(LoadProductGroupProcess.processName);
    return process;
  },

  start(id, locale) {
    this.id = id;

    return fetchProductGroup(id, locale)
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(LoadProductGroupProcess, Process);

export default LoadProductGroupProcess;
