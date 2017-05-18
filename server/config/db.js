/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
let dbPort;

process.argv.forEach((val,ix) => {
  if (val==='--db_port') {
    dbPort=parseInt(process.argv[ix+1]);
  }
});

if ((typeof dbPort)!=='number') {
  console.error("Error: db port must be specified by --db_port!");
  process.exit(1);
}

function getUrl() {
  return `mongodb://localhost:${getPort()}/`;
}

function getPort() {
  return dbPort;
}

module.exports = {
  // The whole url
  url:  getUrl(),
  // Part of the url, needed to start the mongod at deploy and test
  port: getPort()
}
