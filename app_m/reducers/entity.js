/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import {
  LOGOUT,
  LOAD_ENTITY,
  BACK,
  SAVE_ENTITY,
  REMOVE_ENTITY,
  PROCESS_FINISHED_OK,
  PROCESS_FINISHED_ERROR,
  AddError,
  Back,
  LoadEntity
} from '../actions';
import LoadEntityProcess from '../processes/LoadEntityProcess';
import SaveEntityProcess from '../processes/SaveEntityProcess';
import CreateEntityToProcess from '../processes/CreateEntityToProcess';
import RemoveEntityProcess from '../processes/RemoveEntityProcess';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

const defaultState = {
  _runningProcess: null,
  entityDescription: null,
  //    {
  //    identity: {
  //                id,
  //                dbModel
  //              },
  //    propertyDescriptions: [PropertyDescription]
  //    removable:
  //    }
  entityOverviews: {
    //id: {
    //    property: value as string
    //    }
  },
  _history: [],
  backAllowed: false,
  _forcePicReloadEntityId: null,
  _creationContext: null
};

const entity = (state = defaultState, action) => {
  switch (action.type) {
    case LOGOUT:
      return defaultState;
    case LOAD_ENTITY:
      return loadEntity(state, action);
    case BACK:
      return back(state);
    case SAVE_ENTITY:
      return saveEntity(state, action);
    case REMOVE_ENTITY:
      return removeEntity(state, action);
    case PROCESS_FINISHED_OK:
      return processFinishedOk(state, action);
    case PROCESS_FINISHED_ERROR:
      return processFinishedError(state, action);
    default:
      return state;
  }
};

const loadEntity = (state, action) => {
  let newState = state;

  if (action.identity.id === 'temporary') {
    newState = merge({}, state, {
      _creationContext: {
        parentIdentity: action.parentIdentity,
        parentProperty: action.parentProperty
      }
    });
  }

  return startProcess(
    newState,
    LoadEntityProcess,
    action.identity,
    state.entityOverviews
  );
};

const back = state => {
  let lastIdentityInTheHistory = getLastIdentityInTheHistory(state);

  return lastIdentityInTheHistory
    ? startProcess(
        state,
        LoadEntityProcess,
        lastIdentityInTheHistory,
        state.entityOverviews
      )
    : state;
};

const saveEntity = (state, action) => {
  if (action.entityDescriptionDiff.identity.id === 'temporary') {
    return startProcess(
      state,
      CreateEntityToProcess,
      action.entityDescriptionDiff,
      state._creationContext.parentIdentity,
      state._creationContext.parentProperty
    );
  }

  return startProcess(state, SaveEntityProcess, action.entityDescriptionDiff);
};

const removeEntity = (state, action) => {
  if (action.identity.id === 'temporary') {
    dispatchInNextTick(new Back());
    return state;
  }

  return startProcess(
    state,
    RemoveEntityProcess,
    action.identity,
    getLastIdentityInTheHistory(state)
  );
};

const processFinishedOk = (state, action) => {
  if (!isMyRunningProcess(state, action)) return state;

  switch (state._runningProcess.name) {
    case LoadEntityProcess.processName:
      return processOkLoadEntity(state, action);
    case SaveEntityProcess.processName:
      return processOkSaveEntity(state);
    case CreateEntityToProcess.processName:
      return processOkCreateEntityTo(state);
    case RemoveEntityProcess.processName:
      return processOkRemoveEntityProcess(state);
  }
};

const processFinishedError = (state, action) => {
  if (!isMyRunningProcess(state, action)) return state;

  dispatchInNextTick(
    new AddError(state._runningProcess.name, action.errorMessages)
  );
  return merge({}, state, { _runningProcess: null });
};

const processOkLoadEntity = (state, action) => {
  let _history = mkHistoryAfterLoadEntity(
    state.entityDescription,
    state._history,
    action.result.entityDescription.identity
  );
  let backAllowed = isBackAllowed(_history);

  let entityOverviews = action.result.entityOverviews;
  if (
    state._forcePicReloadEntityId &&
    entityOverviews &&
    entityOverviews[state._forcePicReloadEntityId]
  ) {
    entityOverviews = cloneDeep(entityOverviews);
    entityOverviews[state._forcePicReloadEntityId].forcePicReload = true;
  }

  return merge(
    {},
    state,
    //forget the old values completely
    {
      entityDescription: null,
      _history: null
    },
    //merge
    {
      _runningProcess: null,
      entityDescription: action.result.entityDescription,
      entityOverviews,
      _history,
      backAllowed
    }
  );
};

const processOkSaveEntity = state => {
  let entityOverviews = cloneDeep(state.entityOverviews);
  let id = state._runningProcess.identity.id;

  entityOverviews[id] = { forcePicReload: true };

  if (
    state._forcePicReloadEntityId &&
    entityOverviews &&
    entityOverviews[state._forcePicReloadEntityId]
  )
    delete entityOverviews[state._forcePicReloadEntityId].forcePicReload;

  let _forcePicReloadEntityId = id;

  if (id === 'mainview')
    dispatchInNextTick(new LoadEntity(state._runningProcess.identity));
  else dispatchInNextTick(new Back());

  return merge(
    {},
    state,
    //forget the old values completely
    {
      entityOverviews: null,
      _forcePicReloadEntityId: null
    },
    //merge
    {
      _runningProcess: null,
      entityOverviews,
      _forcePicReloadEntityId
    }
  );
};

const processOkCreateEntityTo = state => {
  dispatchInNextTick(new Back());

  return merge({}, state, {
    _runningProcess: null,
    _creationContext: null
  });
};

const processOkRemoveEntityProcess = state => {
  let entityOverviews = cloneDeep(state.entityOverviews);
  delete entityOverviews[state._runningProcess.identity.id];

  dispatchInNextTick(new Back());

  return merge(
    {},
    state,
    //forget the old values completely
    {
      entityOverviews: null
    },
    {
      _runningProcess: null,
      entityOverviews
    }
  );
};

const mkHistoryAfterLoadEntity = (
  currentEntityDescription,
  _history,
  newIdentity
) => {
  // identities of the viewed entities in the time line: time goes right
  // [...,the_last_but_one_identity_in_the_history, the_last_identity_in_the_history] current_identity new_identity
  //if new_identity and the_last_identity_in_the_history are the same
  //that means we goes back and the history should be
  //[...,the_last_but_one_identity_in_the_history]
  //else we goes forward and the history should be
  // [...,the_last_identity_in_the_history,current_identity new_entity]

  let history = cloneDeep(_history);
  let lastIdentityInTheHistory = history[history.length - 1];
  let backward =
    lastIdentityInTheHistory && lastIdentityInTheHistory.id === newIdentity.id;

  if (backward) history.pop();
  else {
    if (
      currentEntityDescription &&
      currentEntityDescription.identity.id !== newIdentity.id
    )
      history.push(currentEntityDescription.identity);
  }

  return history;
};

const isBackAllowed = history => {
  return history.length > 0;
};

// utils
//--------------
let dispatchInNextTick;

const startProcess = (state, process, p1, p2, p3, p4) => {
  if (state._runningProcess) return state;

  let _runningProcess = process.create();
  _runningProcess.start(p1, p2, p3, p4);

  return merge({}, state, { _runningProcess });
};

const isMyRunningProcess = (state, action) => {
  let _runningProcess = state._runningProcess;

  return _runningProcess && _runningProcess.name === action.processName;
};

const getLastIdentityInTheHistory = state => {
  let _history = state._history;

  return _history[_history.length - 1];
};

entity.setDispatchInNextTick = function(storeDispatchInNextTick) {
  dispatchInNextTick = storeDispatchInNextTick;
};

export default entity;
