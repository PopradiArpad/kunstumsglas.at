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

export class ProductOverview extends Overview {
  constructor(){
    super(...arguments);
  }

  render() {
    let style = {backgroundImage: 'url(' + this.getPicPath('Product') + ')'};
    let className= classnames("kugm-productoverview", {'not-listed':this.props.entityOverview.listed==='false'});

    return (
      <div ref="me" style={style}
           className={className}
           onClick={this.props.onClick}>
      </div>
    );
  }
}

ProductOverview.neededProperties = [
  'listed'
]

export default ProductOverview;
