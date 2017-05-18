/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component,PropTypes } from 'react';
import ProductsGalleryItem from './ProductsGalleryItem';

class Products extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const products = this.getProducts();

    return (
      <div className="kug-products">
        {products}
      </div>
    );
  }

  getProducts() {
    return this.props.ids.map(id=>
      <ProductsGalleryItem key={id}
                           id={id}
                           onProductSelected={this.props.onProductSelected}/>);
  }
}
Products.propTypes = {
  ids:               PropTypes.array.isRequired,
  onProductSelected: PropTypes.func.isRequired
}

export default Products;
