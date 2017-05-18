/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk        from 'redux-thunk';
import createLogger from 'redux-logger';
import locale       from './reducers/locale';
import productGroup from './reducers/productGroup';
import artist       from './reducers/artist';
import Process      from './processes/Process';

const rootReducer = combineReducers({locale,productGroup,artist});
let middleware = [thunk];
if (!PRODUCTION) //eslint-disable-line
  middleware.push(createLogger());

const store = createStore(rootReducer,
                           applyMiddleware(...middleware)
                          );

//init all the things that need to dispatch
//Redux doesnt like dispatch in dispatch:
Process.setDispatch((action) => store.dispatch(action));
const dispatchInNextTick = (action) => process.nextTick(()=>store.dispatch(action));
productGroup.setDispatchInNextTick(dispatchInNextTick);
artist.setDispatchInNextTick(dispatchInNextTick);

export default store;
