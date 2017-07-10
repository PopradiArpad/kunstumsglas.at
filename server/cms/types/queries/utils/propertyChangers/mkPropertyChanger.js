/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import getPropertyTypeName from '../getPropertyTypeName';
import StringChanger from './StringChanger';
import BoolChanger from './BoolChanger';
import PicsChanger from './PicsChanger';
import FileChanger from './FileChanger';
import IdArrayChanger from './IdArrayChanger';
import TranslatedStringsChanger from './TranslatedStringsChanger';
import LocalizedStringsChanger from './LocalizedStringsChanger';

const mkPropertyChanger = function(entity, pv, model, db) {
  let property = pv.property;
  let valueAsString = pv.value;
  let schemaPaths = model.schema.paths;
  let schemaPathsProperty = schemaPaths[property];
  if (!schemaPathsProperty)
    throw new Error(`No ${property} property on db model ${model}`);
  let propertyOptions = schemaPaths[property].options;
  let propertyTypeName = getPropertyTypeName(propertyOptions);
  let Changer = getChangerConstructor(propertyTypeName);

  //A property changer
  //1, can effect more depending properties
  //   like setting the big picture forces to set the small one.
  //2, can check or use some property meta data, that's why model is a parameter
  return Changer.create(entity, property, valueAsString, model, db);
};

const getChangerConstructor = propertyTypeName => {
  switch (propertyTypeName) {
    case 'String':
      return StringChanger;
    case 'Boolean':
      return BoolChanger;
    case 'Buffer':
      return PicsChanger;
    case 'FileUploadStatus':
      return FileChanger;
    case 'IdArray':
      return IdArrayChanger;
    case 'TranslatedStrings':
      return TranslatedStringsChanger;
    case 'LocalizedStrings':
      return LocalizedStringsChanger;
    default:
      throw new Error(
        `Cannot make property changer for ${propertyTypeName} property type`
      );
  }
};

export default mkPropertyChanger;
