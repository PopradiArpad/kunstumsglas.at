/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';

class Info extends Component {
  constructor() {
    super(...arguments);
    this.menuClicked = this.menuClicked.bind(this);
  }

  menuClicked() {
    this.refs.me.classList.toggle('open');
  }

  render() {
    return (
      <div className="kug-info" ref="me">
        <div className="kug-info-menu" onClick={this.menuClicked}>
          Info
        </div>
        <nav>
          <Link to="/aboutus"              className="kug-info-nav-item">{this.AboutUs()}</Link>
          <Link to="/contact"              className="kug-info-nav-item">{this.Contact()}</Link>
          <Link to="/impressum"            className="kug-info-nav-item">{this.Impressum()}</Link>
          <Link to="/dataprotectionpolicy" className="kug-info-nav-item">{this.DataProtectionPolicy()}</Link>
        </nav>
      </div>
    );
  }

  AboutUs() {
    return (<FormattedMessage id={ 'Link_zum_Über_Uns' } defaultMessage={ 'a' }/>);
  }

  Contact() {
    return (<FormattedMessage id={ 'Link_zum_Kontakt' } defaultMessage={ 'a' }/>);
  }

  Impressum() {
    return (<FormattedMessage id={ 'Link_zum_Impressum' } defaultMessage={ 'a' }/>);
  }

  DataProtectionPolicy() {
    return (<FormattedMessage id={ 'Link_zum_Datenschutzerklärung' } defaultMessage={ 'a' }/>);
  }
}

export default Info;
