/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose           from 'mongoose';
import translation        from '../schemas/translation';

let Translation = mongoose.model('Translation', translation);

export default Translation;
