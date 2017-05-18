/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Cache       from '../cms/types/models/Cache'

const cacheIn = () => {
   return Cache.findOne({});
}

const CacheIn = {
  entityChanged: function(entity) {
    return refreshCache(entity,false);
  },
  entityCreated: function(entity) {
    return refreshCache(entity,false);
  },
  entityRemoved: function(entity) {
    return refreshCache(entity,true);
  }
}

const refreshCache = (entity,entityRemoved) => {
  return cacheIn()
         .then(theCacheIn=>theCacheIn.refresh(entity.constructor.modelName,
                                              entity.constructor.baseModelName,
                                              entity.toObject(),
                                              entityRemoved));
}

// export default cacheIn;
export default CacheIn;
