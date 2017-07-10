/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import Process from './Process';
import { fetchLocale } from '../api';

const LoadLocaleProcess = {
  processName: 'LoadLocaleProcess',

  create() {
    let process = Object.create(LoadLocaleProcess);
    process.initProcess(LoadLocaleProcess.processName);
    return process;
  },

  start(locale) {
    this.locale = locale;

    return fetchLocale(locale)
      .then(this.dispatchProcessFinishedOk.bind(this))
      .catch(this.dispatchProcessFinishedError.bind(this));
  }
};
Object.setPrototypeOf(LoadLocaleProcess, Process);

export default LoadLocaleProcess;
