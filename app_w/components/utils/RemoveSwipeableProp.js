/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React from 'react';

//To prevent render __passThrough prop of Swipeable (unknown prop causes React warning)
const RemoveSwipeableProp = (props) => {
    const { __passThrough, ...rest } = props; // eslint-disable-line
    return (<div {...rest}>
              {props.children}
            </div>);
}

export default RemoveSwipeableProp;
