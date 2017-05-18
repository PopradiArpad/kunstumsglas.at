/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import bufferFromDataUrl          from './bufferFromDataUrl';
import BufferStream               from 'bufferstream';

const saveFile = (db)=>(entity,property,valueAsString) => {
  if (isStateStatus(valueAsString))
    return Promise.resolve();

  //else new content comes back
  try {
    let buffer   = bufferFromDataUrl(valueAsString);
    let filename = gfsFileNameOf(entity,property);

    //No replace in GridFs :(
    return removeGfsFileIfExist(db,filename)
           .then(()=>entity[property] = 'NOT_UPLOADED')
           .then(()=>saveBufferToGfs(db.gfs,buffer,filename))
           .then(()=>entity[property] = 'UPLOADED');
  } catch (e) {
    //TODO rollback the gfs file
    throw e;
  }
}

const removeGfsFileIfExist = (db,filename) => {
  return db.gfs_exist({filename})
         .then(fileExist => {
             if (fileExist) {
               return db.gfs_remove({filename});
           }});
}

const saveBufferToGfs = (gfs,buffer,filename) => {
  return new Promise((resolve, reject) => {
    let readstream  = new BufferStream();
    let writestream = gfs.createWriteStream({filename});

    readstream.pipe(writestream);
    readstream.write(buffer);
    readstream.end();

    writestream.on('close', ()  => resolve());
    writestream.on('error', err => reject(err));
  });
}

const isStateStatus = (valueAsString) => {
  return valueAsString==='UPLOADED' || valueAsString==='NOT_UPLOADED';
}

const gfsFileNameOf = (entity,property) => {
  return gfsFileNameOfId(entity._id,property);
}

const gfsFileNameOfId = (id,property) => {
  return `${id}/${property}`;
}

export default saveFile;
