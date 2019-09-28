/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, { Component, PropTypes } from 'react';
import classnames                      from 'classnames';
import EntityView                      from './EntityView';

class MainView extends Component {
  constructor() {
    super(...arguments);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onSetRegisteringAllowed(event.target.checked);
  }

  render() {
    let classRegisteringAllowed = classnames("kugm-mainview-registeringAllowed",
                                             {"danger": this.props.registeringAllowed});

    return (
      <div className="kugm-mainview">
        <EntityView entityDescription={this.props.entityDescription}
                    entityOverviews={this.props.entityOverviews}
                    onSelectEntity={this.props.onSelectEntity}
                    onRemoveEntity={this.props.onRemoveEntity}
                    onSaveEntity={this.props.onSaveEntity}
                    onCreateNewEntity={this.props.onCreateNewEntity}/>
        <div className="kugm-collectionsview">
          <div className="kugm-collectionsview-openclose">
            General
          </div>
          <div className={classRegisteringAllowed}>
            <form onSubmit={this.handleSubmit}>
              <label>
                Neuen User zu registrieren ist erlaubt:
                <input type="checkbox" defaultChecked={this.props.registeringAllowed} onChange={this.handleChange} />
              </label>
            </form>
            <div className="kugm-mainview-registeringAllowed-warning-text">
              <ol>
                <li>Log out</li>
                <li>Registriere den neuen User</li>
                <li>Log in</li>
                <li>Setze dies wieder zurück!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
MainView.propTypes = {
  //view mode
  entityDescription: PropTypes.object.isRequired,
  entityOverviews: PropTypes.object.isRequired,
  registeringAllowed:    PropTypes.bool.isRequired,
  //edit mode
  onSelectEntity: PropTypes.func.isRequired,
  onRemoveEntity: PropTypes.func.isRequired,
  onSaveEntity: PropTypes.func.isRequired,
  onCreateNewEntity: PropTypes.func.isRequired,
  onSetRegisteringAllowed: PropTypes.func.isRequired,
};

export default MainView;
