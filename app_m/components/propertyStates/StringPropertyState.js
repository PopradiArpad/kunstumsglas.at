/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React                          from 'react';
import StringPropertyView             from '../propertyViews/StringPropertyView';
import PropertyState                  from './PropertyState';


function StringPropertyState({propertyDescription,
                              onChanged,
                              onUnchanged,
                              onFocusSet,
                              onFocusReleased
                            }) {
  PropertyState.call(this,{propertyDescription,
                            onChanged,
                            onUnchanged});
  this.onFocusSet                 = onFocusSet;
  this.onFocusReleased            = onFocusReleased;
}

StringPropertyState.prototype = Object.create(PropertyState.prototype);
StringPropertyState.prototype.constructor = StringPropertyState;

StringPropertyState.prototype.isFocusable = function () {
  return true;
}

StringPropertyState.prototype.render = function(key,focused) { // eslint-disable-line react/display-name
  let props = {
    key,
    propertyDescription:   this.workingPropertyDescription,
    onBack:                this.changed ? this.setBack : null,
    onMergePropertyChange: this.mergeChange,
    onStartEdit:           this.onFocusSet,
    onFinishEdit:          this.onFocusReleased,
    focused
  };

  return <StringPropertyView {...props} />;
}


export default StringPropertyState;
