/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React                          from 'react';
import LocalizedStringsPropertyView   from '../propertyViews/LocalizedStringsPropertyView';
import PropertyState                  from './PropertyState';


function LocalizedStringsPropertyState({propertyDescription,
                              onChanged,
                              onUnchanged,
                              onFocusSet,
                              onFocusReleased
                            }) {
  PropertyState.call(this,{propertyDescription,
                            onChanged,
                            onUnchanged});
  this.onFocusSet      = onFocusSet;
  this.onFocusReleased = onFocusReleased;
}

LocalizedStringsPropertyState.prototype = Object.create(PropertyState.prototype);
LocalizedStringsPropertyState.prototype.constructor = LocalizedStringsPropertyState;

LocalizedStringsPropertyState.prototype.isFocusable = function () {
  return true;
}

LocalizedStringsPropertyState.prototype.render = function(key,focused) { // eslint-disable-line react/display-name
  let props = {
    key,
    propertyDescription:   this.workingPropertyDescription,
    onBack:                this.changed ? this.setBack : null,
    onMergePropertyChange: this.mergeChange,
    onStartEdit:           this.onFocusSet,
    onFinishEdit:          this.onFocusReleased,
    focused
  };

  return <LocalizedStringsPropertyView {...props} />;
}


export default LocalizedStringsPropertyState;
