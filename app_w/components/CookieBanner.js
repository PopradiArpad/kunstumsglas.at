/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component } from 'react';
import {Link} from 'react-router';
import {FormattedMessage} from 'react-intl';

class CookieBanner extends Component {
  constructor() {
    super(...arguments);
  }

  xClicked() {
    this.refs.me.classList.add("close");
    this.props.setVisited();
  }

  render() {
    return (
      <div className="kug-cookiebanner" ref="me">
        <div className="kug-cookiebanner-text">
          {this.CookieBannerText()}
          <span onClick={this.props.setVisited}><Link to="/dataprotectionpolicy">{this.DataProtectionPolicy()}</Link></span>
        </div>
        <div className="kug-cookiebanner-x" onClick={this.xClicked.bind(this)}>
          X
        </div>
      </div>
    );
  }
  CookieBannerText() {
    return (<FormattedMessage id={ 'Cookie_Banner_Text' } defaultMessage={ 'a' }/>);
  }

  DataProtectionPolicy() {
    return (<FormattedMessage id={ 'Link_zur_Datenschutzerklärung' } defaultMessage={ 'a' }/>);
  }
}
CookieBanner.propTypes = {
  setVisited: React.PropTypes.func
};

export default CookieBanner;
