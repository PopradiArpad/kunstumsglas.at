/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {Component,PropTypes} from 'react';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

class Title extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <div className="kug-title">
        <div className="kug-title-top">
          <span className="kug-title-top-menu" onClick={this.menuClicked}>
            &#8801;
          </span>
          <span className="kug-title-top-text">
            <Link to="/">Kunst ums Glas</Link>
          </span>
        </div>
        <nav ref="nav">
          <Link to="/aboutus" className="kug-title-nav-item" onClick={this.closeMenu}>{this.AboutUs()}</Link>
          <Link to="/contact" className="kug-title-nav-item" onClick={this.closeMenu}>{this.Contact()}</Link>
          <div className="kug-title-nav-item" onClick={this.changeLocale}>
            {this.props.changeLocaleText}
          </div>
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

  menuClicked = () => {
    this.refs.nav.classList.toggle('open');
  }

  closeMenu = () => {
    this.refs.nav.classList.remove('open');
  }

  changeLocale = () => {
    this.props.onChangeLocale();
    this.closeMenu();
  }
}
Title.propTypes = {
  onChangeLocale:   PropTypes.func.isRequired,
  changeLocaleText: PropTypes.string.isRequired
}


export default Title;
