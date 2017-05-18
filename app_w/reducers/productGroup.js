/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {
        SET_PRODUCT_GROUP,
        SET_PRODUCT,
        SET_LOCALE,
        SET_NEXT_PRODUCT,
        SET_PREVIOUS_PRODUCT,
        PROCESS_FINISHED_OK,
        PROCESS_FINISHED_ERROR,
        SetProduct,
        SetProductGroup,
      } from '../actions';
import LoadProductGroupProcess from '../processes/LoadProductGroupProcess';
import LoadProductProcess from '../processes/LoadProductProcess';
import {startProcess, isMyRunningProcess}       from './utils';
import merge                   from 'lodash.merge';
import {browserHistory}               from 'react-router';

//The product and product group data are coupled by the feature set next/previous product
//To get the next/previous product the belonging product group is needed.
const defaultState = {
  _runningProcess:  null,
  //    {
  //     id:                   string,
  //     locale:               string,
  //     artistName:           string
  //     name:                 string
  //     productIds:           [string]
  //     introduction_html:    localizedstring
  //     localizedName:        localizedstring
  //    }
  productGroup:           undefined,
  //    {
  //     id: {
  //          locale:   like of productGroup
  //         }
  //    }
  _cachedProductGroups:   {},
  //    {
  //     id:         string
  //     properties: {
  //                 property: {
  //                           title: string or undefined if the title is not to shown
  //                           value: string
  //                           }
  //                 }
  //    }
  product:           undefined,
  productIx:         undefined,
  _locale:           undefined,
};

const productGroup = (state=defaultState,action) => {
  switch (action.type) {
    case SET_PRODUCT_GROUP:       return setProductGroup(state,action);
    case SET_PRODUCT:             return setProduct(state,action);
    case SET_LOCALE:              return setLocale(state,action);
    case SET_NEXT_PRODUCT:        return setNextProduct(state);
    case SET_PREVIOUS_PRODUCT:    return setPreviousProduct(state);
    case PROCESS_FINISHED_OK:     return processFinishedOk(state,action);
    case PROCESS_FINISHED_ERROR:  return processFinishedError(state,action);
    default:
      return state;
  }
}

const setProductGroup = (state,action) => {
  const productGroupLocale = state._cachedProductGroups[action.id];

  if (productGroupLocale && productGroupLocale[state._locale])
    return merge({},state,{productGroup:null},{productGroup:productGroupLocale[state._locale]});

  return startProcess(state,LoadProductGroupProcess,action.id,state._locale);
}

const setProduct = (state,action) => {
  return startProcess(state,LoadProductProcess,action.pid,action.pgid,state._locale);
}

const setLocale = (state,action) => {
  if (state.product)
    dispatchInNextTick(new SetProduct(state.product.id,state.productGroup.id));
  else if (state.productGroup)
    dispatchInNextTick(new SetProductGroup(state.productGroup.id));

  return merge({},state,{_locale:action.locale});
}

const setNextProduct = (state) => {
  const {productIx,productIds}  = getProductIx(state);
  const nextProductIx = (productIx<productIds.length-1) ? productIx+1 : 0;
  const nextProductId = productIds[nextProductIx];
  pushBrowserHistoryToProduct(state.productGroup.id,nextProductId);
  return state;
}

const setPreviousProduct = (state) => {
  const {productIx,productIds}  = getProductIx(state);
  const nextProductIx = (productIx>0) ? productIx-1 : productIds.length-1;
  const nextProductId = productIds[nextProductIx];
  pushBrowserHistoryToProduct(state.productGroup.id,nextProductId);
  return state;
}

const processFinishedOk = (state,action) => {
  if (! isMyRunningProcess(state,action))
    return state;

  switch (state._runningProcess.name) {
    case LoadProductGroupProcess.processName:   return processOkLoadProductGroup(state,action);
    case LoadProductProcess.processName:        return processOkLoadProduct(state,action);
  }
}

const processFinishedError = (state,action) => {
  if (! isMyRunningProcess(state,action))
    return state;

  console.error('Process error');
  return merge({},state,{_runningProcess:null});
}

const processOkLoadProductGroup = (state,action) => {
  const productGroup = action.result;
  const id           = state._runningProcess.id;
  const locale       = productGroup.locale;

  return merge({},state,
    //forget the old values completely
    {
      productGroup:null,
    },
    //merge
    {
     _runningProcess:  null,
     productGroup,
     _cachedProductGroups: {[id]:{[locale]:productGroup}},
    });
}

const processOkLoadProduct = (state,action) => {
  const product = action.result;

  if (! state.productGroup || (state.productGroup.id !== state._runningProcess.pgid) || (state.productGroup.locale !== state._locale))
    dispatchInNextTick(new SetProductGroup(state._runningProcess.pgid));

  return merge({},state,
    //forget the old values completely
    {
      product:null,
    },
    //merge
    {
     _runningProcess:  null,
     product
    });
}


const getProductIx = (state) => {
  const product    = state.product;
  const productIds = state.productGroup.productIds;
  const productIx  = productIds.findIndex(pid=>pid===product.id);
  return {productIx,productIds};
}

//url takes precedence over state regarding entities to show to let refresh work
const pushBrowserHistoryToProduct = (productGroupId,nextProductId) => {
  //setting new path results in Error: Reducers may not dispatch actions.
  setImmediate(()=>{
    browserHistory.push(`/product/${productGroupId}/${nextProductId}`);
  });
}


let dispatchInNextTick;

productGroup.setDispatchInNextTick = function(storeDispatchInNextTick) {
  dispatchInNextTick = storeDispatchInNextTick;
}




export default productGroup;
