/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import path from 'path';


//ATTENTION!!!
//In case of built sw the __dirname is from the server_build/config directory!
//Otherwise the server/config directory!
export const tmpDirPath  = path.resolve(__dirname,'../../tmp');
export const publicPath  = path.resolve(__dirname,'../../public');
export const configPath  = path.resolve(__dirname,'../../server/config');
