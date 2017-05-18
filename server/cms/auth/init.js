/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import cookieParser  from 'cookie-parser';
import session       from 'express-session';
import connectMongo  from 'connect-mongo';
import passport      from 'passport';
import User          from '../types/models/User';
import mkAuthRoutes  from './mkAuthRoutes';


const initAuth = (app,db,configInDb,dbUrl) => {
  checkConfig(configInDb);

  //init session handling
  app.use(cookieParser(configInDb.secret));
  app.use(session({
      secret:            configInDb.secret,  //secret to sign the session ID
      resave:            false,
      saveUninitialized: false,
      name: 'management.kunstumsglas.at.sid', // the session id cookie name
      cookie: {
        maxAge:   1000*3600*24*30,   // session valid 30 days
        path:     '/',               // for the whole page
        secure:   false,             // the gateway ensures the https
        httpOnly: true               // no access for the app in the browser
      },
      store: new (connectMongo(session))({
        url:        dbUrl,
        touchAfter: 24 * 3600 // = 1 day, the session be updated only one time in this time period, does not matter how many request's are made (with the exception of those that change something on the session data)
      })
  }));

  //init passport
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use(passport.initialize());
  app.use(passport.session());

  //add routes
  app.use('/auth', mkAuthRoutes());
}

const checkConfig = (config) => {
  if (!   (   config
           && config.hasOwnProperty('registeringAllowed')
           && config.hasOwnProperty('secret')
          )
     )
    logHelpAndThrow();
}

const logHelpAndThrow = () => {
  console.log(`
    No (valid) configs collection in the db!
    Make it!

    db.cmsconfigs.insertOne({registeringAllowed:bool,secret:'your secret'})
    `);
  throw new Error('config error: see log');
}


export default initAuth;
