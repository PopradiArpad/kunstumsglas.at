/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, {Component} from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import App from './components/App';
import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
import DataProtectionPolicy from './components/pages/DataProtectionPolicy';
import Impressum from './components/pages/Impressum';
import ProductGroups from './components/products/ProductGroups';
import ProductGroupGallery from './components/products/ProductGroupGallery';
import ProductGallery from './components/products/ProductGallery';
import Artist from './components/Artist';
import { Provider } from 'react-redux';
import store from './store';

class Root extends Component {
  constructor() {
    super(...arguments);
  }

  //The url must have all the ids to identify all needed entities for the page (component)
  //even from a refresh
  //E.g ProductGallery needs the product group too to let work set next/previous product
  render() {
    return (<Provider store={store}>
              <Router history={history}>
                <Route path="/" component={App}>
                  <Switch>
                    <Route exact path="/" component={ProductGroups}/>
                    <Route path="productgroup/:pgid" component={ProductGroupGallery}/>
                    <Route path="product/:pgid/:pid" component={ProductGallery}/>
                    <Route path="artist/:artistName" component={Artist}/>
                    <Route path="aboutus" component={AboutUs}/>
                    <Route path="contact"  component={Contact}/>
                    <Route path="dataprotectionpolicy" component={DataProtectionPolicy}/>
                    <Route path="impressum" component={Impressum}/>
                  </Switch>
                </Route>
              </Router>
            </Provider>);
  }
}


export default Root;
