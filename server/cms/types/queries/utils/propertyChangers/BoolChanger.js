/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

const BoolChanger = {
  create(entity, property, valueAsString) {
    let changer = Object.create(BoolChanger);

    changer.entity = entity;
    changer.property = property;
    changer.valueAsString = valueAsString;

    return changer;
  },

  change() {
    this.entity[this.property] = parseBool(this.valueAsString);
  },

  rollback() {}
};

const parseBool = string => {
  if (string === 'true') return true;
  if (string === 'false') return false;

  throw new Error(`${string} can not be converted to bool`);
};

export default BoolChanger;
