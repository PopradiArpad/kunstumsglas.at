/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component } from 'react';

class Main extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <div className="kug-main">
        {this.props.children}
      </div>
    );
  }
}
Main.propTypes = {
  children: React.PropTypes.object
};

export default Main;
