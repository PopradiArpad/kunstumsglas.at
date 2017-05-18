/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import fse  from 'fs-extra';

export const doesFileExistRWSync = (path) => {
  try {
    fse.accessSync(path,fse.constants.R_OK|fse.constants.W_OK);
    return true;
  } catch(err) {
    return false;
  }
}

export const doesFileExistSync = (path) => {
  try {
    fse.accessSync(path,fse.constants.F_OK);
    return true;
  } catch(err) {
    return false;
  }
}
