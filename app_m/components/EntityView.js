/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, { Component, PropTypes } from 'react';
import ConfirmRemoveDialog from './dialogs/ConfirmRemoveDialog';
import getPropertyStateType from './propertyStates/getPropertyStateType';
import getFirstString from './utils/getFirstString';
import merge from 'lodash.merge';
import isDeepEqual from 'lodash.isequal';

class EntityView extends Component {
  constructor() {
    super(...arguments);

    this.state = this.getResetState(this.props);
  }

  getResetState(props) {
    return {
      propertyStates: this.mkPropertyStates(props),
      focusedPropertyIx: null,
      //structure
      // {
      // property: ix in the this.state.propertyStates// if the property description is changed
      // }
      changedPropertiesMap: {}
    };
  }

  mkPropertyStates(props) {
    const entityOverviews = props.entityOverviews;
    const entityDescription = props.entityDescription;

    return entityDescription.propertyDescriptions.map(
      (propertyDescription, ix) =>
        this.mkPropertyState(
          entityDescription,
          propertyDescription,
          entityOverviews,
          ix
        )
    );
  }

  mkPropertyState(entityDescription, propertyDescription, entityOverviews, ix) {
    const Type = getPropertyStateType(propertyDescription.__typename);
    const property = propertyDescription.property;
    const identity = entityDescription.identity;

    const args = {
      propertyDescription,
      entityOverviews,
      onChanged: () => this.setChanged(property, ix),
      onUnchanged: () => this.setUnchanged(property),
      onFocusSet: e => this.setFocus(e, ix),
      onFocusReleased: () => this.setFocusOnNext(ix),
      onSelectEntity: this.props.onSelectEntity,
      onCreateNewEntity: dbModelName =>
        this.props.onCreateNewEntity(identity, property, dbModelName),
      entityDescription
    };

    return Type.create(args);
  }

  componentWillReceiveProps(nextProps) {
    if (isDeepEqual(this.props.entityDescription, nextProps.entityDescription))
      return;

    this.setState(this.getResetState(nextProps));
  }

  setChanged = (property, ix) => {
    const changedPropertiesMap = merge({}, this.state.changedPropertiesMap, {
      [property]: ix
    });

    this.setState({ changedPropertiesMap });
  }

  setUnchanged = (property) => {
    let changedPropertiesMap = merge({}, this.state.changedPropertiesMap);
    delete changedPropertiesMap[property];

    this.setState({ changedPropertiesMap });
  }

  setFocusOnNext = (ix) => {
    let nextIx = ix + 1;

    while (true) {
      // eslint-disable-line no-constant-condition
      let nextExternalComponentState = this.state.propertyStates[nextIx];

      if (nextExternalComponentState) {
        if (nextExternalComponentState.isFocusable())
          return this.setState({ focusedPropertyIx: nextIx });
        else nextIx++;
      } else return this.setState({ focusedPropertyIx: 0 });
    }
  }

  setFocus = (e, ix) => {
    e.stopPropagation();
    return this.setState({ focusedPropertyIx: ix });
  }

  removeFocus = (e) => {
    e.stopPropagation();
    return this.setState({ focusedPropertyIx: null });
  }

  render() {
    let controlPanel = this.getControlPanel();
    let propertyViews = this.getPropertyViews();

    return (
      <div className="kugm-entityview" onClick={this.removeFocus}>
        {this.state.dialog}
        {controlPanel}
        {propertyViews}
      </div>
    );
  }

  getControlPanel() {
    const entityChanged =
      Object.keys(this.state.changedPropertiesMap).length > 0;
    const removable = this.props.entityDescription.removable;
    const allBack = entityChanged ? this.getAllBackButton() : null;
    const remove = !entityChanged && removable ? this.getRemoveButton() : null;
    const save = entityChanged ? this.getSaveButton() : null;

    return (
      <div className="kugm-entityview-buttons">
        {allBack}
        {remove}
        {save}
      </div>
    );
  }

  getAllBackButton() {
    return (
      <div
        className="kugm-entityview-buttons-allback"
        key={'allBack'}
        onClick={this.setAllPropertyBack}
      >
        &#8592;
      </div>
    );
  }

  getRemoveButton() {
    return (
      <div
        className="kugm-entityview-buttons-remove"
        key={'remove'}
        onClick={this.askUserAboutRemoving}
      >
        &#9747;
      </div>
    );
  }

  getSaveButton() {
    return (
      <div
        className="kugm-entityview-buttons-save"
        key={'save'}
        onClick={this.saveEntity}
      >
        Speichern
      </div>
    );
  }

  getPropertyViews() {
    const focusedPropertyIx = this.state.focusedPropertyIx;

    return this.state.propertyStates.map((ecs, ix) =>
      ecs.render(ix, ix === focusedPropertyIx)
    );
  }

  setAllPropertyBack = (e) => {
    e.stopPropagation();
    this.state.propertyStates.map(ecs => ecs.setBack());
    //The callbacks from setBack come before a render can be triggered:
    //-> the unchanges don't accumute, here I assume the the setBacks really work :(
    this.setState({ changedPropertiesMap: {} });
  }

  askUserAboutRemoving = (e) => {
    e.stopPropagation();
    const entityDescription = this.props.entityDescription;
    const name = getFirstString(entityDescription);
    const identity = entityDescription.identity;
    const dbModel = identity.dbModel;

    this.setState({
      dialog: (
        <ConfirmRemoveDialog
          name={name}
          dbModel={dbModel}
          onCancel={() => this.setState({ dialog: null })}
          onRemove={() => {
            this.setState({ dialog: null });
            this.props.onRemoveEntity(identity);
          }}
        />
      )
    });
  }

  saveEntity = (e) => {
    e.stopPropagation();
    this.props.onSaveEntity(this.getEntityDescriptionDiff());
  }

  getEntityDescriptionDiff() {
    return {
      identity: this.props.entityDescription.identity,
      propertyDescriptions: this.getPropertyDescriptionDiff()
    };
  }

  getPropertyDescriptionDiff() {
    const changedPropertiesMap = this.state.changedPropertiesMap;
    const propertyStates = this.state.propertyStates;
    let changedExternalComponentStates = [];

    for (let changedProperty in changedPropertiesMap) {
      let ix = changedPropertiesMap[changedProperty];
      changedExternalComponentStates.push(propertyStates[ix]);
    }

    return changedExternalComponentStates.map(ecs => ecs.getDiff());
  }
}
EntityView.propTypes = {
  //view mode
  entityDescription: PropTypes.object.isRequired,
  entityOverviews: PropTypes.object.isRequired,
  //edit mode
  onSelectEntity: PropTypes.func.isRequired,
  onRemoveEntity: PropTypes.func.isRequired,
  onSaveEntity: PropTypes.func.isRequired,
  onCreateNewEntity: PropTypes.func.isRequired
};

export default EntityView;
