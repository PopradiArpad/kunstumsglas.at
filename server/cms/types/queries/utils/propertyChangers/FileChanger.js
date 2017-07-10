/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import bufferFromDataUrl          from '../bufferFromDataUrl';
import BufferStream               from 'bufferstream';


const FileChanger = {
  create(entity,property,valueAsString,model,db) {
    let changer =Object.create(FileChanger);
    if (! entity._id)
      throw new Error(`Cannot create FileChanger: the entity must have an _id`);

    changer.entity          = entity;
    changer.property        = property;
    changer.valueAsString   = valueAsString;
    changer.db              = db;

    return changer;
  },

  change() {
    if (isStateStatus(this.valueAsString))
      return Promise.resolve();

    //else new content comes back
    try {
      let buffer   = bufferFromDataUrl(this.valueAsString);
      let filename = gfsFileNameOf(this.entity,this.property);

      //No replace in GridFs :(
      return removeGfsFileIfExist(this.db,filename)
             .then(()=>this.entity[this.property] = 'NOT_UPLOADED')
             .then(()=>saveBufferToGfs(this.db.gfs,buffer,filename))
             .then(()=>this.entity[this.property] = 'UPLOADED');
    } catch (e) {
      //TODO rollback the gfs file
      throw e;
    }
  },

  rollback() {
      let filename = gfsFileNameOf(this.entity,this.property);

      return removeGfsFileIfExist(this.db,filename);
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
  return `${entity._id}/${property}`;
}

const removeRelatedGfsFileIfExist = (db,entity,property) => {
  let filename = gfsFileNameOf(entity,property);

  return removeGfsFileIfExist(db,filename);
}


export {removeRelatedGfsFileIfExist}
export default FileChanger;
