/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Process        from './Process'
import {fetchArtist}  from '../api'


function LoadArtistProcess() {
  Process.call(this);
}

LoadArtistProcess.prototype = Object.create(Process.prototype);
LoadArtistProcess.prototype.constructor = LoadArtistProcess;
LoadArtistProcess.processName = 'LoadArtistProcess';

LoadArtistProcess.prototype.start = function(name,pgid,locale) {
  return fetchArtist(name,locale)
          .then(this.dispatchProcessFinishedOk.bind(this))
          .catch(this.dispatchProcessFinishedError.bind(this));
}


export default LoadArtistProcess;
