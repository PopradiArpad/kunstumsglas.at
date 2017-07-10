/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import getEntity from './utils/getEntity';
import getModel from './utils/getModel';
import isEntityRemovable from './utils/isEntityRemovable';
import getPropertyTypeName from './utils/getPropertyTypeName';
import { removeRelatedGfsFileIfExist } from './utils/propertyChangers/FileChanger';
import CacheIn from '../../../cache/CacheIn';

const RemoveEntity = {
  create(db) {
    let removeEntity = Object.create(RemoveEntity);
    removeEntity.db = db;
    return removeEntity;
  },

  run(root, { identity, parentIdentity }) {
    let entity;
    let parentEntity;
    let property;

    return (
      getEntity(identity)
        .then(e => {
          entity = e;
          if (!isEntityRemovable(entity))
            return Promise.reject(
              new Error(`Cannot remove ${identity}: it's not removable`)
            );
        })
        .then(() => getEntity(parentIdentity))
        .then(e => {
          parentEntity = e;
          property = getPropertyInWhichEntityIsReferred(parentEntity, entity);
          if (!property)
            return Promise.reject(
              new Error(
                `Cannot remove ${identity}: it's supposed parent ${parentIdentity} doesn't referres to it`
              )
            );
        })
        //I don't know why the direct setting doesn't work
        .then(() =>
          getModel(parentEntity).update(
            { _id: parentEntity._id },
            { $pull: { [property]: entity._id } }
          )
        )
        .then(() => removeRelatedGfsFiles(this.db, entity))
        .then(() => entity.remove())
        .then(() => CacheIn.entityRemoved(entity))
    );
    //no catch: GraphQL driver turns exception into the right error message
  }
};

const getPropertyInWhichEntityIsReferred = (parentEntity, entity) => {
  let schema = parentEntity.constructor.schema;
  let schemaPaths = schema.paths;
  let referringProperty;

  schema.eachPath(property => {
    if (referringProperty) return;

    if (getPropertyTypeName(schemaPaths[property].options) !== 'IdArray')
      return;

    if (
      parentEntity[property].find(id => id.toString() === entity._id.toString())
    )
      referringProperty = property;
  });

  return referringProperty;
};

const removeRelatedGfsFiles = (db, entity) => {
  let schema = entity.constructor.schema;
  let schemaPaths = schema.paths;
  let fileProperties = [];

  schema.eachPath(property => {
    if (
      getPropertyTypeName(schemaPaths[property].options) === 'FileUploadStatus'
    )
      fileProperties.push(property);
  });

  return Promise.all(
    fileProperties.map(p => removeRelatedGfsFileIfExist(db, entity, p))
  );
};

export default RemoveEntity;
