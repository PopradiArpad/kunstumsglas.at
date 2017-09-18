/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, { Component,PropTypes } from 'react';
import {connect}                      from 'react-redux';
import ProductGroup from './ProductGroup';
import {Swipeable} from 'react-touch';
import {SetProductGroup,SetNextProductGroup,SetPreviousProductGroup}   from '../../actions';
import {isDesktopDevice} from '../utils/deviceInfo';
import RemoveSwipeableProp from '../utils/RemoveSwipeableProp';
import classnames                     from 'classnames';



class ProductGroupGallery extends Component {
  constructor() {
    super(...arguments);

    this.dispatchSetProductGroupIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.dispatchSetProductGroupIfNeeded(nextProps);
  }

  render() {
    const props  = this.props;

    if (! props.productGroup)
      return null;

    const className = classnames("kug-productgroupgallery",{[props.productGroup.name]:true});
    const arrows = isDesktopDevice() ? this.getArrows() : null;

    return (
      <div className={className}>
        <Swipeable onSwipeLeft={this.dispatchSetNextProductGroup} onSwipeRight={this.dispatchSetPreviousProductGroup}>
          <RemoveSwipeableProp>
            <ProductGroup productGroup={props.productGroup}/>
            {arrows}
          </RemoveSwipeableProp>
        </Swipeable>
      </div>
    );
  }

  componentDidMount() {
    document.onkeydown = this.navigate;
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }


  dispatchSetProductGroupIfNeeded(props) {
    //url takes precedence over state to let refresh work
    if (! props.productGroup || (props.productGroup.id !== props.params.pgid))
      this.props.dispatch(new SetProductGroup(props.params.pgid));
  }

  getArrows() {
    return (<div className="kug-productgroupgallery-arrows-container">
              <div className="kug-productgroupgallery-left-arrow"  onClick={()=>this.dispatchSetPreviousProductGroup()}/>
              <div className="kug-productgroupgallery-right-arrow" onClick={()=>this.dispatchSetNextProductGroup()}/>
            </div>);
  }

  dispatchSetNextProductGroup = () => {
    this.props.dispatch(new SetNextProductGroup(this.props.productGroup.id));
  }

  dispatchSetPreviousProductGroup = () => {
    this.props.dispatch(new SetPreviousProductGroup(this.props.productGroup.id));
  }

  navigate = (e) => {
    e.stopPropagation();
    switch (e.keyCode) {
      case 39:        return this.dispatchSetNextProductGroup();
      case 37:        return this.dispatchSetPreviousProductGroup();
      default:
    }
  }
}
ProductGroupGallery.propTypes = {
  productGroup: PropTypes.object,
  dispatch:     PropTypes.func.isRequired,
  location:     PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
          productGroup:    state.productGroup.productGroup
         };
}

export default connect(mapStateToProps)(ProductGroupGallery);
