/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mkEntityPropertyValues from './utils/mkEntityPropertyValues';

const GetEntityPropertyValues = (root, {entityPropertyValuesRequests}) => {
  return Promise.all(entityPropertyValuesRequests.map(mkEntityPropertyValues));
}


export default GetEntityPropertyValues;
