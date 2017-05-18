/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchSignup} from '../api'
import Process from './Process'


function SignupProcess() {
  Process.call(this);
}
SignupProcess.prototype = Object.create(Process.prototype);
SignupProcess.prototype.constructor = SignupProcess;
SignupProcess.processName = 'SignupProcess';

SignupProcess.prototype.start = function(name,password) {
  fetchSignup(name,password)
  .then(this.dispatchProcessFinishedOk.bind(this))
  .catch(this.dispatchProcessFinishedError.bind(this));
}


export default SignupProcess;
