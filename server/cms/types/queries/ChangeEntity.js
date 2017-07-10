/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import getEntity from './utils/getEntity';
import EntityChanger from './utils/EntityChanger';
import CacheIn from '../../../cache/CacheIn';

const ChangeEntity = {
  create(db) {
    let changeEntity = Object.create(ChangeEntity);
    changeEntity.db = db;
    return changeEntity;
  },

  run(root, { identity, data }) {
    let entity;
    let entityChanger;

    return getEntity(identity)
      .then(e => (entity = e))
      .then(() => (entityChanger = new EntityChanger(entity, data, this.db)))
      .then(() => entityChanger.changeEntity())
      .then(() => entity.save())
      .catch(e => {
        if (entityChanger) entityChanger.rollback();

        throw e;
      })
      .then(() => CacheIn.entityChanged(entity));
    //no catch: GraphQL driver turns exception into the right error message
  }
};

export default ChangeEntity;
