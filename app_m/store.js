/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import auth              from './reducers/auth';
import entity            from './reducers/entity';
import error             from './reducers/error';
import Process           from './processes/Process';
import {createStore,
        combineReducers,
        applyMiddleware} from 'redux';
import reduxReset        from 'redux-reset';
import createLogger      from 'redux-logger';

const rootReducer = combineReducers({auth,entity,error});
let middleware = [];
if (!PRODUCTION)// eslint-disable-line
  middleware.push(createLogger());

const store = createStore(rootReducer,
                           applyMiddleware(...middleware),
                           reduxReset()
                          );

//init all the things that need to dispatch
//Redux doesnt like dispatch in dispatch:
const dispatchInNextTick = (action) => process.nextTick(()=>store.dispatch(action));
Process.setDispatch((action) => store.dispatch(action));
auth.setDispatchInNextTick(dispatchInNextTick);
entity.setDispatchInNextTick(dispatchInNextTick);

export default store;
