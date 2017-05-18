/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React                          from 'react';
import BoolPropertyView               from '../propertyViews/BoolPropertyView';
import PropertyState                  from './PropertyState';


function BoolPropertyState({propertyDescription,
                            onChanged,
                            onUnchanged}) {
  PropertyState.call(this,{propertyDescription,
                            onChanged,
                            onUnchanged});
}

BoolPropertyState.prototype = Object.create(PropertyState.prototype);
BoolPropertyState.prototype.constructor = BoolPropertyState;

BoolPropertyState.prototype.isFocusable = function () {
  return false;
}

BoolPropertyState.prototype.render = function(key) { // eslint-disable-line react/display-name
  let props = {
    key,
    propertyDescription:   this.workingPropertyDescription,
    onBack:                this.changed ? this.setBack : null,
    onMergePropertyChange: this.mergeChange
  };

  return <BoolPropertyView {...props} />;
}


export default BoolPropertyState;
