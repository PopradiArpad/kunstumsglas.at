/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import CmsConfig  from './CmsConfig';

const getCmsConfig = () => CmsConfig.findOne({})
                           .then(cmsConfig=>cmsConfig.toObject());
export default getCmsConfig;
