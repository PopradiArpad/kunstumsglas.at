/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component,PropTypes } from 'react';

class ProductsGalleryItem extends Component {
  constructor() {
    super(...arguments);
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <div className="kug-productsgalleryitem" onClick={this.onClick}>
        <img src={`/item/${this.props.id}/smallPic?dbModel=Product`}/>
      </div>
    );
  }

  onClick(e) {
    e.stopPropagation();
    this.props.onProductSelected(this.props.id);
  }
}
ProductsGalleryItem.propTypes = {
  id:                PropTypes.string.isRequired,
  onProductSelected: PropTypes.func.isRequired
}

export default ProductsGalleryItem;
