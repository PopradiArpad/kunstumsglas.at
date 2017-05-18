/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {tmpDirPath}               from '../../../../config/pathes';
import fse                        from 'fs-extra';
import child_process              from 'child_process';
import {doesFileExistRWSync}      from './doesFileExist';
import bufferFromDataUrl          from './bufferFromDataUrl';

const savePics = (entity,valueAsString) => {
  try {
    setPicBuffers(entity, valueAsString);
  } catch (e)  {
    //TODO: let visible the correct error message at the browser, graphql delivers only an 'error' now
    return Promise.reject(new Error("Bildspeicherfehler"));
  }
}

const setPicBuffers = (entity, bigPicDataUrl) => {
  let id           = entity._id.toString();
  let tmpBigPath   = tmpDirPath+`/bigPic_${id}`;
  let tmpSmallPath = tmpDirPath+`/smallPic_${id}`;

  try {
    fse.mkdirpSync(tmpDirPath);

    let bigPicBuffer = bufferFromDataUrl(bigPicDataUrl);
    fse.writeFileSync(tmpBigPath, bigPicBuffer);
    child_process.execSync('convert '+tmpBigPath+' -resize 400x400 '+tmpSmallPath);
    let smallPicBuffer = fse.readFileSync(tmpSmallPath);

    entity.smallPic  = smallPicBuffer;
    entity.bigPic    = bigPicBuffer;
  } catch (e) {
    throw e;
  } finally {
    rmIfExists(tmpBigPath);
    rmIfExists(tmpSmallPath);
  }
}

const rmIfExists = (path) => {
  if (doesFileExistRWSync(path))
    fse.unlinkSync(path);
}

export default savePics;
