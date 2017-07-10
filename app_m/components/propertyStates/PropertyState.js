/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import cloneDeep from 'lodash.clonedeep';
import isDeepEqual from 'lodash.isequal';
import merge from 'lodash.merge';

const PropertyState = {
  initPropertyState({ propertyDescription, onChanged, onUnchanged }) {
    this.entityPropertyDescription = propertyDescription;
    this.onChanged = onChanged;
    this.onUnchanged = onUnchanged;

    this.workingPropertyDescription = cloneDeep(propertyDescription);
    this.changed = false;

    //These functions are called not on the prototype chain!
    //TODO: call them explicit on the property state object
    this.mergeChange = this.mergeChange.bind(this);
    this.setBack = this.setBack.bind(this);
  },

  setBack() {
    this.workingPropertyDescription = cloneDeep(this.entityPropertyDescription);
    this.changed = false;
    this.onUnchanged();
  },

  mergeChange(toMerge) {
    merge(this.workingPropertyDescription, toMerge);
    this.setChanged();
  },

  setChanged() {
    const changed = !isDeepEqual(
      this.entityPropertyDescription,
      this.workingPropertyDescription
    );

    if (changed === this.changed) return;

    this.changed = changed;
    changed ? this.onChanged() : this.onUnchanged();
  },

  getDiff() {
    return this.changed ? this.workingPropertyDescription : null;
  }
};

export default PropertyState;
