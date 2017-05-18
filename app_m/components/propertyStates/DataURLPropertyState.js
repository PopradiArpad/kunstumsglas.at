/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React                          from 'react';
import DataURLPropertyView            from '../propertyViews/DataURLPropertyView';
import PropertyState                  from './PropertyState';


function DataURLPropertyState({propertyDescription,
                               onChanged,
                               onUnchanged}) {
  PropertyState.call(this,{propertyDescription,
                            onChanged,
                            onUnchanged});
}

DataURLPropertyState.prototype = Object.create(PropertyState.prototype);
DataURLPropertyState.prototype.constructor = DataURLPropertyState;

DataURLPropertyState.prototype.isFocusable = function () {
  return false;
}

DataURLPropertyState.prototype.render = function(key) { // eslint-disable-line react/display-name
  let props = {
    key,
    propertyDescription:   this.workingPropertyDescription,
    entityOverviews:       this.entityOverviews,
    onBack:                this.changed ? this.setBack : null,
    onMergePropertyChange: this.mergeChange
  };

  return <DataURLPropertyView {...props} />;
}


export default DataURLPropertyState;
