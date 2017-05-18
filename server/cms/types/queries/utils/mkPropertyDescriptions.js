/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import Datauri                        from 'datauri';
import getPropertyTypeName            from './getPropertyTypeName';
import {getReferredDbModelName}       from './propertyChangers/IdArrayChanger';
import mkTranslatedStringsDescription, {mkLocalizedStringsDescription} from './propertyDescriptionFactories/mkTranslatedStringsDescription';

const mkPropertyDescriptions = (entity,schema) => {
  let viewDescriptions = [];
  let schemaPaths      = schema.paths;

  schema.eachPath(property=>{
    let propertyOptions = schemaPaths[property].options;

    if (! propertyOptions.hasOwnProperty('title'))
      return;

    viewDescriptions.push(mkPropertyDescription(entity,schema,property));
  });

  return Promise.all(viewDescriptions);
}

const mkPropertyDescription = (entity,schema,property) => {
  let value = entity[property];
  let schemaPaths = schema.paths;
  let propertyOptions = schemaPaths[property].options;
  let title = propertyOptions.title;

  switch (getPropertyTypeName(propertyOptions)) {
    case 'String':
      return mkStringDescription(title,property,value,propertyOptions);
    case 'Boolean':
      return mkBooleanDescription(title,property,value);
    case 'Buffer':
      return mkDataURLDescription(title,property,value);
    case 'FileUploadStatus':
      return mkFileUploadStatusDescription(title,property,value,propertyOptions);
    case 'IdArray': {
      let referredDbModelName = getReferredDbModelName(entity,propertyOptions);

      const options = (entity.id==='mainview')
                      ? {reordeingAllowed:     true,
                         createNewItemAllowed: false,
                         removeItemAllowed:    false}
                      : {reordeingAllowed:     true,
                         createNewItemAllowed: true,
                         removeItemAllowed:    true}

      return mkIdArrayDescription(title,
                                  property,
                                  value,
                                  referredDbModelName,
                                  options
                                );
    }
    case 'TranslatedStrings': {
      return mkTranslatedStringsDescription(entity,
                                            title,
                                            property,
                                            value
                                            );
    }
    case 'LocalizedStrings': {
      const multiline = !! propertyOptions.multiline;
      return mkLocalizedStringsDescription(title,property,value,multiline);
    }
  }
}

const mkStringDescription = (title,property,string,propertyOptions) => {
  let multiline = !! propertyOptions.multiline;

  return Promise.resolve({
    title,
    property,
    string,
    multiline,
    __typename:'StringProperty'
  });
}

const mkBooleanDescription = (title,property,bool) => {
  return Promise.resolve({
    title,
    property,
    bool,
    __typename:'BooleanProperty'
  });
}

const mkDataURLDescription = (title,property,buffer) => {
  const datauri = new Datauri();
  datauri.format('.bin',buffer);
  let dataurl = datauri.content;

  return Promise.resolve({
    title,
    property,
    dataurl,
    __typename:'DataURLProperty'
  });
}

const mkFileUploadStatusDescription = (title,property,value,propertyOptions) => {
  let uploadStatus  = value;
  let fileExtension = propertyOptions.extension;

  return Promise.resolve({
    title,
    property,
    uploadStatus,
    fileExtension,
    __typename:'FileUploadStatusProperty'
  });
}

const mkIdArrayDescription = (title,
                              property,
                              ids,
                              referredDbModel,
                              options) => {
  if (typeof(referredDbModel)==="function")
    referredDbModel = referredDbModel.modelName;

  let reordeingAllowed     = setFlag(options, 'reordeingAllowed',    true);
  let createNewItemAllowed = setFlag(options, 'createNewItemAllowed',true);
  let removeItemAllowed    = setFlag(options, 'removeItemAllowed',   true);

  return Promise.resolve({
    title,
    property,
    ids,
    referredDbModel,
    reordeingAllowed,
    createNewItemAllowed,
    removeItemAllowed,
    __typename:'IdArrayProperty'
  });
}

const setFlag = (options,flagName,defaultValue) => {
  return options.hasOwnProperty(flagName)  ? options[flagName]  : defaultValue;
}


export default mkPropertyDescriptions;
