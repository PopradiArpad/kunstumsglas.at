/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
var express = require('express');


const index_html = (publicPath) => {
  let router = express.Router();

  router.get('*',(req,res) => {
    var options = {
      root: publicPath,//or the path at sendFile must be absolute
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent':      true
      }
    };
    res.sendFile('index.html',options);
  });

  return router;
}

export default index_html;
