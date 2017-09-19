/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import Process from './Process';
import { fetchArtist } from '../api';

const LoadArtistProcess = {
  processName: 'LoadArtistProcess',

  create() {
    let process = Object.create(LoadArtistProcess);
    process.initProcess(LoadArtistProcess.processName);
    return process;
  },

  start(name, pgid, locale) {
    return fetchArtist(name, locale)
      .then(this.dispatchProcessFinishedOk)
      .catch(this.dispatchProcessFinishedError);
  }
};
Object.setPrototypeOf(LoadArtistProcess, Process);

export default LoadArtistProcess;
