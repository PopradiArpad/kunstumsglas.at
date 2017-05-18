/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {Component, PropTypes}  from 'react';

class ConfirmDialog extends Component {
    constructor(){
      super(...arguments);
    }

    render() {
      return (
        <div className="kugm-confirmdialog">
          <div className="kugm-confirmdialog-modal-content">

            {this.props.question}

            <div className="kugm-confirmdialog-buttons">
              <div className="kugm-confirmdialog-buttons-cancel" onClick={this.props.onCancel}>
                {this.props.cancelText}
              </div>
              <div className="kugm-confirmdialog-buttons-confirm" onClick={this.props.onConfirm}>
                {this.props.confirmText}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
ConfirmDialog.propTypes = {
  question:       PropTypes.object.isRequired,
  cancelText:     PropTypes.string.isRequired,
  confirmText:    PropTypes.string.isRequired,
  onCancel:       PropTypes.func.isRequired,
  onConfirm:      PropTypes.func.isRequired
}



export default ConfirmDialog;
