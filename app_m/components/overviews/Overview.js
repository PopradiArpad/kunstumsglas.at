/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {Component, PropTypes}  from 'react';

export class Overview extends Component {
  constructor(){
    super(...arguments);
  }

  getPicPath(dbModel) {
    let picPath = `/item/${this.props.id}/smallPic?dbModel=${dbModel}`;
    let entityOverview = this.props.entityOverview;

    if (entityOverview && entityOverview.forcePicReload)
      picPath = picPath+`&${new Date().getTime()}`;

    return picPath;
  }

  //interface to CollectionsView
  getDOMNode() {
    return this.refs.me;//'me' MUST BE ON THE RENDERED MAIN ELEMENT!
  }
}

Overview.propTypes = {
  entityOverview:   PropTypes.object.isRequired,
  id:               PropTypes.string.isRequired,
  //interface to CollectionsView
  onClick:          PropTypes.func.isRequired
}

export default Overview;
