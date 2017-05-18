/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose            from 'mongoose';

const getEntity = (identity) => {
  return mongoose.model(identity.dbModel).findById(identity.id)
         .then(entity=>{
            if (! entity)
              throw new Error();

            return entity;
         })
         .catch(()=>{throw new Error(`Can not find entity: ${JSON.stringify(identity)}`)});
}

export default getEntity;
