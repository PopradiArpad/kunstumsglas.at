/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import merge                   from 'lodash.merge';

const startProcess = (state,processConstructor,p1,p2,p3,p4,p5,p6) => {
  if (state._runningProcess)
    return state;

  let _runningProcess = new processConstructor();
  _runningProcess.start(p1,p2,p3,p4,p5,p6);

  return merge({},state,{_runningProcess})
}

const isMyRunningProcess = (state,action) => {
  let _runningProcess = state._runningProcess;

  return (_runningProcess && _runningProcess.name===action.processName);
}


export {startProcess, isMyRunningProcess};
