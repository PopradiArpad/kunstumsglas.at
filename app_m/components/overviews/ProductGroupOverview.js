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

export class ProductGroupOverview extends Overview {
  constructor(){
    super(...arguments);
  }

  render() {
    let entityOverview = this.props.entityOverview;
    let online         = entityOverview.online;
    let className= classnames("kugm-productgroupoverview",
                               {"online": online==='true'},
                               {"offline":online==='false'});

    return (
      <div ref="me"
           className={className}
           onClick={this.props.onClick}>
        {entityOverview.name}
      </div>
    );
  }
}

ProductGroupOverview.neededProperties = [
  'name',
  'online'
]

export default ProductGroupOverview;
