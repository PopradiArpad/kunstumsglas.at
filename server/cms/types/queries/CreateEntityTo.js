/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import mongoose from 'mongoose';
import getEntity from './utils/getEntity';
import EntityFactory from './utils/EntityFactory';
import getPropertyTypeName from './utils/getPropertyTypeName';
import CacheIn from '../../../cache/CacheIn';

const CreateEntityTo = {
  create(db) {
    let createEntityTo = Object.create(CreateEntityTo);
    createEntityTo.db = db;
    return createEntityTo;
  },

  run(root, { dbModel, data, parent, property }) {
    let parentEntity;
    let entity;
    let entityFactory;

    return checkTypes(parent, property)
      .then(() => (entityFactory = EntityFactory.create(dbModel, data, this.db)))
      .then(() => entityFactory.createEntity())
      .then(e => (entity = e))
      .then(() => getEntity(parent))
      .then(e => (parentEntity = e))
      .then(() => entity.save())
      .then(() => {
        parentEntity[property].push(entity._id);
        return parentEntity.save();
      })
      .catch(e => {
        if (entityFactory) entityFactory.rollback();

        throw e;
      })
      .then(() => CacheIn.entityCreated(entity));
    //no catch: GraphQL driver turns exception into the right error message
  }
};

const checkTypes = (parent, property) => {
  let Model = mongoose.model(parent.dbModel);
  let schemaPathsProperty = Model.schema.paths[property];

  if (!schemaPathsProperty)
    return Promise.reject(
      new Error(
        `Cannot create entity: ${parent.dbModel} has no ${property} property`
      )
    );

  if (getPropertyTypeName(schemaPathsProperty.options) !== 'IdArray')
    return Promise.reject(
      new Error(
        `Cannot create entity to ${parent.dbModel}: ${property} property is not an IdArray`
      )
    );

  return Promise.resolve();
};

export default CreateEntityTo;
