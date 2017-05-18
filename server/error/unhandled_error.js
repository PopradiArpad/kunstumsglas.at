/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import responseWithError from './responseWithError';

const logUnhandledException = (err, req, res, next) => {// eslint-disable-line
  responseWithError(res)(err);
};

export default logUnhandledException;
