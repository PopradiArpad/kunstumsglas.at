/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


if (! process.env.MONGO_URL)  {
  console.error("Error: mongo url must be specified by the environment variable MONGO_URL!");
  process.exit(1);
}

function getUrl() {
  return process.env.MONGO_URL;
}

module.exports = {
  url:  getUrl(),
}
