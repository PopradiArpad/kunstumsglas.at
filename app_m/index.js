/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {render} from 'react-dom';
import Root from './components/Root';
require('./assets/stylesheets/main.scss');

render(Root(), document.getElementById('app'));
