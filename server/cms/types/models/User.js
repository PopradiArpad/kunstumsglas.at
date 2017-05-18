/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose                    from 'mongoose';
import user                        from '../schemas/user';

let User = mongoose.model('User', user);

export default User;
