/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose           from 'mongoose';

const getModel = (entity) => {
  let baseModelName = entity.constructor.modelName;

  return mongoose.model(entity.kind ? entity.kind : baseModelName);
}



export default getModel;
