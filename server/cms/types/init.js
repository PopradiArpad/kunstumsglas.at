/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import './schemaTypes/init';
//TODO: to models
//Let register the models to Mongoose
import './models/MainView';
import './models/ProductGroup';
import './models/Product';
import './models/User';
import './models/GalleryItem';
import './models/Cache';
import GetEntityDescription from './queries/GetEntityDescription';
import GetEntityPropertyValues from './queries/GetEntityPropertyValues';
import ChangeEntity from './queries/ChangeEntity';
import CreateEntityTo from './queries/CreateEntityTo';
import RemoveEntity from './queries/RemoveEntity';

const initTypes = db => {
  let types = {};
  types.access = {};

  let changeEntity = ChangeEntity.create(db);
  let createEntityTo = CreateEntityTo.create(db);
  let removeEntity = RemoveEntity.create(db);

  types.access.GetEntityDescription = GetEntityDescription;
  types.access.GetEntityPropertyValues = GetEntityPropertyValues;
  types.access.ChangeEntity = changeEntity.run.bind(changeEntity);
  types.access.CreateEntityTo = createEntityTo.run.bind(createEntityTo);
  types.access.RemoveEntity = removeEntity.run.bind(removeEntity);

  return types;
};

export default initTypes;
