/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React             from 'react';
import store             from '../store';
import { Provider }      from 'react-redux';
import App               from './App';



const Root = () => <Provider store={store}><App/></Provider>;

export default Root;
