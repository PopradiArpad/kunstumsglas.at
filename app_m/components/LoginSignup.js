/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, {Component, PropTypes}  from 'react';
import classNames  from 'classnames';

class LoginSignup extends Component {
  constructor(){
    super(...arguments);
    this.state={name:'', password:'', login: true /*false means signup*/};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signupSucceeded && (! this.state.login))
      this.switchToLogin(true);
  }

  render() {
    let className  = classNames('kugm-loginsignup', {'kugm-loginsignup__signup': (! this.state.login)});
    let text       = this.state.login ? 'Login' : 'Registrieren';
    let switchText = this.switchText();

    return (
      <div className={className}>
        <div className="kugm-loginsignup-title">
          {text}
        </div>
        <form className="kugm-loginsignup-form" onSubmit={this.onSubmit}>
          Name:
          <input ref="name"
                 type="text"
                 value={this.state.name}
                 onChange={(e)=>this.setState({name: e.target.value})}/>
          Password:
          <input type="password"
                 value={this.state.password}
                 onChange={(e)=>this.setState({password: e.target.value})}/>
          <input type="submit" value={text} />
        </form>
        {switchText}
      </div>
    );
  }

  onSubmit = (e) => {
    e.preventDefault();

    let state  = this.state;
    let submit = state.login ? this.props.onSubmitLogin : this.props.onSubmitSignup;

    submit(state.name.trim(), state.password.trim());
    this.setState({name:'',password:''});
    }

  switchText() {
    if (this.state.login) {
      return (this.props.registeringAllowed)
             ? (<div className="kugm-loginsignup-switch">
                  Noch nicht registriert? <div className="kugm-loginsignup-switch-link" onClick={()=>this.switchToLogin(false)}>Registrieren</div>
                </div>)
             : null;
    }
    else {
      return (<div className="kugm-loginsignup-switch">
                Schon registriert? <div className="kugm-loginsignup-switch-link" onClick={()=>this.switchToLogin(true)}>Login</div>
              </div>);
    }
  }

  switchToLogin(login) {
    this.refs.name.focus();
    this.setState({login});
  }
}
LoginSignup.propTypes = {
  signupSucceeded:    PropTypes.bool,
  registeringAllowed: PropTypes.bool,
  onSubmitLogin:      PropTypes.func.isRequired,
  onSubmitSignup:     PropTypes.func.isRequired
}


export default LoginSignup;
