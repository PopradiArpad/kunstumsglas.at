/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {tmpDirPath}               from '../../../../../config/pathes';
import fse                        from 'fs-extra';
import child_process              from 'child_process';
import {doesFileExistRWSync}      from '../doesFileExist';
import bufferFromDataUrl          from '../bufferFromDataUrl';


function PicsChanger(entity,property,valueAsString,model) {
  let schemaPaths      = model.schema.paths;
  if (! (property==='bigPic' && schemaPaths['bigPic'] && schemaPaths['smallPic']))
    return Promise.reject(new Error('Cannot create PicsChanger: pic handling works only with the bigPic/smallPic properties'));

  if (! entity._id)
    throw new Error(`Cannot create PicsChanger: the entity must have a _id`);


  this.entity          = entity;
  this.property        = property;
  this.valueAsString   = valueAsString;
}

PicsChanger.prototype = Object.create(Object.prototype);
PicsChanger.prototype.constructor = PicsChanger;

PicsChanger.prototype.change = function() {
  let id           = this.entity._id.toString();
  let tmpBigPath   = tmpDirPath+`/bigPic_${id}`;
  let tmpSmallPath = tmpDirPath+`/smallPic_${id}`;

  try {
    fse.mkdirpSync(tmpDirPath);

    let bigPicBuffer = bufferFromDataUrl(this.valueAsString);
    fse.writeFileSync(tmpBigPath, bigPicBuffer);
    child_process.execSync('convert '+tmpBigPath+' -resize 400x400 '+tmpSmallPath);
    let smallPicBuffer = fse.readFileSync(tmpSmallPath);

    this.entity.smallPic  = smallPicBuffer;
    this.entity.bigPic    = bigPicBuffer;
  } catch (e) {
    throw e;
  } finally {
    rmIfExists(tmpBigPath);
    rmIfExists(tmpSmallPath);
  }
}

PicsChanger.prototype.rollback = function() {
  console.warn('PicsChanger.prototype.rollback not implemented');
}

const rmIfExists = (path) => {
  if (doesFileExistRWSync(path))
    fse.unlinkSync(path);
}



export default PicsChanger;
