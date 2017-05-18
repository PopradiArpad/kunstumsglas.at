/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {}                  from './schemaTypes/init';
//TODO: to models
//Let register the models to Mongoose
import {}                       from './models/MainView';
import {}                       from './models/ProductGroup';
import {}                       from './models/Product';
import {}                       from './models/User';
import {}                       from './models/GalleryItem';
import {}                       from './models/Cache';
import GetEntityDescription     from './queries/GetEntityDescription';
import GetEntityPropertyValues  from './queries/GetEntityPropertyValues';
import ChangeEntity             from './queries/ChangeEntity';
import CreateEntityTo           from './queries/CreateEntityTo';
import RemoveEntity             from './queries/RemoveEntity';

const initTypes = (db) => {
  let types    = {};
  types.access = {};

  let changeEntity   = new ChangeEntity(db);
  let createEntityTo = new CreateEntityTo(db);
  let removeEntity   = new RemoveEntity(db);

  types.access.GetEntityDescription    = GetEntityDescription;
  types.access.GetEntityPropertyValues = GetEntityPropertyValues;
  types.access.ChangeEntity            = changeEntity.run.bind(changeEntity);
  types.access.CreateEntityTo          = createEntityTo.run.bind(createEntityTo);
  types.access.RemoveEntity            = removeEntity.run.bind(removeEntity);

  return types;
}


export default initTypes;
