/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import express          from 'express';
import port             from './config/port';
import dbConfig         from './config/db';
import logOn            from './config/log';
import {publicPath}     from './config/pathes';
import getCmsConfig     from './config/getCmsConfig';
import connectToDb      from './db/connectToDb';
import cacheOut,{reloadCacheOut} from './cache/cacheOut';
import initLocales      from './locales/init';
import initCms          from './cms/init';
import initWebsite      from './website/init';
import responseWithError from './error/responseWithError';
import index_html       from './index_html';
import morgan           from 'morgan';
import expressStaticGzip from "express-static-gzip";
import ms               from "ms";
import helmet           from "helmet";
import {refresMainView} from './cms/types/models/MainView';
let app = express();


if (logOn)
  app.use(morgan('dev'));

//expect Certificate Transparency
app.use(helmet.expectCt({
  enforce: true,
  maxAge: 2592000 //30 days in s
  //TODO add report
}));
//To prevent clickjacking
app.use(helmet.frameguard({ action: 'deny' }));
//No hint to the web server engine
app.disable('x-powered-by');
//Strict-Transport-Security
app.use(helmet.hsts({
  maxAge: 2592000 //30 days in s
}));


app.use("/", expressStaticGzip(publicPath,{ maxAge: ms('1d') }));

let db;

connectToDb(dbConfig)
.then(_db=>db=_db)
.then(()=>reloadCacheOut())
.then(()=>cacheOut())
.then(cacheout=>initLocales(cacheout.locales))
.then(refresMainView)
.then(()=>getCmsConfig())
.then(cmsConfig=>{
  initCms(app,db,cmsConfig,dbConfig.url);
  initWebsite(app,db);

  // The 404 Route (ALWAYS Keep this as the last route)
  // Handle reload of a browser routed URL: send the whole app and
  // let the browser to route it out.
  app.use('*', index_html(publicPath));

  // The error handler middleware is always the last one.
  app.use((err, req, res, next) => {// eslint-disable-line
      responseWithError(res)(err);
    }
  )

  app.listen(port, () => {
    console.log('Server running on port '+port+' public path is '+publicPath);
  });
})
.catch(e=>{
  console.log(e);
  process.exit(1);
})

process.on('unhandledRejection', error => {
  console.log('Warning UnhandledRejection !!');
  console.log('   message', error.message);
  console.log('   stack', error.stack);
});

//Preparing for gracefull shutdown:
//Docker stops a task by sending the main process
//inside the container a SIGTERM, and after a grace period, SIGKILL.
process.on('SIGTERM', () => {
  console.log('Received SIGTERM.', new Date());
  process.exit(0);
});
