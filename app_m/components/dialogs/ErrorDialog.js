/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {Component, PropTypes}  from 'react';

class ErrorDialog extends Component {
    constructor(){
      super(...arguments);
    }

    render() {
      let key = 0;
      let messages = this.props.appError.errorMessages.map(m=><li key={key++}>{m}</li>);

      return (
        <div className="kugm-errordialog">
          <div className="kugm-errordialog-modal-content">
            <div className="kugm-message">
              Es passierte ein Fehler...<br/>
              <strong>{this.props.appError.title}</strong><br/>
              <ul>
                {messages}
              </ul>
              <div className="kugm-errordialog-button-goon" onClick={this.props.onFinished}>
                Na ja, weiter
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
ErrorDialog.propTypes = {
  appError:       PropTypes.object.isRequired,
  onFinished:     PropTypes.func.isRequired
}



export default ErrorDialog;
