/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

const TranslatedStringsChanger = {
  create(entity, property, valueAsString) {
    let changer = Object.create(TranslatedStringsChanger);

    changer.entity = entity;
    changer.property = property;
    changer.valueAsString = valueAsString;

    return changer;
  },

  change() {
    const translatedStrings = JSON.parse(this.valueAsString).filter(
      ils => !ils.remove
    );

    this.entity[this.property] = translatedStrings;
  },

  rollback() {
    console.log('TranslatedStringsChanger.rollback not implemented');
  }
};

export default TranslatedStringsChanger;
