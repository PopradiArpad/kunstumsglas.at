/* eslint react/display-name: 0 */
/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import IdArrayPropertyView from '../propertyViews/IdArrayPropertyView';
import PropertyState from './PropertyState';

const IdArrayPropertyState = {
  create({
    propertyDescription,
    entityOverviews,
    onChanged,
    onUnchanged,
    onSelectEntity,
    onCreateNewEntity
  }) {
    let propertyState = Object.create(IdArrayPropertyState);

    propertyState.initPropertyState({
      propertyDescription,
      onChanged,
      onUnchanged
    });

    propertyState.entityOverviews = entityOverviews;
    propertyState.onSelectEntity = onSelectEntity;
    propertyState.onCreateNewEntity = onCreateNewEntity;

    return propertyState;
  },

  isFocusable() {
    return false;
  },

  render(key) {
    let props = {
      key,
      propertyDescription: this.workingPropertyDescription,
      entityOverviews: this.entityOverviews,
      onBack: this.changed ? this.setBack : null,
      onMergePropertyChange: this.mergeChange,
      onSelectEntity: this.onSelectEntity,
      onCreateNewEntity: dbModelName => this.onCreateNewEntity(dbModelName)
    };

    return <IdArrayPropertyView {...props} />;
  }
};
Object.setPrototypeOf(IdArrayPropertyState, PropertyState);

export default IdArrayPropertyState;
