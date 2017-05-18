/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {PropTypes, Component}  from 'react';


class PropertyView extends Component {
    constructor(){
      super(...arguments);
      this.onBackPropertyView = this.onBackPropertyView.bind(this);
    }

  getBack() {
    return (
      <div className="kugm-propertyview-button-back" onClick={this.onBackPropertyView}>
        &#8592;
      </div>);
  }

  onBackPropertyView(e) {
    e.stopPropagation();
    this.props.onBack();
  }
}
PropertyView.propTypes = {
   onBack:                 PropTypes.func
}


export default PropertyView;
