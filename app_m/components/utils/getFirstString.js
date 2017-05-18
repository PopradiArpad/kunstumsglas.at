/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
const getFirstString = (entityDescription) => {
    const firstString = getFirstPropertyDescription(entityDescription,'StringProperty');

    if (firstString && firstString['string'])
      return firstString['string'];

    const firstLocalizedString = getFirstPropertyDescription(entityDescription,'LocalizedStringsProperty');

    //temporary entities can have incomplete data
    if (firstLocalizedString && firstLocalizedString['localizedStrings'] && firstLocalizedString['localizedStrings'][0])
      return firstLocalizedString['localizedStrings'][0].string;

    return '';
  }

const getFirstPropertyDescription = (entityDescription,typeName) => {
    return entityDescription.propertyDescriptions.find(pd=>pd.__typename===typeName);
  }

export default getFirstString;
