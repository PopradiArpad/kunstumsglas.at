/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

if (! process.env.PORT)  {
  console.error("Error: port must be specified by the environment variable PORT!");
  process.exit(1);
}

const port = parseInt(process.env.PORT);

if ((typeof port)!=='number') {
  console.error("Error: environment variable PORT is not an integer!");
  process.exit(1);
}


export default port;
