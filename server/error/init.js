/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import unhandled_error  from './unhandled_error';

const initError = (app) => {
  app.use(unhandled_error);
}

export default initError;
