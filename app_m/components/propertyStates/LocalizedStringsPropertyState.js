/* eslint react/display-name: 0 */
/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import LocalizedStringsPropertyView from '../propertyViews/LocalizedStringsPropertyView';
import PropertyState from './PropertyState';

const LocalizedStringsPropertyState = {
  create({
    propertyDescription,
    onChanged,
    onUnchanged,
    onFocusSet,
    onFocusReleased
  }) {
    let propertyState = Object.create(LocalizedStringsPropertyState);

    propertyState.initPropertyState({
      propertyDescription,
      onChanged,
      onUnchanged
    });

    propertyState.onFocusSet = onFocusSet;
    propertyState.onFocusReleased = onFocusReleased;

    return propertyState;
  },

  isFocusable() {
    return true;
  },

  render(key, focused) {
    let props = {
      key,
      propertyDescription: this.workingPropertyDescription,
      onBack: this.changed ? this.setBack : null,
      onMergePropertyChange: this.mergeChange,
      onStartEdit: this.onFocusSet,
      onFinishEdit: this.onFocusReleased,
      focused
    };

    return <LocalizedStringsPropertyView {...props} />;
  }
};
Object.setPrototypeOf(LocalizedStringsPropertyState, PropertyState);

export default LocalizedStringsPropertyState;
