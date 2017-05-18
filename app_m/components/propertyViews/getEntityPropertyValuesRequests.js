/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import IdArrayPropertyView from './IdArrayPropertyView';

function getEntityPropertyValuesRequests(propertyDescription,entityOverviews) {
  if (propertyDescription.__typename!=='IdArrayProperty')
    return [];

  return IdArrayPropertyView.getEntityPropertyValuesRequests(propertyDescription,entityOverviews)
}

export default getEntityPropertyValuesRequests;
