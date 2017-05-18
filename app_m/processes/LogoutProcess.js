/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchLogout} from '../api'
import Process from './Process'


function LogoutProcess() {
  Process.call(this);
}
LogoutProcess.prototype = Object.create(Process.prototype);
LogoutProcess.prototype.constructor = LogoutProcess;
LogoutProcess.processName = 'LogoutProcess';

LogoutProcess.prototype.start = function() {
  fetchLogout()
  .then(this.dispatchProcessFinishedOk.bind(this))
  .catch(this.dispatchProcessFinishedError.bind(this));
}

export default LogoutProcess;
