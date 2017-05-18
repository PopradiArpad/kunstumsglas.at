/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose   from 'mongoose';

function TranslatedMessage(key, options) {
  mongoose.SchemaType.call(this, key, options, 'TranslatedMessage');
}

TranslatedMessage.prototype = Object.create(mongoose.SchemaType.prototype);

// `cast()` takes a parameter that can be anything. You need to
// validate the provided `val` and throw a `CastError` if you
// can't convert it.
TranslatedMessage.prototype.cast = function(val) {
  try {
    if (   val.messageId
        && (typeof val.messageId === 'string')
        && val.translations
        && Array.isArray(val.translations)
        && allLocaleTranslationPairs(val.translations)
       )
        return val;

    throw new Error();
  } catch (e) {
    throw new Error('TranslatedMessage: ' + val + ' is not a possible value');
  }
}

const allLocaleTranslationPairs = (vals) => {
  vals.forEach(val=>{
    if (Object.keys(val).length !== 2)
      throw new Error();

    if (! (    (val.locale     && typeof val.locale === 'string')
           && (val.translation && typeof val.translation === 'string')
          )
       )
      throw new Error();
  });

  return true;
}


// Don't forget to add `Int8` to the type registry
mongoose.Schema.Types.TranslatedMessage = TranslatedMessage;
