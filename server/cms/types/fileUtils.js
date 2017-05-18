/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
export const gfsFileNameOfId = (id,property) => `${id}/${property}`;
import {InternalServerError}          from '../../error/KugmError';

export const sendBufferAsOctetStream = (res,buffer,next) => {
  try {
    //From https://spin.atomicobject.com/2015/10/03/remote-pfs-node-js-express/
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Length': buffer.length});
    res.end(buffer);
  } catch(e) {
    next(new InternalServerError(`Can not send buffer as octet-stream!`));
  }
}

export const sendFileFromGfs = (res,db,id,property,next) => {
  let filename;

  try {
    filename       = gfsFileNameOfId(id,property);
    let readstream = db.gfs.createReadStream({filename});

    readstream.on('error', (err)=>{
      console.log('Error at reading gfs!', err);
      throw err;
    });
    //TODO: res.writeHeader ?
    readstream.pipe(res);
  } catch (e) {
    next(new InternalServerError(`Failed sending file ${filename} from gfs!`));
  }
}
