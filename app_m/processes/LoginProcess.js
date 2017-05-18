/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchLogin} from '../api'
import Process from './Process'


function LoginProcess() {
  Process.call(this);
}
LoginProcess.prototype = Object.create(Process.prototype);
LoginProcess.prototype.constructor = LoginProcess;
LoginProcess.processName = 'LoginProcess';

LoginProcess.prototype.start = function(name,password) {
  fetchLogin(name,password)
  .then(this.dispatchProcessFinishedOk.bind(this))
  .catch(this.dispatchProcessFinishedError.bind(this));
}


export default LoginProcess;
