/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import without    from 'lodash.without';
import union      from 'lodash.union';
import readCurrentWebsiteMessageIdsMap  from './readCurrentWebsiteMessageIdsMap';

const mkLocalizedStringsDescription = (title,property,value,multiline) => {
  return Promise.resolve({
    title,
    property,
    localizedStrings: value.map(localizedString=>new LocalizedString(localizedString)),
    multiline,
    __typename:'LocalizedStringsProperty'
  });
}

const mkTranslatedStringsDescription = (entity,title,property,value) => {

  const getTranslatedStrings = () => {
    return   (entity.translationOf==='website')
             ? readCurrentWebsiteMessageIdsMap()
               .then(messageIdMapToMerge=>mergeIntoTranslatedStrings(value,messageIdMapToMerge))
             : mkUnremovableTranslatedStrings(value);
  }

  return getTranslatedStrings()
         .then(translatedStrings=>({
                                    title,
                                    property,
                                    translatedStrings,
                                    __typename:'TranslatedStringsProperty'
                                    }));
}

const mkUnremovableTranslatedStrings = (translatedStrings) => {
  const localizedStringsMap = mkLocalizedStringsMap(translatedStrings);

  const array = translatedStrings.map(ts=>ts.id).sort().reduce((a,id)=>{
    const localizedStrings = localizedStringsMap[id] || [];

    return a.concat(new TranslatedString(id,localizedStrings,false));
  },[]);

  return Promise.resolve(array);
}

//structure of the result
// {
//  id:[LocalizedString]
// }
const mkLocalizedStringsMap = (translatedStrings) => {
  return translatedStrings.reduce((a,ts)=>{a[ts.id]=ts.localizedStrings;return a;},{});
}


//Merge into the GraphQL type [TranslatedString]
//structure of defaultMessagesMap
// {
//  id:message //The message part is not used because it's not needed. The id must be unique anyway, it must say what is it for
// }
const mergeIntoTranslatedStrings = (translatedStrings,defaultMessagesMap) => {
  const allIds              = getAllIdsSorted(translatedStrings,defaultMessagesMap);
  const localizedStringsMap = mkLocalizedStringsMap(translatedStrings);

  return allIds.reduce((a,id)=>{
    const localizedStringsOfId = localizedStringsMap[id] || [];
    const removable            = ! defaultMessagesMap[id];

    return a.concat(new TranslatedString(id,localizedStringsOfId,removable));
  },[]);
}

const getAllIdsSorted = (translatedStrings,defaultMessagesMap) => {
  const translatedStringsIds = translatedStrings.map(ts=>ts.id);
  const defaultMessageIds    = without(Object.keys(defaultMessagesMap),'_id');

  return union(translatedStringsIds,defaultMessageIds).sort();
}

//A GraphQL type
function TranslatedString(id,localizedStrings,removable) {
  this.id = id;
  this.localizedStrings = localizedStrings.map(localizedString=>new LocalizedString(localizedString));
  this.removable = removable;
}

//A GraphQL type
function LocalizedString({locale,string}) {
  this.locale = locale;
  this.string = string;
}


export {mkLocalizedStringsDescription};
export default mkTranslatedStringsDescription;
