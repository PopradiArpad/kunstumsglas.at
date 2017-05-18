/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose            from 'mongoose';
import EntityChanger       from './EntityChanger';
import partition           from 'lodash.partition';
import getPropertyTypeName from './getPropertyTypeName';

function EntityFactory(dbModelName,data,db) {
  this.dbModelName = dbModelName;
  this.data        = data;
  this.db          = db;
}

EntityFactory.prototype = Object.create(Object.prototype);

EntityFactory.prototype.createEntity = function() {
  let Model                       = mongoose.model(this.dbModelName);
  let constructorArgs             = {};
  let schemaPaths                 = Model.schema.paths;
  let [dataNeedId,dataDontNeedId] = partition(this.data,(pv)=>doesNeedId(schemaPaths,pv));
  this.entityChangerWithoutId     = new EntityChanger(constructorArgs,dataDontNeedId,this.db,Model);

  return this.entityChangerWithoutId.changeEntity()
         .then(()=>new Model(constructorArgs))
         .then(e=>this.entityChangerWithId = new EntityChanger(e,dataNeedId,this.db))
         .then(()=>this.entityChangerWithId.changeEntity())
         .then(()=>this.entityChangerWithId.entity);
}

EntityFactory.prototype.rollback = function() {
  rollbackIfExist(this.entityChangerWithoutId);
  rollbackIfExist(this.entityChangerWithId);
}

const rollbackIfExist = function(entityChanger) {
  if (entityChanger)
    entityChanger.rollback();
}

const doesNeedId = (schemaPaths,pv) => {
  switch (getPropertyTypeName(schemaPaths[pv.property].options)) {
    case 'FileUploadStatus':
    case 'Buffer':
      return true;
    default:
      return false;
  }
}

export default EntityFactory;
