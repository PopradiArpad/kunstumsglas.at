/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 

const getPropertyTypeName = (schemaPathsPropertyOptions) => {
  let propertyType = schemaPathsPropertyOptions.type;
  let propertyTypeName = propertyType.name;

  if (propertyTypeName)
    return propertyTypeName;
  else if (isIdArray(propertyType))
    return 'IdArray';
  else if (isTranslatedStrings(propertyType))
    return 'TranslatedStrings';
  else if (isLocalizedStrings(propertyType))
    return 'LocalizedStrings';
  else
    throw new Error(`Can not get property type name: unsupported type structure`);
}

const isIdArray = (propertyType) => {
  let propertyType0 = propertyType[0];

  return propertyType0
      && propertyType0.type
      && propertyType0.type.name==='ObjectId';
}

const isTranslatedStrings = (propertyType) => {
  let propertyType0 = propertyType[0];

  return propertyType0
      && propertyType0.paths
      && propertyType0.paths.id
      && propertyType0.paths.localizedStrings;
}

const isLocalizedStrings = (propertyType) => {
  let propertyType0 = propertyType[0];

  return propertyType0
      && propertyType0.paths
      && propertyType0.paths.locale
      && propertyType0.paths.string;
}


export default getPropertyTypeName;
