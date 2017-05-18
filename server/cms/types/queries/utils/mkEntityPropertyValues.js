/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Datauri             from 'datauri';
import getEntity           from './getEntity';
import getPropertyTypeName from './getPropertyTypeName';

const mkEntityPropertyValues = (entityPropertyValuesRequest) => {
  return getEntity(entityPropertyValuesRequest.identity)
         .then(entity=>mkEntityPropertyValuesI(entity,entityPropertyValuesRequest.properties));
}


const mkEntityPropertyValuesI = (entity, properties) => {
  let schema      = entity.constructor.schema;
  let schemaPaths = schema.paths;

  return Promise.all(properties.map(property=>mkPropertyValueOutput(entity,schemaPaths,property)))
         .then(pvos=>({
           id:             entity.id,
           propertyValues: pvos
         }));
}

const mkPropertyValueOutput = (entity,schemaPaths,property) => {
  let schemaPathsProperty = schemaPaths[property];
  if (! schemaPathsProperty)
    throw new Error(`No ${property} property on db model ${entity.constructor.modelName}`);

  let value = toString(entity[property],schemaPathsProperty.options);

  return {
    property,
    value
  }
}

const toString = (value,schemaPathsPropertyOptions) => {
  switch (getPropertyTypeName(schemaPathsPropertyOptions)) {
    case 'String':
    case 'FileUploadStatus':    return value;
    case 'Boolean':
    case 'ObjectId':            return value.toString();
    case 'Buffer': {
      const datauri = new Datauri();
      datauri.format('.bin',value);
      return datauri.content;
      }
    case 'LocalizedStrings':     return JSON.stringify(value);
    default:
      throw new Error(`Can not create PropertyValueOutput: value ${value} has unsupported type (${schemaPathsPropertyOptions.type}) `);
    }
}


export default mkEntityPropertyValues;
