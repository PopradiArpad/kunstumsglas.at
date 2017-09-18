/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';

class ProductsGalleryItem extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <div className="kug-productsgalleryitem">
        <Link to={`/product/${this.props.pgId}/${this.props.id}`}>
          <img src={`/item/${this.props.id}/smallPic?dbModel=Product`}/>
        </Link>
      </div>
    );
  }
}
ProductsGalleryItem.propTypes = {
  id: PropTypes.string.isRequired,
  pgId: PropTypes.string.isRequired
}

export default ProductsGalleryItem;
