/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, { Component,PropTypes } from 'react';
import {connect}                      from 'react-redux';
import ProductGroupDescription        from './ProductGroupDescription';
import Products                       from './Products';

class ProductGroup extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const productGroup = this.props.productGroup;

    if (! productGroup)
      return null;

    return (
      <div className="kug-productgroup">
        <ProductGroupDescription
          name={productGroup.name}
          localizedName={productGroup.localizedName}
          introduction_html={productGroup.introduction_html}
        />
        <Products
          ids={productGroup.productIds}
          pgId={this.props.productGroup.id}
        />
      </div>
    );
  }
}
ProductGroup.propTypes = {
  productGroup: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
          productGroup:    state.productGroup.productGroup,
         };
}

export default connect(mapStateToProps)(ProductGroup);
