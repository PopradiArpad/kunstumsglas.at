/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React                          from 'react';
import IdArrayPropertyView            from '../propertyViews/IdArrayPropertyView';
import PropertyState                  from './PropertyState';


function IdArrayPropertyState({propertyDescription,
                               entityOverviews,
                               onChanged,
                               onUnchanged,
                               onSelectEntity,
                               onCreateNewEntity}) {
  PropertyState.call(this,{propertyDescription,
                            onChanged,
                            onUnchanged});

  this.entityOverviews            = entityOverviews;
  this.onSelectEntity             = onSelectEntity;
  this.onCreateNewEntity          = onCreateNewEntity;
}

IdArrayPropertyState.prototype = Object.create(PropertyState.prototype);
IdArrayPropertyState.prototype.constructor = IdArrayPropertyState;


IdArrayPropertyState.prototype.isFocusable = function () {
  return false;
}


IdArrayPropertyState.prototype.render = function(key) { // eslint-disable-line react/display-name
  let props = {
    key,
    propertyDescription:   this.workingPropertyDescription,
    entityOverviews:       this.entityOverviews,
    onBack:                this.changed ? this.setBack : null,
    onMergePropertyChange: this.mergeChange,
    onSelectEntity:        this.onSelectEntity,
    onCreateNewEntity:     (dbModelName) => this.onCreateNewEntity(dbModelName)
  };

  return <IdArrayPropertyView {...props} />;
}


export default IdArrayPropertyState;
