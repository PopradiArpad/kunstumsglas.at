/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {PropTypes}  from 'react';
import classnames          from 'classnames';
import PropertyView        from './PropertyView';

class BoolPropertyView extends PropertyView {
    constructor(){
      super(...arguments);
    }

    render() {
      let back  = (this.props.onBack)   ? this.getBack()   : null;
      let bool  = this.props.propertyDescription.bool;
      let text  = bool ? 'ja' : 'nein';
      let className= classnames("kugm-boolpropertyview","propertyview");

      return (
        <div className={className}>
          {back}
          <div className="kugm-boolpropertyview-title">
            {this.props.propertyDescription.title}
          </div>
          <div className="kugm-boolpropertyview-value" onClick={this.change}>
            {text}
          </div>
        </div>
      );
    }

  change = (e) => {
    e.stopPropagation();
    this.props.onMergePropertyChange({bool:!this.props.propertyDescription.bool});
  }
}
BoolPropertyView.propTypes = {
   propertyDescription:    PropTypes.object.isRequired,
   onBack:                 PropTypes.func,
   onMergePropertyChange:  PropTypes.func.isRequired
}

export default BoolPropertyView;
