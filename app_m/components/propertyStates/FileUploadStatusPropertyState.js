/* eslint react/display-name: 0 */
/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import FileUploadStatusPropertyView from '../propertyViews/FileUploadStatusPropertyView';
import PropertyState from './PropertyState';
import getFirstString from '../utils/getFirstString';

const FileUploadStatusPropertyState = {
  create({ propertyDescription, onChanged, onUnchanged, entityDescription }) {
    let propertyState = Object.create(FileUploadStatusPropertyState);

    propertyState.initPropertyState({
      propertyDescription,
      onChanged,
      onUnchanged
    });
    propertyState.identity = entityDescription.identity;
    propertyState.baseFileName = getFirstString(entityDescription);

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
      identity: this.identity,
      baseFileName: this.baseFileName
    };

    return <FileUploadStatusPropertyView {...props} />;
  }
};
Object.setPrototypeOf(FileUploadStatusPropertyState, PropertyState);

export default FileUploadStatusPropertyState;
