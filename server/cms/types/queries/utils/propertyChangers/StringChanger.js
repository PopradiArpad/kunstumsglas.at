/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
function StringChanger(entity,property,valueAsString) {
  this.entity          = entity;
  this.property        = property;
  this.valueAsString   = valueAsString;
}

StringChanger.prototype = Object.create(Object.prototype);
StringChanger.prototype.constructor = StringChanger;

StringChanger.prototype.change = function() {
  this.entity[this.property] = this.valueAsString;
}

StringChanger.prototype.rollback = function() {
}


export default StringChanger;
