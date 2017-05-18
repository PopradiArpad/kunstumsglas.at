/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import initAuth             from './auth/init';
import initGvda             from './gvda/init';
import initTypes            from './types/init';
import addGetFileRoutes     from './types/addGetFileRoutes';
import bodyParser           from 'body-parser';


const initCms = (app,db,configInDb,dbUrl) => {
  app.use(bodyParser.json({limit:'100mb'}));

  const types = initTypes(db);

  initAuth(app,db,configInDb,dbUrl);
  initGvda(app,types.access);
  addGetFileRoutes(app,db);
}

export default initCms;
