/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
function LocalizedStringsChanger(entity,property,valueAsString) {
  this.entity          = entity;
  this.property        = property;
  this.valueAsString   = valueAsString;
}

LocalizedStringsChanger.prototype = Object.create(Object.prototype);
LocalizedStringsChanger.prototype.constructor = LocalizedStringsChanger;

LocalizedStringsChanger.prototype.change = function() {
  this.entity[this.property] = JSON.parse(this.valueAsString);
}

LocalizedStringsChanger.prototype.rollback = function() {
}


export default LocalizedStringsChanger;
