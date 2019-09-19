/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import passport           from 'passport';
import User               from '../types/models/User';
import {refresMainView}   from '../types/models/MainView';
import CmsConfig          from '../../config/CmsConfig';
import express            from 'express';
import promisify          from 'es6-promisify';
import loggedIn           from './loggedIn';
import {BadRequest}       from '../../error/KugmError';
import responseWithError  from '../../error/responseWithError';


const mkAuthRoutes = () =>{

  let router = express.Router();

  router.post('/signup', function(req, res, next) {
    User.register(new User({username: req.body.username, name: ''}),req.body.password, function(err) {
      if (err) {
        console.log('error while user registering!', err);
        return next(err);
      }

      console.log(`user ${req.body.username} registered`);

      //TODO: do not ignore promise result
      refresMainView();

      res.sendStatus(200);
    });
  });

  router.get('/user', function(req, res) {
    CmsConfig.findOne({})
    .then(checkConfig)
    .then(config=>res.send({
                            userName:          req.user ? req.user.username : null,//the login name
                            registeringAllowed:config.registeringAllowed
                          })
    )
    .catch(responseWithError(res));
  });

  router.post('/login',
              passport.authenticate('local'),
              (req,res) => res.send({
                                      userName: req.user.username//the login name
                                    })
             );

  router.post('/logout', logout);

  router.post('/setNewPassword',
               loggedIn,
               setNewPassword,
               logout
             );

  return router;
}

const checkConfig = (config) => {
  const configObject = config.toObject();

  if (!   (configObject && configObject.hasOwnProperty('registeringAllowed')))
    return Promise.reject(new Error(`Configuration error: config object doesn't exist or invalid`));

  return configObject;
}

const logout = (req,res) => {
  req.logOut();

  CmsConfig.findOne({})
  .then(checkConfig)
  .then(config=>res.send({registeringAllowed:config.registeringAllowed}))
  .catch(responseWithError(res));
};

const setNewPassword = (req,res,next) => {
  const user = req.user;
  const body = req.body;

  promisify(User.authenticate())(user.username,body.password)
  .then(user=>{
    if (! user)
      throw new BadRequest(`Wrong password`);

   return userSetPassword(user,body.newPassword);
  })
  .then(user=>user.save())
  .then(()=>next())
  .catch(responseWithError(res));
}

const userSetPassword = (user,password) => new Promise((resolve,reject)=>user.setPassword(password, (err,user)=>{
  (err) ? reject(new BadRequest(`Cannot set password`)) : resolve(user);
  }
))

export default mkAuthRoutes;
