/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import getEntity from './getEntity';
import getModel from './getModel';
import Translation from '../../models/Translation';
import {getString} from '../../schemaTypes/TranslatedString';
import getPropertyTypeName from './getPropertyTypeName';

const mkProductDescriptionForCustomer = (id,locale) => {
  let entity;
  let Model;

  return getEntity({id,dbModel:'Product'})
         .then(_entity=>{
           entity = _entity;
           Model  = getModel(entity);
           return Translation.findOne({translationOf:Model.modelName})
                  .then(translation=>translation.toObject().translatedStrings);
         })
         .then(translatedStrings=>{
           const Model      = getModel(entity);
           const schema     = Model.schema;
           const schemaPaths = schema.paths;
           let properties = {};

           schema.eachPath(property=>{
             const options = schemaPaths[property].options;

             if (! (options.hasOwnProperty('forCustomer') && options.forCustomer))
              return;

            const title = getLocalizedTitle(property,options,translatedStrings,locale);
            const value = getLocalizedValue(entity[property],options,locale);

            if (value!=='')
              properties[property] = {title,value};
           });

           return {id:entity.id,
                   properties};
         });
}

const getLocalizedTitle = (property,options,translatedStrings,locale) => {
  const translatedString = translatedStrings.find(ts=>ts.id===property);

  return translatedString
         ? translatedString.localizedStrings.find(localizedString=>localizedString.locale===locale).string
         : undefined;
}

const getLocalizedValue = (value,options,locale) => {
  switch (getPropertyTypeName(options)) {
    case 'LocalizedStrings':
      return getString(value,locale);
    default:
      return value;
  }
}

export default mkProductDescriptionForCustomer;
