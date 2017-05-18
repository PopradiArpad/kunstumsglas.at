/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component } from 'react';

class Copyright extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <div id="kug-copyright">
        Copyright 2017 Helga Popradi,
        Design and Implementation by
        <a href="http://popradiarpad.eu"> Árpád Poprádi</a>
      </div>
    );
  }
}

export default Copyright;
