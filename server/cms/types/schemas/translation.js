/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose           from 'mongoose';
import TranslatedString   from '../schemaTypes/TranslatedString';

//Goals:
// Have a structure that is easy to transform to GraphQL types and back from GraphQL input types:
//   -> it must be typed (No direct Object type, each property must be named)
// This structure is not needed to be fast in localizedStrings search
// (where Object would be better) because the website uses the translations from the Cache anyway.
let translation = mongoose.Schema({
  translationOf:     String,
  translatedStrings: {type: [TranslatedString],
                      title: 'Übersetzungen',
                      default: []
                     },
});


export default translation;
