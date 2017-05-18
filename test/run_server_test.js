/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
//THIS SCRIPT MUST BE STARTED FROM THE PROJECT ROOT TO LET MOCHA FIND THE DEPENDENCIES
//====================================================================================
//EXAMPLE:
//npm run test_server -- --db_port 30002 --port 3000 -g 'change product'

var fse              = require('fs-extra');
var path             = require('path');
var testDbDir        = path.resolve(__dirname,"test_db");
var testPublicPath   = path.resolve(__dirname,"public");
var tmpDirPath       = path.resolve(__dirname,'../server/tmp');
var configPath       = path.resolve(__dirname,'../server/config');
var REGISTRATION_IS_ALLOWED_Path = configPath+'/REGISTRATION_IS_ALLOWED';

if (process.env.NODE_ENV !== "test")
  throw new Error("Not in test mode! Running in not test could danger the production database!");


var wait_for_mongod_start_ms  = 200;
var wait_for_mongod_finish_ms = 350;

const createFreshTestDir = (dir, functionality) => {
  fse.removeSync(dir);
  fse.mkdirsSync(dir);
  console.log(`A fresh ${functionality} created in ${dir}`);
}

const startMongodProcess = () => {
  let spawn=require('child_process').spawn;
  let configDb = require('../server/config/db.js');
  let mongodParamLine = `--dbpath ${testDbDir} --port ${configDb.port}`;
  let process = spawn('mongod', mongodParamLine.split(' '), {});
  process.on('error', (err) => {
    console.log(`Failed to start mongod.`,err);
  });
  console.log(`Starting mongod: mongod ${mongodParamLine}, PID: ${process.pid}`);
  console.log(`Waiting time for the mongod to start up: ${wait_for_mongod_start_ms} ms`);

  return process;
}

const createIndex_html = () => {
 fse.openSync(testPublicPath+'/index.html', 'w');
}

const create_REGISTRATION_IS_ALLOWED = () => {
 fse.openSync(REGISTRATION_IS_ALLOWED_Path, 'w');
 console.log(REGISTRATION_IS_ALLOWED_Path, ' is created');
}

const runMochaTest = () => {
  var spawnSync=require('child_process').spawnSync;
  let mochaParameters = process.argv.slice(3);
  mochaParameters = ['server/features'].concat(mochaParameters);
  console.log(`mocha parameters: ${mochaParameters.join(' ')} `);
  spawnSync('mocha', mochaParameters, {stdio:'inherit'});
}


createFreshTestDir(testDbDir,      'test db dir');
createFreshTestDir(testPublicPath, 'public dir');
createIndex_html();
create_REGISTRATION_IS_ALLOWED();
let mongod_process = startMongodProcess();
setTimeout( function () {
  runMochaTest();

  fse.removeSync(REGISTRATION_IS_ALLOWED_Path);
  console.log(`${REGISTRATION_IS_ALLOWED_Path} removed`);

  mongod_process.kill();
  console.log(`Mongod is stopping`);
  console.log(`Waiting time for the mongod to finish: ${wait_for_mongod_finish_ms} ms`);

  setTimeout( function () {
    fse.removeSync(testDbDir);
    console.log(`Test db removed`);

    fse.removeSync(testPublicPath);
    console.log(`Test public dir removed`);

    fse.removeSync(tmpDirPath);
    console.log(`Tmp dir removed`);
  }, wait_for_mongod_finish_ms);
}, wait_for_mongod_start_ms);
