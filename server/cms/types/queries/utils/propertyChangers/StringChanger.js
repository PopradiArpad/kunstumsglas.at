/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

const StringChanger = {
  create(entity, property, valueAsString) {
    let changer = Object.create(StringChanger);

    changer.entity = entity;
    changer.property = property;
    changer.valueAsString = valueAsString;

    return changer;
  },

  change() {
    this.entity[this.property] = this.valueAsString;
  },

  rollback() {}
};

export default StringChanger;
