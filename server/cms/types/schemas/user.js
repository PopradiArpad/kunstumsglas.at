/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose              from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import {LocalizedString}   from '../schemaTypes/TranslatedString';

//Some app specific path options, which are not from Mongoose or Mongo:
// "title"
//TODO: make name and bigPic required and adapt the signup page
var user = mongoose.Schema({
        name:          {type:String, index:1, unique : true,title: 'Name'},
        bigPic:        {type: Buffer,default: '', title: 'bigPic'},
        smallPic:      Buffer,
        contact_html:  {type: [LocalizedString], default: [], title: 'Kontakt page in html', multiline: true}
});

user.plugin(passportLocalMongoose);

export default user;
