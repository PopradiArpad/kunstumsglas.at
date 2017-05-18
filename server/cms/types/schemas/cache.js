/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose                 from 'mongoose';
import { normalize, schema }    from 'normalizr';
const EventEmitter = require('events').EventEmitter;
import ProductGroup             from '../models/ProductGroup';
import MainView                 from '../models/MainView';
import zipObject                from 'lodash.zipobject';
import {getString}              from '../schemaTypes/TranslatedString';

var cacheSchema = mongoose.Schema({
  //partial data to create the big cached ones
  //WARNING: if order is important use array, because the implicit order of the keys
  //in an object will be changed during database save!
  //structure
  // {
  //  locale: {
  //           productGroups: [
  //                           {
  //                            id:      string,
  //                            name:    string,
  //                            gallery: {[
  //                                      line1: string
  //                                      line2: string
  //                                      id:    string
  //                                    ]}
  //                            }
  //                          ]
  //           }
  // }
  _websiteLandingPageData:        Object,
  //partial data to create the big cached ones
  //structure
  // {
  //  locale: {
  //          message id: string
  //          }
  // }
  _websiteLocalizedMessages:        Object,
  //structure
  // {
  //  locale: stringified {
  //                      localizedMessages: structure of _websiteLocalizedMessages
  //                      landingPageData:   structure of _websiteLandingPageData
  //                      }
  // }
  websiteLocalizedData:             Object,
  locales:                          [String]
});

let eventEmitter = new EventEmitter();

cacheSchema.statics.eventEmitter = function() {
  return eventEmitter;
}

cacheSchema.post('save', () => eventEmitter.emit('changed'));



//WARNING: the entity here is not a Mongoose document like
//everywhere else in the code but the plain object from that document
//got with document.toObject()
cacheSchema.methods.refresh = function(modelName,baseModelName,entity,entityRemoved) {
  switch (baseModelName) {
    case 'Product':
      return ProductGroup.refreshListedProductsAfterProductChangeOrRemove(entity,entityRemoved);
    default:
  }

  switch (modelName) {
    case 'Translation':
      if (entity.translationOf==='website') {
         this.setWebsiteLocalizedMessages(entityRemoved ? [] : entity.translatedStrings);
         return this.save();
      }
      break;
    case 'MainView':
    case 'ProductGroup':
    case 'GalleryItem':
     return this.setWebsiteLandingPageData()
            .then(()=>this.save());
    default:
  }
}

cacheSchema.methods.setWebsiteLandingPageData = function() {
  return Promise.all(this.locales.map(locale=>this.getWebsiteLandingPageProductGroupsData(locale)))
         .then(websiteLandingPageProductGroupsDatas=>zipObject(this.locales,websiteLandingPageProductGroupsDatas))
         .then(_websiteLandingPageData=>{
            this._websiteLandingPageData = _websiteLandingPageData;
            this.markModified('_websiteLandingPageData');
            this.refreshWebsiteLocalizedData();
         });
}

cacheSchema.methods.getWebsiteLandingPageProductGroupsData = function(locale) {
  return MainView.findOne({},{productGroups:1})
         .then(mainView=>Promise.all(mainView.toObject().productGroups.map(objectId=>{
             return ProductGroup.findById(objectId)
                    .populate('gallery')
                    .then(pg=>pg.toObject());
         })))
         .then(productGroups=>productGroups.filter(productGroup=>productGroup.online))
         .then(productGroups=>{
            return productGroups.reduce((b,productGroup)=>{
              b.push({
                      id:      productGroup._id,
                      name:    productGroup.name,
                      gallery: productGroup.gallery.map(galleryItem=>({
                                                                     line1: getString(galleryItem.line1,locale),
                                                                     line2: getString(galleryItem.line2,locale),
                                                                     id:    galleryItem._id
                                                                     })
                                                        )
                      });
              return b;
            },[]);
         })
         .then(data=>({productGroups:data}));
}

cacheSchema.methods.setWebsiteLocalizedMessages = function(translatedStrings) {
  const normalizedTranslatedStrings = normalize(translatedStrings,[translatedStringSchema]);
  const locales                     = getUsedLocales(translatedStrings);
  const localizedStrings            = normalizedTranslatedStrings.entities.localizedStrings;
  const translatedStringIds         = normalizedTranslatedStrings.result;

  const _websiteLocalizedMessages = locales.reduce((a,locale)=>{
    a[locale] = translatedStringIds.reduce((b,id)=>{
      b[id] = localizedStrings[localizedStringId(id,locale)].string;
      return b;
    },{});

    return a;
  },{});

  this._websiteLocalizedMessages = _websiteLocalizedMessages;
  this.markModified('_websiteLocalizedMessages');
  this.locales         = locales;

  this.refreshWebsiteLocalizedData();
}

cacheSchema.methods.refreshWebsiteLocalizedData = function() {
  const websiteLocalizedData = this.locales.reduce((a,locale)=>{
    a[locale] = JSON.stringify({
          localizedMessages: this._websiteLocalizedMessages[locale],
          landingPageData:   this._websiteLandingPageData[locale]
    });

    return a;
  },{});

  this.websiteLocalizedData = websiteLocalizedData;
  this.markModified('websiteLocalizedData');
}


//TODO: unify with the normalizing of translationview
const localizedStringId      = (id,locale)=>`${id}_${locale}`;
const localizedStringSchema  = new schema.Entity('localizedStrings',  {}, { idAttribute: (value,parent)=>localizedStringId(parent.id,value.locale)});
const translatedStringSchema = new schema.Entity('translatedStrings', {localizedStrings:[localizedStringSchema]});

const getUsedLocales = (translatedStrings) => {
    return translatedStrings.reduce((a,ts)=>
      ts.localizedStrings.reduce((b,t)=>b.includes(t.locale) ? b : b.concat(t.locale),a)
    ,[]);
  }


export default cacheSchema;
