/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, { Component,PropTypes } from 'react';
import classnames from 'classnames';

class ProductGroupDescription extends Component {
  constructor() {
    super(...arguments);

    this.state={open:false}
  }

  render() {
    const props = this.props;
    const html = {__html:props.introduction_html};

    const className = classnames('kug-productgroupdescription',
                                 {[props.name]:true},
                                 {open:   this.state.open}
                               );
    return (
      <div className={className} onClick={this.openClose}>
        <div className="kug-productgroupdescription-title">
          {props.localizedName}
          <div className="kug-productgroupdescription-title-lock">
            &#8250;
          </div>
        </div>
        <div className="kug-productgroupdescription-textcontainer">
          <div className="kug-productgroupdescription-text" dangerouslySetInnerHTML={html}/>
        </div>
      </div>
    );
  }

  openClose = (e) => {
    e.stopPropagation();
    this.setState({open:!this.state.open});
  }
}
ProductGroupDescription.propTypes = {
  name:              PropTypes.string.isRequired,
  localizedName:  PropTypes.string.isRequired,
  introduction_html: PropTypes.string.isRequired
}


export default ProductGroupDescription;
