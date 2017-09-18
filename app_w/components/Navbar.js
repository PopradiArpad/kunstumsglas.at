/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, { Component } from 'react';
import {Link,browserHistory} from 'react-router';
import {FormattedMessage} from 'react-intl';
import {isDesktopDevice} from './utils/deviceInfo';

class Navbar extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const back       = <span className="kug-navbar-link" onClick={this.back}>{this.Back()}</span>;
    const links      = this.getLinks();
    const arrowUsage = this.getArrowUsage();

    return (
      <div className="kug-navbar">
        {back}
        {links}
        {arrowUsage}
      </div>
    );
  }

  getLinks() {
    let links = [];

    if (! this.isLandingPage())
      links.push(<Link className="kug-navbar-link" key="s" to="/">{this.StartPage()}</Link>);

    return links;
  }

  getArrowUsage() {
    return isDesktopDevice() && this.doesThisPageUseArrowKeys()
           ? this.UseArrowKeysToNavigate()
           : null;
  }

  back = () => {
    const pathname = this.props.location.pathname;

    const productGallery = pathname.match(/product\/(\w+)\/(\w+)/);
    if (productGallery)
      return browserHistory.push(`/productgroup/${productGallery[1]}`);

    const productGroup = pathname.match(/productgroup\/(\w+)/);
    if (productGroup)
      return browserHistory.push(`/`);

    browserHistory.goBack();
  }

  isLandingPage() {
    return this.props.location.pathname==='/';
  }

  doesThisPageUseArrowKeys() {
    const pathname = this.props.location.pathname;

    return pathname.match(/^\/productgroup\//) || pathname.match(/^\/product\//);
  }

  Back() {
    return (<FormattedMessage id={ 'Link_Zurück' } defaultMessage={ 'a' }/>);
  }

  StartPage() {
    return (<FormattedMessage id={ 'Link_zur_Start_Seite' } defaultMessage={ 'a' }/>);
  }

  UseArrowKeysToNavigate() {
    return (<span className='kug-navbar-arrowusage'><FormattedMessage id={ 'Benutzen_Sie_die_Pfeil_tasten_zum_Navigation' } defaultMessage={ 'a' }/></span>);
  }
}
Navbar.propTypes = {
  location: React.PropTypes.object
};

export default Navbar;
