/* eslint react/display-name: 0 */
/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import BoolPropertyView from '../propertyViews/BoolPropertyView';
import PropertyState from './PropertyState';

const BoolPropertyState = {
  create({ propertyDescription, onChanged, onUnchanged }) {
    let propertyState = Object.create(BoolPropertyState);

    propertyState.initPropertyState({
      propertyDescription,
      onChanged,
      onUnchanged
    });

    return propertyState;
  },

  isFocusable() {
    return false;
  },

  render(key) {
    let props = {
      key,
      propertyDescription:   this.workingPropertyDescription,
      onBack:                this.changed ? this.setBack : null,
      onMergePropertyChange: this.mergeChange
    };

    return <BoolPropertyView {...props} />;
  }
};
Object.setPrototypeOf(BoolPropertyState, PropertyState);


export default BoolPropertyState;
