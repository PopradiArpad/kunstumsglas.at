/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchSetNewPassword} from '../api'
import Process from './Process'


function SetNewPasswordProcess() {
  Process.call(this);
}
SetNewPasswordProcess.prototype = Object.create(Process.prototype);
SetNewPasswordProcess.prototype.constructor = SetNewPasswordProcess;
SetNewPasswordProcess.processName = 'SetNewPasswordProcess';

SetNewPasswordProcess.prototype.start = function(password,newPassword) {
  fetchSetNewPassword(password,newPassword)
  .then(this.dispatchProcessFinishedOk.bind(this))
  .catch(this.dispatchProcessFinishedError.bind(this));
}


export default SetNewPasswordProcess;
