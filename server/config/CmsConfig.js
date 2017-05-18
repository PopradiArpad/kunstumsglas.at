/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose   from 'mongoose';

var cmsConfig = mongoose.Schema({
  registeringAllowed: {type: Boolean, default: false},
  secret:             String
});

let CmsConfig = mongoose.model('CmsConfig', cmsConfig);

export default CmsConfig;
