/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Process        from './Process'
import {fetchProduct}  from '../api'


function LoadProductProcess() {
  Process.call(this);
}

LoadProductProcess.prototype = Object.create(Process.prototype);
LoadProductProcess.prototype.constructor = LoadProductProcess;
LoadProductProcess.processName = 'LoadProductProcess';

LoadProductProcess.prototype.start = function(pid,pgid,locale) {
  this.pid  = pid;
  this.pgid = pgid;

  return fetchProduct(pid,locale)
          .then(this.dispatchProcessFinishedOk.bind(this))
          .catch(this.dispatchProcessFinishedError.bind(this));
}


export default LoadProductProcess;
