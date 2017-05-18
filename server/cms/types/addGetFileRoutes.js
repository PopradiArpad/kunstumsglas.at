/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import express            from 'express';
import mongoose           from 'mongoose';
import {BadRequest,
        NotFound}         from '../../error/KugmError';
import responseWithError  from '../../error/responseWithError';
import {sendBufferAsOctetStream,
        sendFileFromGfs}  from './fileUtils';
import getModel           from './queries/utils/getModel';


//TEST
// id 584038be483b486c77685fa6 is a Product (Waldglasprodukt)
// id 5878fe1b884cf85dcff8ee4e is a Product (gelasertesprodukt)
//curl http://localhost:3002/item/584038be483b486c77685fa6/bigpic?dbModel=Product

const addGetFileRoutes = (app,db) => {
    app.use('/item',id(db));
}

const id = (db) => {
  let router = express.Router();

  router.param('id', function(req, res, next, id) {
    let dbModelName = req.query.dbModel;

    if (!dbModelName)
      return next(new BadRequest(`dbModel is an obligatory query parameter!`));

    let Model;
    try {
      Model = mongoose.model(dbModelName);
    } catch(e) {
      return next(new NotFound(`No ${dbModelName} model is found`));
    }

    Model.findById(id)
    .then(entity=>{
            if (entity) {
              req.entity = entity;
              req.schema = getModel(entity).schema;
              next();
            }
            else
              return next(new NotFound(`Entity of ${dbModelName} with id ${id} is not found`));
    })
    .catch(responseWithError(res));
  });

  router.use("/:id", getFileRoutes(db))

  return router;
}

const getFileRoutes = (db) => {
  let router = express.Router();

  //attention: this doesnt require credential
  router.get(/.*/, (req,res,next) => {
      let property            = req.path.slice(1);
      let schemaPathsProperty = req.schema.paths[property];
      if (! schemaPathsProperty)
        return next(new BadRequest(`No ${property} property on db model ${req.entity.constructor.modelName}`));

      let propertyType     = schemaPathsProperty.options.type;
      let propertyTypeName = propertyType.name;

      switch (propertyTypeName) {
        case 'Buffer':
          return sendBufferAsOctetStream(res,req.entity[property],next);
        case 'FileUploadStatus':
          return sendFileFromGfs(res,db,req.entity._id,property,next);
        default:
          return next(new BadRequest(`The property ${property} with ${propertyTypeName} can not accissiated a file!`));
      }
  });

  return router;
}

export default addGetFileRoutes;
