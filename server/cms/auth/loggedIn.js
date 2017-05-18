/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
const loggedIn = (req,res,next)=>{
  if (req.user)
    next();
  else
    res.sendStatus(401);
}

export default loggedIn;
