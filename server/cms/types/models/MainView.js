/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

//WARNING DESIGN ERROR: THIS DATA SHOULD BE NOT IN DB.

import mongoose        from 'mongoose';
import mainView        from '../schemas/mainView';

let MainView = mongoose.model('MainView', mainView);

function refresMainView() {
    return MainView.findOne()
          .then(mv => mv.refresh());
}

export {refresMainView};
export default MainView;
