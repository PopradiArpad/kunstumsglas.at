/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
let port;

process.argv.forEach((val,ix) => {
  if (val==='--port') {
    port=parseInt(process.argv[ix+1]);
  }
});

if ((typeof port)!=='number') {
  console.error("Error: port must be specified by --port!");
  process.exit(1);
}

export default port;
