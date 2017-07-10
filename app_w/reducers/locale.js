/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import {
  SET_LOCALE,
  SET_NEXT_PRODUCT_GROUP,
  SET_PREVIOUS_PRODUCT_GROUP,
  PROCESS_FINISHED_OK,
  PROCESS_FINISHED_ERROR
} from '../actions';
import LoadLocaleProcess from '../processes/LoadLocaleProcess';
import merge from 'lodash.merge';
import { addLocaleData } from 'react-intl';
import { startProcess, isMyRunningProcess } from './utils';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import { browserHistory } from 'react-router';

addLocaleData([...en, ...de]);

const defaultState = {
  _runningProcess: null,
  locale: undefined,
  //    {
  //    messageId: message
  //    }
  localizedMessages: undefined,
  //    {
  //    locale: {
  //              messageId: message
  //            }
  //    }
  _cachedLocalizedMessages: {},
  //    {
  //    productGroups: [
  //                    {
  //                    id:   string
  //                    gallery: [{
  //                               line1: string,
  //                               line2: string,
  //                               id:    string
  //                             }]
  //                     }
  //                   ]
  //    }
  landingPageData: undefined,
  //    {
  //    locale: same as of landingPageData
  //    }
  _cachedLandingPageData: {}
};

const locale = (state = defaultState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return setLocale(state, action);
    case SET_NEXT_PRODUCT_GROUP:
      return setNextProductGroup(state, action);
    case SET_PREVIOUS_PRODUCT_GROUP:
      return setPreviousProductGroup(state, action);
    case PROCESS_FINISHED_OK:
      return processFinishedOk(state, action);
    case PROCESS_FINISHED_ERROR:
      return processFinishedError(state, action);
    default:
      return state;
  }
};

const setLocale = (state, action) => {
  const localizedMessages = state._cachedLocalizedMessages[action.locale];
  const landingPageData = state._cachedLandingPageData[action.locale];

  if (localizedMessages || landingPageData) {
    let newState = merge({}, state);

    if (localizedMessages)
      newState = merge(
        newState,
        { locale: action.locale },
        { localizedMessages }
      );

    if (landingPageData)
      newState = merge(
        newState,
        { locale: action.locale },
        { landingPageData }
      );

    return newState;
  }

  return startProcess(state, LoadLocaleProcess, action.locale);
};

const setNextProductGroup = (state, action) => {
  const { productGroupIx, productGroupIds } = getProductGroupIx(
    state,
    action.currentPgId
  );
  const nextProductGroupIx = productGroupIx < productGroupIds.length - 1
    ? productGroupIx + 1
    : 0;
  const nextProductGroupId = productGroupIds[nextProductGroupIx];
  pushBrowserHistoryToProductGroup(nextProductGroupId);
  return state;
};

const setPreviousProductGroup = (state, action) => {
  const { productGroupIx, productGroupIds } = getProductGroupIx(
    state,
    action.currentPgId
  );
  const nextProductGroupIx = productGroupIx > 0
    ? productGroupIx - 1
    : productGroupIds.length - 1;
  const nextProductGroupId = productGroupIds[nextProductGroupIx];
  pushBrowserHistoryToProductGroup(nextProductGroupId);
  return state;
};

const processFinishedOk = (state, action) => {
  if (!isMyRunningProcess(state, action)) return state;

  switch (state._runningProcess.name) {
    case LoadLocaleProcess.processName:
      return processOkLoadLocale(state, action);
  }
};

const processFinishedError = (state, action) => {
  if (!isMyRunningProcess(state, action)) return state;

  console.error('Process error');
  return merge({}, state, { _runningProcess: null });
};

const processOkLoadLocale = (state, action) => {
  const locale = state._runningProcess.locale;
  const localizedMessages = action.result.localizedMessages;
  const landingPageData = action.result.landingPageData;

  return merge(
    {},
    state,
    //forget the old values completely
    {
      localizedMessages: null,
      landingPageData: null
    },
    //merge
    {
      _runningProcess: null,
      locale,
      localizedMessages,
      landingPageData,
      _cachedLocalizedMessages: { [locale]: localizedMessages },
      _cachedLandingPageData: { [locale]: landingPageData }
    }
  );
};

const getProductGroupIx = (state, pgid) => {
  const productGroups = state.landingPageData.productGroups;
  const productGroupIds = productGroups.map(pg => pg.id);
  const productGroupIx = productGroupIds.findIndex(_pgid => _pgid === pgid);
  return { productGroupIx, productGroupIds };
};

//url takes precedence over state regarding entities to show to let refresh work
const pushBrowserHistoryToProductGroup = productGroupId => {
  //setting new path results in Error: Reducers may not dispatch actions.
  setImmediate(() => {
    browserHistory.push(`/productgroup/${productGroupId}`);
  });
};

export default locale;
