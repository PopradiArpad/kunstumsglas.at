/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import getEntity                   from './utils/getEntity';
import getModel                    from './utils/getModel';
import mkPropertyDescriptions      from './utils/mkPropertyDescriptions';
import mkTemporaryEntity           from './utils/mkTemporaryEntity';
import isEntityRemovable           from './utils/isEntityRemovable';

function GetEntityDescription(root, {identity}) {
  let propertyDescriptions;

  if (identity.id=='temporary')
    return mkTemporaryEntity(identity.dbModel)
           .then(entity=>getPropertyDescriptions(entity,identity))
           .then(propertyDescriptions=>({
             removable:true,
             propertyDescriptions
           }));

  let entity;
  return getEntity(identity)
         .then(e=>entity=e)
         .then(()=>getPropertyDescriptions(entity))
         .then(pds=>propertyDescriptions=pds)
         .then(()=>isEntityRemovable(entity))
         .then(removable=>({
           removable,
           propertyDescriptions
         }));
}

const getPropertyDescriptions = (entity) => {
  let schema = getModel(entity).schema;
  return mkPropertyDescriptions(entity,schema);
}



export default GetEntityDescription;
