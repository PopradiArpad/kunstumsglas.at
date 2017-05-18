/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
let logOn = false;

process.argv.forEach(val => {
  if (val==='--log')
    logOn=true;
});

export default logOn;
