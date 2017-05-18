/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component } from 'react';
import {browserHistory} from 'react-router';
import {defineMessages}   from 'react-intl';
import HtmlText           from '../utils/HtmlText';

class AboutUs extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const messages = defineMessages({
      html: {
        id: "Über_uns_Inhalt_html",
        defaultMessage: `a`
      }});

    return (
      <div ref='container' className="kug-aboutus">
        <HtmlText messageDescriptor={messages.html}/>
      </div>
    );
  }

  componentDidMount() {
    this.setupClickHandlers();
  }

  componentDidUpdate() {
    this.setupClickHandlers();
  }

  setupClickHandlers() {
    let artistNames = this.refs.container.querySelectorAll('[id^="artist-name-"]');
    let regExArtistName = /artist-name-(.*)/;

    for(let artistName of artistNames) {
      let id = artistName.id;
      let name = id.match(regExArtistName)[1];
      artistName.addEventListener('click',e=>this.toArtist(e,name));
    }
  }

  //To use in the html text
  toArtist(event,name) {
    event.stopPropagation();
    browserHistory.push(`/artist/${name}`);
  }
}


export default AboutUs;
