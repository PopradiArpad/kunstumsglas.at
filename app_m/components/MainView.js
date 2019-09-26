/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, { Component, PropTypes } from 'react';
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
          <div className="kugm-mainview-registeringAllowed">
            <form onSubmit={this.handleSubmit}>
              <label>
                registeringAllowed:
                <input type="checkbox" defaultChecked={this.props.registeringAllowed} onChange={this.handleChange} />
              </label>
            </form>
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
