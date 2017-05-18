/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose from 'mongoose';

function IdArrayChanger(entity,property,valueAsString,model) {
  let schemaPaths      = model.schema.paths;
  let propertyOptions  = schemaPaths[property].options;
  this.referredDbModel = mongoose.model(getReferredDbModelName(entity,propertyOptions));
  this.entity          = entity;
  this.property        = property;
  this.valueAsString   = valueAsString;
}

IdArrayChanger.prototype = Object.create(Object.prototype);
IdArrayChanger.prototype.constructor = IdArrayChanger;

IdArrayChanger.prototype.change = function() {
  let ids = this.valueAsString.split(',');

  return allEntitiesExist(ids,this.referredDbModel)
         .then(()=>{
            this.entity[this.property] = ids;
            return Promise.resolve();
         })

}

IdArrayChanger.prototype.rollback = function() {
}

const allEntitiesExist = (ids,dbModel) => Promise.all(ids.map(id=>dbModel.findById(id)));

const getReferredDbModelName = (entity,propertyOptions) => {
  let propertyOptionsType0 = propertyOptions.type[0];

  if (propertyOptionsType0.ref)
    return propertyOptionsType0.ref;

  return entity[propertyOptionsType0.refPath];
}


export {getReferredDbModelName};
export default IdArrayChanger;
