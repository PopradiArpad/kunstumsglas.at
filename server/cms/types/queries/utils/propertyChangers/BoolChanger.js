/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
function BoolChanger(entity,property,valueAsString) {
  this.entity          = entity;
  this.property        = property;
  this.valueAsString   = valueAsString;
}

BoolChanger.prototype = Object.create(Object.prototype);
BoolChanger.prototype.constructor = BoolChanger;

BoolChanger.prototype.change = function() {
  this.entity[this.property] = parseBool(this.valueAsString);
}

BoolChanger.prototype.rollback = function() {
}

const parseBool = (string)=>{
  if (string==='true')
    return true;
  if (string==='false')
    return false;

  throw new Error(`${string} can not be converted to bool`);
}


export default BoolChanger;
