/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import mongoose  from 'mongoose';
import Grid      from 'gridfs-stream';
import promisify from 'es6-promisify';

var attempts = 0;

const connectToDb = (config_db) => {
  return new Promise((resolve, reject)=>{
    // Use native promises instead of mongoose's own lib: http://mongoosejs.com/docs/promises.html
    mongoose.Promise = global.Promise;

    //Really mongoose.connection is only the connection to mongod
    //To get the mongo db for direct mongo usage use: mongoose.connection.db
    let con = mongoose.connection;
    mongoose.connect(config_db.url);

    con.on('error', (err) => {
      if (attempts < 10) {
        attempts++;
        console.error("Database is not accessible. Sleeping");
        setTimeout(()=>connectToDb(config_db),1000);
      } else {
        reject(new Error('Unable to connect to the database after '+attempts+' attempts: ' + err.message));
      }
    });

    if (attempts === 0) {
      con.once('open',function () {
        con.gfs        = Grid(con.db, mongoose.mongo);
        con.gfs_exist  = promisify(con.gfs.exist, con.gfs);
        con.gfs_remove = promisify(con.gfs.remove,con.gfs);

        console.log("Connected to database.");
        resolve(con);
      });
    }
  });
}

export default connectToDb;
