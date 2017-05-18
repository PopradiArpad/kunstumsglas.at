/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
const fs    = require('fs');
const glob  = require('glob');

const filePattern             = './app_w/build/messages/**/*.json';
const defaultMessagesFileName = './app_w/i18n/defaultMessages.json';

function MakeDefaultMessagesWebpackPlugin() {
}


MakeDefaultMessagesWebpackPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compiler, callback) {

    console.log("Making default messages from react-intl messages...");
    // {
    //  id:message
    // }
    let defaultMessages = mkDefaultMessages(filePattern);
    fs.writeFileSync(defaultMessagesFileName, stringifyJSON(defaultMessages));
    console.log("Making default messages from react-intl messages...done");

    callback();
  });
}


// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`.
//structure
// {
//  id:message
// }
const mkDefaultMessages = (filePattern) => {
  let defaultMessages = glob.sync(filePattern)
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .reduce((collection, descriptors) => {
      descriptors.forEach(({id, defaultMessage}) => {
        //duplicate usage of the same id is allowed
        if (! collection.hasOwnProperty(id)) {
          collection[id] = defaultMessage;
        }
      });

      return collection;
    }, {});

  return defaultMessages;
}

const stringifyJSON = (json) => JSON.stringify(json, null, 2);

module.exports = {
  MakeDefaultMessagesWebpackPlugin
}
