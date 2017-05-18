/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React  from 'react';
import classnames from 'classnames';
import Overview from './Overview';

export class GalleryItemOverview extends Overview {
  constructor(){
    super(...arguments);
  }

  render() {
    const entityOverview = this.props.entityOverview;
    const className      = classnames("kugm-galleryitemoverview");
    const string1        = this.getFirstString(entityOverview.line1);
    const string2        = this.getFirstString(entityOverview.line2);

    return (
      <div ref="me"
           className={className}
           onClick={this.props.onClick}>
              <div>
                <img src={this.getPicPath('GalleryItem')}/>
              </div>
              <div className="kugm-galleryitemoverview-line">{string1}</div>
              <div className="kugm-galleryitemoverview-line">{string2}</div>
      </div>
    );
  }

  getFirstString(localizedStrings) {
    const asArray = JSON.parse(localizedStrings);

    if (asArray.length===0)
      return '';

    return asArray[0].string;
  }
}

GalleryItemOverview.neededProperties = [
  'line1',
  'line2'
]

export default GalleryItemOverview;
