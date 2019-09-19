/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import mongoose    from 'mongoose';
import getPropertyTypeName from '../cms/types/queries/utils/getPropertyTypeName';
import Translation from '../cms/types/models/Translation';
import MainView from '../cms/types/models/MainView';
import CacheIn from '../cache/CacheIn';
import cacheOut from '../cache/cacheOut';
import merge from 'lodash/merge';
import isDeepEqual                    from 'lodash.isequal';

const initLocales = (locales) => {
  ensureAllLocalizedStringsPropertyHaveTheCurrentLocales(locales);
  ensureAllProductModelHaveTheCurrentLocales(locales);
  return refreshWebsiteLocalizedData();
}

function refreshWebsiteLocalizedData() {
    return Translation.findOne({translationOf:'website'})
          .then(websiteTranslation => {
            return CacheIn.entityChanged(websiteTranslation);
          })
          .then(() => MainView.findOne())
          .then(mainview => {
            return CacheIn.entityChanged(mainview);
          });
}

const ensureAllProductModelHaveTheCurrentLocales = (locales) => {
  const productModelsWithLocalizedTitles = getAllProductModelsWithLocalizedTitles();

  ensureTranslationFor(productModelsWithLocalizedTitles,locales);
}

const getAllProductModelsWithLocalizedTitles = () => {
  return mongoose.modelNames().reduce((a,modelName)=>{
    const Model = mongoose.model(modelName);

    if (isProductModel(Model)) {
      const localizedTitlesProperties = getLocalizedTitlesProperties(Model);

      if (localizedTitlesProperties.length > 0)
        a[modelName] = localizedTitlesProperties;
    }

    return a;
  },{});
}

const getLocalizedTitlesProperties = (Model) => {
  const schema      = Model.schema;
  const schemaPaths = schema.paths;
  let localizedTitlesProperties = [];

  schema.eachPath(property=>{
    if (isTitleLocalized(schemaPaths[property].options))
      localizedTitlesProperties.push(property);
  });

  return localizedTitlesProperties;
}

const isTitleLocalized = (propertyOptions) => {
  return propertyOptions.hasOwnProperty('titleLocalized');
}

const ensureTranslationFor = (productModelsWithLocalizedTitles,locales) => {
  for(let modelName in productModelsWithLocalizedTitles) {
    const properties = productModelsWithLocalizedTitles[modelName];
    let translation;

    getTranslationOf(modelName)
    .then(_translation=>translation=_translation)
    .then(()=>{
      const translatedStrings        = translation.toObject().translatedStrings;
      const adaptedTranslatedStrings = adaptTranslatedStrings(translatedStrings,properties,locales);

      if (! isDeepEqual(translatedStrings,adaptedTranslatedStrings)) {
        translation.translatedStrings = adaptedTranslatedStrings;
        return translation.save();
      }
    })
    .catch(error=>{
      console.error(`Can not ensure translation for ${modelName}!! Terminate.`);
      console.error(error);
      process.exit(1);
    })
  }
}

const getTranslationOf = (modelName) => {
  return Translation.findOne({translationOf:modelName})
        .then(translation=>{
          return (translation)
                 ? translation
                 : (new Translation({translationOf:modelName})).save();
        })
}

const adaptTranslatedStrings = (translatedStrings,properties,locales) => {
  const tsMap        = translatedStringsMap(translatedStrings);
  const defaultTsMap = defaultTranslatedStringsMap(properties,locales);
  const merged = merge(defaultTsMap,tsMap);

  return toTranslatedStrings(merged);
}

const toTranslatedStrings = (translatedStringsMap) => {
  return Object.keys(translatedStringsMap).reduce((a,property)=>{
    const localizedStringsMap = translatedStringsMap[property];

    a.push({id:property,localizedStrings:toLocalizedStrings(localizedStringsMap)});

    return a;
  },[]);
}

const toLocalizedStrings = (localizedStringsMap) => {
  return Object.keys(localizedStringsMap).reduce((a,locale)=>{
    const string = localizedStringsMap[locale];

    a.push({locale,string});

    return a;
  },[]);
}

const defaultTranslatedStringsMap = (properties,locales) => {
  return properties.reduce((a,property)=>{
    a[property] = defaultLocalizedStringsMap(locales);

    return a;
  },{});
}

const defaultLocalizedStringsMap = (locales) => {
  return locales.reduce((a,locale)=>{
    a[locale] = '';

    return a;
  },{});
}

const translatedStringsMap = (translatedStrings) => {
  return translatedStrings.reduce((a,translatedString)=>{
    a[translatedString.id] = localizedStringsMap(translatedString.localizedStrings);

    return a;
  },{});
}

const localizedStringsMap = (localizedStrings) => {
  return localizedStrings.reduce((a,translatedString)=>{
    a[translatedString.locale] = translatedString.string;

    return a;
  },{});
}






const ensureAllLocalizedStringsPropertyHaveTheCurrentLocales = (locales) => {
  const productModelsWithLocalizedStrings      = getAllProductModelsWithLocalizedStrings();
  const productGroupModelsWithLocalizedStrings = getAllProductGroupModelsWithLocalizedStrings();
  const galleryItemModelsWithLocalizedStrings  = getAllGalleryItemModelsWithLocalizedStrings();
  const userModelsWithLocalizedStrings         = getAllUserModelsWithLocalizedStrings();

  adaptDocuments(locales,productModelsWithLocalizedStrings);
  adaptDocuments(locales,productGroupModelsWithLocalizedStrings);
  adaptDocuments(locales,galleryItemModelsWithLocalizedStrings);
  adaptDocuments(locales,userModelsWithLocalizedStrings);
}

const getAllProductModelsWithLocalizedStrings = () => {
  return mongoose.modelNames().reduce((a,modelName)=>{
    const Model = mongoose.model(modelName);

    if (isProductModel(Model)) {
      const localizedStringsProperties = getLocalizedStringsProperties(Model);

      if (localizedStringsProperties.length > 0)
        a[modelName] = localizedStringsProperties;
    }

    return a;
  },{});
}

const getAllGalleryItemModelsWithLocalizedStrings = () => {
  const modelName = 'GalleryItem';
  const Model     = mongoose.model(modelName);

  return {
    [modelName]: getLocalizedStringsProperties(Model)
  };
}

const getAllProductGroupModelsWithLocalizedStrings = () => {
  const modelName = 'ProductGroup';
  const Model     = mongoose.model(modelName);

  return {
    [modelName]: getLocalizedStringsProperties(Model)
  };
}

const getAllUserModelsWithLocalizedStrings = () => {
  const modelName = 'User';
  const Model     = mongoose.model(modelName);

  return {
    [modelName]: getLocalizedStringsProperties(Model)
  };
}

const isProductModel = (Model) => {
  return Model.baseModelName === 'Product';
}

const getLocalizedStringsProperties = (Model) => {
  const schema      = Model.schema;
  const schemaPaths = schema.paths;
  let localizedStringsProperties = [];

  schema.eachPath(property=>{
    if (getPropertyTypeName(schemaPaths[property].options)==='LocalizedStrings')
      localizedStringsProperties.push(property);
  });

  return localizedStringsProperties;
}

const adaptDocuments = (locales,productModelsWithLocalizedStrings) => {
  for(let modelName in productModelsWithLocalizedStrings) {
    const Model = mongoose.model(modelName);
    const localizedStringsProperties = productModelsWithLocalizedStrings[modelName]

    let docs;
    Model.find({})
    .then(_docs=>docs = _docs)
    .then(()=>docs.forEach(doc=>adaptDocument(doc,localizedStringsProperties,locales)))
    .catch(error=>{
      console.error(`Can not adapt ${Model.modelName} to the current locales!! Terminate.`);
      console.error(error);
      process.exit(1);
    })
    .then(()=>Promise.all(docs.map(doc=>doc.save())))
    .catch(error=>{
      console.error(`Can not save to the current locales adapted ${Model.modelName}!! Terminate.`);
      console.error(error);
      process.exit(1);
    })
  }
}

const adaptDocument = (doc,localizedStringsProperties,locales) => {
  const id = doc._id;

  localizedStringsProperties.forEach(property=>{
    doc[property] = adaptValue(id,property,doc[property],locales)
  })
}

const adaptValue = (id,property,value,locales) => {
  if (value.length===0) {
    console.log(`Adapting ${id}[${property}], current value: ${value}`);

    const newValue = locales.map(locale=>({locale,string:''}));
    console.log(`         new value: ${JSON.stringify(newValue)}`);
    return newValue;
  }

  if (! isLocalizedStrings(value))
    throw new Error(`Cannot adapt ${id}[${property}] to localizedStrings, unknown structure, current value: ${value}`);

  return value;
}

const isLocalizedStrings = (value) => {
  let result = true;

  try {
    for(let i = 0;i<value.length;i++){
      const item = value[i];

      if ((typeof(item.locale)==='string') && (typeof(item.string)==='string'))
        continue;

      throw new Error('');
    }
  } catch (e) {
    return false;
  }

  return result;
}


export default initLocales;
