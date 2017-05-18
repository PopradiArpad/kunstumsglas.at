/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose                from 'mongoose';
import getPropertyTypeName     from './getPropertyTypeName';
import mkEmptyLocalizedStrings from '../../../../locales/mkEmptyLocalizedStrings';

const mkTemporaryEntity = (dbModelName) => {
  let Model       = mongoose.model(dbModelName);
  let schema      = Model.schema;
  let schemaPaths = schema.paths;
  let constructorArgs = {};

  schema.eachPath(property=>{
    let schemaPathsPropertyOptions = schemaPaths[property].options;
    let typeName = getPropertyTypeName(schemaPathsPropertyOptions);

    if (typeName==='String')
      constructorArgs[property] = '';
    else if (typeName==='LocalizedStrings')
      constructorArgs[property] = mkEmptyLocalizedStrings();
  });

  return Promise.resolve(new Model(constructorArgs));
}

export default mkTemporaryEntity;
