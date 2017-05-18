/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import fs         from 'fs';
import promisify  from 'es6-promisify';
import path       from 'path';

const readFile = promisify(fs.readFile);
const defaultMessagesFileName = path.resolve(__dirname, '../../../../../../app_w/i18n/defaultMessages.json');

//return structure is same as of the defaultMessages.json content
// {
//  id: defaultMessage
// }
const readCurrentWebsiteMessageIdsMap = () => {
  return readFile(defaultMessagesFileName, 'utf8')
         .then(defaultMessagesFile=>JSON.parse(defaultMessagesFile));
}

export default readCurrentWebsiteMessageIdsMap;
