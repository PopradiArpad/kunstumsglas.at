/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React                          from 'react';
import FileUploadStatusPropertyView   from '../propertyViews/FileUploadStatusPropertyView';
import PropertyState                  from './PropertyState';
import getFirstString                 from '../utils/getFirstString';


function FileUploadStatusPropertyState({propertyDescription,
                                        onChanged,
                                        onUnchanged,
                                        entityDescription}) {
  PropertyState.call(this,{propertyDescription,
                            onChanged,
                            onUnchanged});
  this.identity     = entityDescription.identity;
  this.baseFileName = getFirstString(entityDescription);
}

FileUploadStatusPropertyState.prototype = Object.create(PropertyState.prototype);
FileUploadStatusPropertyState.prototype.constructor = FileUploadStatusPropertyState;

FileUploadStatusPropertyState.prototype.isFocusable = function () {
  return false;
}

FileUploadStatusPropertyState.prototype.render = function(key) { // eslint-disable-line react/display-name
  let props = {
    key,
    propertyDescription:   this.workingPropertyDescription,
    entityOverviews:       this.entityOverviews,
    onBack:                this.changed ? this.setBack : null,
    onMergePropertyChange: this.mergeChange,
    identity:              this.identity,
    baseFileName:          this.baseFileName
  };

  return <FileUploadStatusPropertyView {...props} />;
}


export default FileUploadStatusPropertyState;
