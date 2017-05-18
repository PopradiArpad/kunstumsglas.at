/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Process        from './Process'
import {fetchProductGroup}  from '../api'


function LoadProductGroupProcess() {
  Process.call(this);
}

LoadProductGroupProcess.prototype = Object.create(Process.prototype);
LoadProductGroupProcess.prototype.constructor = LoadProductGroupProcess;
LoadProductGroupProcess.processName = 'LoadProductGroupProcess';

LoadProductGroupProcess.prototype.start = function(id,locale) {
  this.id = id;

  return fetchProductGroup(id,locale)
          .then(this.dispatchProcessFinishedOk.bind(this))
          .catch(this.dispatchProcessFinishedError.bind(this));
}


export default LoadProductGroupProcess;
