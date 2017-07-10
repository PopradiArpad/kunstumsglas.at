/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import mongoose from 'mongoose';
import EntityChanger from './EntityChanger';
import partition from 'lodash.partition';
import getPropertyTypeName from './getPropertyTypeName';

const EntityFactory = {
  create(dbModelName, data, db) {
    let entityFactory = Object.create(EntityFactory);
    entityFactory.dbModelName = dbModelName;
    entityFactory.data = data;
    entityFactory.db = db;
    return entityFactory;
  },

  createEntity() {
    let Model = mongoose.model(this.dbModelName);
    let constructorArgs = {};
    let schemaPaths = Model.schema.paths;
    let [dataNeedId, dataDontNeedId] = partition(this.data, pv =>
      doesNeedId(schemaPaths, pv)
    );
    this.entityChangerWithoutId = EntityChanger.create(
      constructorArgs,
      dataDontNeedId,
      this.db,
      Model
    );

    return this.entityChangerWithoutId
      .changeEntity()
      .then(() => new Model(constructorArgs))
      .then(
        e =>
          (this.entityChangerWithId = EntityChanger.create(
            e,
            dataNeedId,
            this.db
          ))
      )
      .then(() => this.entityChangerWithId.changeEntity())
      .then(() => this.entityChangerWithId.entity);
  },

  rollback() {
    rollbackIfExist(this.entityChangerWithoutId);
    rollbackIfExist(this.entityChangerWithId);
  }
};

const rollbackIfExist = function(entityChanger) {
  if (entityChanger) entityChanger.rollback();
};

const doesNeedId = (schemaPaths, pv) => {
  switch (getPropertyTypeName(schemaPaths[pv.property].options)) {
    case 'FileUploadStatus':
    case 'Buffer':
      return true;
    default:
      return false;
  }
};

export default EntityFactory;
