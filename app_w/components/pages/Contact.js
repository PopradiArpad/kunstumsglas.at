/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component } from 'react';
import {defineMessages}   from 'react-intl';
import HtmlText           from '../utils/HtmlText';

class Contact extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const messages = defineMessages({
      html: {
        id: "Kontakt_Inhalt_html",
        defaultMessage: `a`
      }});

    return (
      <div className="kug-contact">
          <HtmlText messageDescriptor={messages.html}/>
      </div>
    );
  }
}

export default Contact;
