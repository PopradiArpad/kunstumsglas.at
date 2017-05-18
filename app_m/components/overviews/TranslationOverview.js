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

export class TranslationOverview extends Overview {
  constructor(){
    super(...arguments);
  }

  render() {
    let className= classnames("kugm-translationoverview");

    return (
      <div ref="me"
           className={className}
           onClick={this.props.onClick}>
        {this.props.entityOverview.translationOf}
      </div>
    );
  }
}

TranslationOverview.neededProperties = [
  'translationOf',
]

export default TranslationOverview;
