/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {
        SET_LOCALE,
        SET_ARTIST,
        PROCESS_FINISHED_OK,
        PROCESS_FINISHED_ERROR,
        SetArtist
      } from '../actions';
import LoadArtistProcess from '../processes/LoadArtistProcess';
import {startProcess, isMyRunningProcess}       from './utils';
import merge                   from 'lodash.merge';

const defaultState = {
  _runningProcess:  null,
  _locale:           undefined,
  //    {
  //     name:          string
  //     contact_html:  string
  //    }
  artist:            undefined,
};

const artist = (state=defaultState,action) => {
  switch (action.type) {
    case SET_LOCALE:              return setLocale(state,action);
    case SET_ARTIST:              return setArtist(state,action);
    case PROCESS_FINISHED_OK:     return processFinishedOk(state,action);
    case PROCESS_FINISHED_ERROR:  return processFinishedError(state,action);
    default:
      return state;
  }
}

const setLocale = (state,action) => {
  if (state.artist)
    dispatchInNextTick(new SetArtist(state.artist.name));

  return merge({},state,{_locale:action.locale});
}

const setArtist = (state,action) => {
  return startProcess(state,LoadArtistProcess,action.name,action.pgid,state._locale);
}


const processFinishedOk = (state,action) => {
  if (! isMyRunningProcess(state,action))
    return state;

  switch (state._runningProcess.name) {
    case LoadArtistProcess.processName:         return processOkLoadArtist(state,action);
  }
}

const processFinishedError = (state,action) => {
  if (! isMyRunningProcess(state,action))
    return state;

  console.error('Process error');
  return merge({},state,{_runningProcess:null});
}

const processOkLoadArtist = (state,action) => {
  const artist = action.result;

  return merge({},state,
    //forget the old values completely
    {
      artist:null,
    },
    //merge
    {
     _runningProcess:  null,
     artist
    });
}



let dispatchInNextTick;

artist.setDispatchInNextTick = function(storeDispatchInNextTick) {
  dispatchInNextTick = storeDispatchInNextTick;
}




export default artist;
