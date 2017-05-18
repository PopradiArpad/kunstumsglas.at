/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose   from 'mongoose';
import {LocalizedString}   from '../schemaTypes/TranslatedString';

//Some app specific path options, which are not from Mongoose or Mongo:
// "title"
let galleryItem = mongoose.Schema({
        line1                          : {type: [LocalizedString], default: [], required: true, title: 'Erste Zeile'},
        line2                          : {type: [LocalizedString], default: [], required: true, title: 'Zweite Zeile'},
        bigPic                         : {type: Buffer, default: '', title: 'bigPic'},
        smallPic                       : Buffer,
});

export default galleryItem;
