/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
function TranslatedStringsChanger(entity,property,valueAsString) {
  this.entity          = entity;
  this.property        = property;
  this.valueAsString   = valueAsString;
}

TranslatedStringsChanger.prototype = Object.create(Object.prototype);
TranslatedStringsChanger.prototype.constructor = TranslatedStringsChanger;

TranslatedStringsChanger.prototype.change = function() {
  const translatedStrings = JSON.parse(this.valueAsString).filter(ils=>! ils.remove);

  this.entity[this.property] = translatedStrings;
}

TranslatedStringsChanger.prototype.rollback = function() {
  console.log('TranslatedStringsChanger.prototype.rollback not implemented');
}


export default TranslatedStringsChanger;
