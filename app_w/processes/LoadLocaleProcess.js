/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Process        from './Process'
import {fetchLocale}  from '../api'


function LoadLocaleProcess() {
  Process.call(this);
}

LoadLocaleProcess.prototype = Object.create(Process.prototype);
LoadLocaleProcess.prototype.constructor = LoadLocaleProcess;
LoadLocaleProcess.processName = 'LoadLocaleProcess';

LoadLocaleProcess.prototype.start = function(locale) {
  this.locale = locale;

  return fetchLocale(locale)
          .then(this.dispatchProcessFinishedOk.bind(this))
          .catch(this.dispatchProcessFinishedError.bind(this));
}


export default LoadLocaleProcess;
