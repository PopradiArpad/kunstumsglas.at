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

    this.state = {registeringAllowed: true};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log('handleChange: registeringAllowed: ' + event.target.checked);
    this.setState({registeringAllowed: event.target.checked});
  }

  handleSubmit(event) {
    console.log('handleSubmit: registeringAllowed: ' + this.state.registeringAllowed);
    event.preventDefault();
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
                <input type="checkbox" value={this.state.registeringAllowed} onChange={this.handleChange} />
              </label>
              <span className="kugm-mainview-submit">
                <input type="submit" value="Submit" />
              </span>
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
  //edit mode
  onSelectEntity: PropTypes.func.isRequired,
  onRemoveEntity: PropTypes.func.isRequired,
  onSaveEntity: PropTypes.func.isRequired,
  onCreateNewEntity: PropTypes.func.isRequired
};

export default MainView;
