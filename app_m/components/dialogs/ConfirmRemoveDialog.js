/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {Component, PropTypes}  from 'react';
import ConfirmDialog  from './ConfirmDialog';

class ConfirmRemoveDialog extends Component {
    constructor(){
      super(...arguments);
    }

    render() {
      return <ConfirmDialog question={this.getQuestion()}
                            cancelText={"Nein, nein!"}
                            confirmText={"Ja, weg damit!"}
                            onCancel={this.props.onCancel}
                            onConfirm={this.props.onRemove}/>
    }

    getQuestion() {
      return (<div>
                Möchtest du das Element <br/>
                <strong>{this.props.name}</strong><br/>
                <strong>({this.props.dbModel})</strong><br/>
                wirklich löschen?
              </div>);
    }
}
ConfirmRemoveDialog.propTypes = {
  name:           PropTypes.string.isRequired,
  dbModel:        PropTypes.string.isRequired,
  onCancel:       PropTypes.func.isRequired,
  onRemove:       PropTypes.func.isRequired
}



export default ConfirmRemoveDialog;
