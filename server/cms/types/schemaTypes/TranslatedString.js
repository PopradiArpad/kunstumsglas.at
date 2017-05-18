/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose   from 'mongoose';

let LocalizedString = mongoose.Schema({
  locale:String,
  string:String
}, { _id: false });

let TranslatedString = mongoose.Schema({
  id:String,
  localizedStrings: [LocalizedString]
}, { _id: false });

const getString = (localizedStrings,locale) => {
  const localizedString = localizedStrings.find(localizedString=>localizedString.locale===locale);

  if (!localizedString)
    throw new Error(`No locale ${locale} on ${localizedStrings}!`);

  return localizedString.string;
}

export {LocalizedString,getString};
export default TranslatedString;
