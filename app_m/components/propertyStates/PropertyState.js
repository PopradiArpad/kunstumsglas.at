/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import cloneDeep                      from 'lodash.clonedeep';
import isDeepEqual                    from 'lodash.isequal';
import merge                          from 'lodash.merge';


function PropertyState({propertyDescription,
                        onChanged,
                        onUnchanged}) {
  this.entityPropertyDescription  = propertyDescription;
  this.onChanged                  = onChanged;
  this.onUnchanged                = onUnchanged;

  this.workingPropertyDescription = cloneDeep(propertyDescription);
  this.changed                    = false;

  this.mergeChange = this.mergeChange.bind(this);
  this.setBack     = this.setBack.bind(this);
}

PropertyState.prototype = Object.create(Object.prototype);
PropertyState.prototype.constructor = PropertyState;

PropertyState.prototype.setBack = function () {
  this.workingPropertyDescription = cloneDeep(this.entityPropertyDescription);
  this.changed                    = false;
  this.onUnchanged();
}

PropertyState.prototype.mergeChange = function(toMerge) {
    merge(this.workingPropertyDescription,toMerge);
    this.setChanged();
  }

PropertyState.prototype.setChanged = function() {
  const changed = ! isDeepEqual(this.entityPropertyDescription,this.workingPropertyDescription);

  if (changed===this.changed)
    return;

  this.changed = changed;
  (changed) ? this.onChanged() : this.onUnchanged();
  }

PropertyState.prototype.getDiff = function() {
  return this.changed ? this.workingPropertyDescription : null;
  }



export default PropertyState;
