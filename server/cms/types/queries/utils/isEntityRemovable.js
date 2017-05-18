/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import getPropertyTypeName from './getPropertyTypeName'

const isEntityRemovable = (entity) => () => {
  if (entity._id==='mainview')
    return false;

  let constructor = entity.constructor;

  if (constructor.modelName==='Translation')
    return false;

  let removable   = true;
  let schema      = constructor.schema;
  let schemaPaths = schema.paths;

  schema.eachPath(property=>{
    if (getPropertyTypeName(schemaPaths[property].options)==='IdArray')
      removable = false;
  });

  return removable;
}

export default isEntityRemovable;
