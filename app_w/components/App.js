/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {PropTypes, Component } from 'react';
import {connect}              from 'react-redux';
import Title from './Title';
import Navbar from './Navbar';
import Main from './Main';
import Info from './Info';
import Copyright from './Copyright';
import CookieBanner from './CookieBanner';
import { IntlProvider } from 'react-intl';
import {SetLocale
       } from '../actions';
import classnames from 'classnames';

let displayedCookiesNotification = document.cookie.includes('displayedCookiesNotification');

class App extends Component {
  constructor() {
    super(...arguments);
    this.props.dispatch(new SetLocale(getDefaultLocale()));
  }

  render() {
    const locale            = this.props.locale;
    if (! locale)
      return null;

    const lightOn           = this.isLightOn();
    const marginalLight     = lightOn ? 'marginal-light-on' : 'marginal-light-off';
    const localizedMessages = this.props.localizedMessages;
    const changeLocaleText  = this.getChangeLocalText();
    const info              = (this.isLandingPage()) ? <Info/> : null;
    const cookiebanner      = displayedCookiesNotification ? null :  <CookieBanner setVisited={this.setVisited}/>;
    const className         = classnames("kug-app",{'light-on': lightOn},{'light-off': ! lightOn})

    return (<IntlProvider locale={locale} messages={localizedMessages}>
              <div className={className}>
                <div className='kug-app-curtain'>
                  <header className={marginalLight}>
                    <Title  onChangeLocale={this.changeLocale}
                            changeLocaleText={changeLocaleText}/>
                    <Navbar location={this.props.location}/>
                  </header>
                  <Main children={this.props.children}/>
                  <footer className={marginalLight}>
                    {info}
                    <Copyright/>
                  </footer>
                  {cookiebanner}
                </div>
              </div>
            </IntlProvider>);
  }

  getChangeLocalText() {
    return (this.props.locale==='de-DE') ? 'English' : 'Deutsch';
  }

  changeLocale = () => {
    let locale = (this.props.locale==='de-DE') ? 'en-US' : 'de-DE';
    this.props.dispatch(new SetLocale(locale));
  }

  isLandingPage() {
    return this.props.location.pathname==='/';
  }

  isLightOn() {
    return ! this.props.location.pathname.match(/\/product\//);
  }

  setVisited = () => {
    document.cookie="displayedCookiesNotification=1";
    displayedCookiesNotification = true;
  }
}
App.propTypes = {
  children:          PropTypes.object,
  location:          PropTypes.object,
  locale:            PropTypes.string,
  localizedMessages: PropTypes.object,
  dispatch:          PropTypes.func.isRequired
};

const getDefaultLocale = () => {
  // Define user's language. Different browsers have the user locale defined
  // on different fields on the `navigator` object, so we make sure to account
  // for these different by checking all of them
  let locale  = (navigator.languages && navigator.languages[0])
                || navigator.language
                || navigator.userLanguage;

  const localeWithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0];

  return (localeWithoutRegionCode=='de') ? 'de-DE' : 'en-US';
}




const mapStateToProps = (state) => {
  return {
          locale:                  state.locale.locale,
          localizedMessages:       state.locale.localizedMessages
         };
}
export default connect(mapStateToProps)(App);
