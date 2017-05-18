/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {Component, PropTypes}  from 'react';
import classNames  from 'classnames';

class NewPassword extends Component {
  constructor(){
    super(...arguments);
    this.onSubmit = this.onSubmit.bind(this);
    this.state={oldPassword:'', newPassword1:'', newPassword2:''};
  }

  render() {
    let className  = classNames('kugm-newpassword', {'kugm-loginsignup__signup': (! this.state.login)});

    return (
      <div className={className}>
        <div className="kugm-newpassword-title">
          Neues Passwort
        </div>
        <form className="kugm-newpassword-form" onSubmit={this.onSubmit}>
          Altes Passwort:
          <input ref="oldPassword"
                 type="password"
                 value={this.state.oldPassword}
                 onChange={(e)=>this.setState({oldPassword: e.target.value})}/>
          Neues Passwort:
          <input type="password"
                 value={this.state.newPassword1}
                 onChange={(e)=>this.setState({newPassword1: e.target.value})}/>
          Neues Passwort nochmal:
          <input type="password"
                 value={this.state.newPassword2}
                 onChange={(e)=>this.setState({newPassword2: e.target.value})}/>
          <input type="submit" value='Passwort setzen' />
        </form>
        <div className="kugm-newpassword-cancel" onClick={this.props.onCancel}>
          Abbrechen
        </div>
      </div>
    );
  }

  onSubmit(e) {
    e.preventDefault();

    let state  = this.state;

    if (state.newPassword1!==state.newPassword2)
      this.props.onPasswordError('Die zwei Passwörter müssen identisch sein!',[]);
    else
      this.props.onSetNewPassword(state.oldPassword,state.newPassword1);
    }
}
NewPassword.propTypes = {
  onSetNewPassword: PropTypes.func.isRequired,
  onCancel:         PropTypes.func.isRequired,
  onPasswordError:  PropTypes.func.isRequired
}


export default NewPassword;
