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

export class UserOverview extends Overview {
  constructor(){
    super(...arguments);
  }

  render() {
    let style = {backgroundImage: 'url(' + this.getPicPath('User') + ')'};
    let className = classnames("kugm-useroverview");

    return (
      <div ref="me" style={style}
           className={className}
           onClick={this.props.onClick}>
      </div>
    );
  }
}

UserOverview.neededProperties = [
]

export default UserOverview;
