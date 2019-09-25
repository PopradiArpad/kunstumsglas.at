/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {Component, PropTypes}  from 'react';
import {connect}              from 'react-redux';
import LoadingPage            from './LoadingPage';
import UserMenu               from './UserMenu';
import LoginSignup            from './LoginSignup';
import NewPassword            from './NewPassword';
import EntityView             from './EntityView';
import MainView               from './MainView';
import TranslationView        from './TranslationView';
import ErrorDialog            from './dialogs/ErrorDialog';
import {ErrorAcknowledged,
        IsLoggedIn,
        Logout,
        Login,
        Signup,
        SaveEntity,
        LoadEntity,
        Back,
        LoadTemporaryEntity,
        RemoveEntity,
        SetNewPassword,
        AddError
       } from '../actions';


//The only operational componnent (component that get reducer state)
export class App extends Component {
  constructor(){
    super(...arguments);

    this.state = {newPasswordPage:false};
    this.props.dispatch(new IsLoggedIn());
  }

  componentWillReceiveProps(nextProps) {
    //The password set was successfull: user is logged out
    //TODO make it explicit
    if (this.state.newPasswordPage && (! nextProps.user))
      this.setState({newPasswordPage:false})
  }

  render() {
    let mainComponent = this.getMainComponent();
    let errorDialog   = this.getErrorDialog();
    let userMenu      = this.getUserMenu();
    let back          = this.getBack();

    return (
      <div className="kugm-app">
        <div className="kugm-app-header">
          {back}
          <div className="kugm-app-header-title">
            KUG Verwaltung
          </div>
          {userMenu}
        </div>
        <div className="kugm-app-main">
          {mainComponent}
        </div>
        {errorDialog}
      </div>
    );
  }

  getBack() {
    if (! this.props.backAllowed)
      return null;

    return (<div className="kugm-app-header-back" onClick={this.dispatchBack}>
            </div>);
  }

  getUserMenu() {
    if (! this.props.user)
      return null;

    return <UserMenu user={this.props.user}
                     onLogout={this.dispatchLogout}
                     onNewPassword={this.showNewPasswordPage}/>;
  }

  getMainComponent() {
    if (this.state.newPasswordPage)
      return <NewPassword onSetNewPassword={this.dispatchSetNewPassword}
                          onCancel={this.hideNewPasswordPage}
                          onPasswordError={this.dispatchError}/>;

    if (this.props.user===undefined)
      return <LoadingPage/>;

    if (this.props.user===null)
      return <LoginSignup signupSucceeded={this.props.signupSucceeded}
                          registeringAllowed={this.props.registeringAllowed}
                          onSubmitLogin={this.dispatchLogin}
                          onSubmitSignup={this.dispatchSignup} />;

    if (this.props.entityDescription) {
      switch (this.props.entityDescription.identity.dbModel) {
        case 'Translation':
            return <TranslationView entityDescription={this.props.entityDescription}
                                    entityOverviews={this.props.entityOverviews}
                                    onSaveEntity={this.dispatchSaveEntity}/>;

        case 'MainView':
            return  <MainView entityDescription={this.props.entityDescription}
                              entityOverviews={this.props.entityOverviews}
                              onSelectEntity={this.dispatchLoadEntity}
                              onRemoveEntity={this.dispatchRemoveEntity}
                              onSaveEntity={this.dispatchSaveEntity}
                              onCreateNewEntity={this.dispatchLoadTemporaryEntity}/>;
        default:
            return  <EntityView entityDescription={this.props.entityDescription}
                                entityOverviews={this.props.entityOverviews}
                                onSelectEntity={this.dispatchLoadEntity}
                                onRemoveEntity={this.dispatchRemoveEntity}
                                onSaveEntity={this.dispatchSaveEntity}
                                onCreateNewEntity={this.dispatchLoadTemporaryEntity}/>;
      }
    }

    return <LoadingPage/>;
  }

  getErrorDialog() {
    return (this.props.error) ? <ErrorDialog appError={this.props.error} onFinished={this.dispatchErrorAcknowledged}/> : null;
  }

  dispatchErrorAcknowledged = () => {
    this.props.dispatch(new ErrorAcknowledged());
  }

  dispatchLogout = () => {
    this.props.dispatch(new Logout());
  }

  dispatchLogin = (name,password) => {
    this.props.dispatch(new Login(name,password));
  }

  dispatchSignup = (name,password) => {
    this.props.dispatch(new Signup(name,password));
  }

  dispatchLoadEntity = (identity) => {
    this.props.dispatch(new LoadEntity(identity));
  }

  dispatchRemoveEntity = (identity)=> {
    this.props.dispatch(new RemoveEntity(identity));
  }

  dispatchSaveEntity = (entityDescription) => {
    this.props.dispatch(new SaveEntity(entityDescription));
  }

  dispatchLoadTemporaryEntity = (parentIdentity,parentProperty,dbModelName) => {
    this.props.dispatch(new LoadTemporaryEntity(parentIdentity,parentProperty,dbModelName));
  }

  dispatchBack = (e) => {
    e.stopPropagation();
    this.props.dispatch(new Back());
  }

  dispatchSetNewPassword = (password,newPassword) => {
    this.props.dispatch(new SetNewPassword(password,newPassword));
  }

  dispatchError = (title,errorMessages) => {
    this.props.dispatch(new AddError(title,errorMessages));
  }

  showNewPasswordPage = () => {
    this.setState({newPasswordPage:true});
  }

  hideNewPasswordPage = () => {
    this.setState({newPasswordPage:false});
  }
}
App.propTypes = {
  user:                  PropTypes.object,
  signupSucceeded:       PropTypes.bool,
  registeringAllowed:    PropTypes.bool,
  entityDescription:     PropTypes.object,
  entityOverviews:       PropTypes.object,
  backAllowed:           PropTypes.bool.isRequired,
  error:                 PropTypes.object,
  dispatch:              PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
          user:                  state.auth.user,
          signupSucceeded:       state.auth.signupSucceeded,
          registeringAllowed:    state.auth.registeringAllowed,
          entityDescription:     state.entity.entityDescription,
          entityOverviews:       state.entity.entityOverviews,
          backAllowed:           state.entity.backAllowed,
          error:                 state.error.currentError
         };
}
export default connect(mapStateToProps)(App);
