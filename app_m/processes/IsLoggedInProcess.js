/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchIsLoggedIn} from '../api'
import Process from './Process'


function IsLoggedInProcess() {
  Process.call(this);
}

IsLoggedInProcess.prototype = Object.create(Process.prototype);
IsLoggedInProcess.prototype.constructor = IsLoggedInProcess;
IsLoggedInProcess.processName = 'IsLoggedInProcess';

IsLoggedInProcess.prototype.start = function() {
  fetchIsLoggedIn()
  .then(this.dispatchProcessFinishedOk.bind(this))
  .catch(this.dispatchProcessFinishedError.bind(this));
}


export default IsLoggedInProcess;
