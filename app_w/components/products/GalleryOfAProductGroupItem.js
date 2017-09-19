/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';
import {defineMessages, injectIntl} from 'react-intl';

class GalleryOfAProductGroupItem extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const galleryItem = this.props.galleryItem;
    const line1 = galleryItem.line1;
    const line2 = galleryItem.line2;
    const alt=`${this.props.productGroupName} ${this.Produkte()}: ${line2}`

    return (
      <div className="kug-galleryofaproductgroupitem">
        <Link to={this.props.link}>
          <div className="kug-galleryofaproductgroupitem-img">
            <img src={`/item/${galleryItem.id}/smallPic?dbModel=GalleryItem`} alt={alt}/>
          </div>
          <div className="kug-galleryofaproductgroupitem-lines">
            <h1 className="kug-galleryofaproductgroupitem-line1">
              {line1}
            </h1>
            <h1 className="kug-galleryofaproductgroupitem-line2">
              {line2}
            </h1>
          </div>
        </Link>
      </div>
    );
  }
  Produkte() {
    const message = defineMessages({
      product: {
        id: "Produkte",
        defaultMessage: `a`
      }});
    return this.props.intl.formatMessage(message.product);
  }
}
GalleryOfAProductGroupItem.propTypes = {
  galleryItem: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
  productGroupName: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
}

export default injectIntl(GalleryOfAProductGroupItem);
