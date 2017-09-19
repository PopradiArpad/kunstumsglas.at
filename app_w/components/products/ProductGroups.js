/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, { Component,PropTypes } from 'react';
import {connect} from 'react-redux';
import GalleryOfAProductGroup from './GalleryOfAProductGroup';

class ProductGroups extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const productGroupGalleries = this.getProductGroupGalleries();

    return (
      <div className="kug-productgroups">
        {productGroupGalleries}
      </div>
    );
  }

  getProductGroupGalleries() {
    const productGroups = this.props.productGroups;
    let   productGroupGalleries = productGroups.map((productGroup,ix)=>
        <GalleryOfAProductGroup key={productGroup.id}
                                gallery={productGroup.gallery}
                                ix={ix}
                                link={`/productgroup/${productGroup.id}`}
                                productGroupName={productGroup.localizedName}
                                />
    );

    return productGroupGalleries;
  }
}
ProductGroups.propTypes = {
  productGroups: PropTypes.array.isRequired,
  dispatch:      PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
          productGroups:    state.locale.landingPageData.productGroups,
         };
}

export default connect(mapStateToProps)(ProductGroups);
