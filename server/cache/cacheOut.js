/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Cache       from '../cms/types/models/Cache'

Cache.eventEmitter().on('changed', ()=>reloadCacheOut())

let theLoadedCache;

const reloadCacheOut = () => {
   return Cache.findOne({})
          .then(cache=>cache ? cache : (new Cache({})).save())
          .then(cache=>theLoadedCache=cache);
}


const cacheOut = () => theLoadedCache;

export {reloadCacheOut};
export default cacheOut;
