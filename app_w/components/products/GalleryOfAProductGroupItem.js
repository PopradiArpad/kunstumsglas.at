/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component,PropTypes } from 'react';

class GalleryOfAProductGroupItem extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const galleryItem = this.props.galleryItem;

    return (
      <div className="kug-galleryofaproductgroupitem">
        <div className="kug-galleryofaproductgroupitem-img">
          <img src={`/item/${galleryItem.id}/smallPic?dbModel=GalleryItem`}/>
        </div>
        <div className="kug-galleryofaproductgroupitem-lines">
          <div className="kug-galleryofaproductgroupitem-line1">
            {galleryItem.line1}
          </div>
          <div className="kug-galleryofaproductgroupitem-line2">
            {galleryItem.line2}
          </div>
        </div>
      </div>
    );
  }
}
GalleryOfAProductGroupItem.propTypes = {
  galleryItem: PropTypes.object.isRequired
}

export default GalleryOfAProductGroupItem;
