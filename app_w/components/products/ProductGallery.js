/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component,PropTypes } from 'react';
import {connect}                      from 'react-redux';
import Product from './Product';
import {Swipeable} from 'react-touch';
import {SetProduct,SetNextProduct,SetPreviousProduct}   from '../../actions';
import RemoveSwipeableProp from '../utils/RemoveSwipeableProp';


class ProductGallery extends Component {
  constructor() {
    super(...arguments);

    this.dispatchSetPreviousProduct = this.dispatchSetPreviousProduct.bind(this);
    this.dispatchSetNextProduct     = this.dispatchSetNextProduct.bind(this);
    this.navigate                   = this.navigate.bind(this);

    this.dispatchSetProductIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.dispatchSetProductIfNeeded(nextProps);
  }

  render() {
    const props  = this.props;

    if (! props.product)
      return null;

    return (
      <div className="kug-productgallery">
        <Swipeable onSwipeLeft={this.dispatchSetNextProduct} onSwipeRight={this.dispatchSetPreviousProduct}>
          <RemoveSwipeableProp>
            <Product product={props.product}
                     artistName={props.artistName}
                     onNext={this.dispatchSetNextProduct}
                     onPrevious={this.dispatchSetPreviousProduct}/>
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


  dispatchSetProductIfNeeded(props) {
    //url takes precedence over state to let refresh work
    if (! props.product || (props.product.id !== props.params.pid))
      this.props.dispatch(new SetProduct(props.params.pid,props.params.pgid));
  }

  dispatchSetNextProduct(e) {
    if (e)
      e.stopPropagation();

    this.props.dispatch(new SetNextProduct());
  }

  dispatchSetPreviousProduct(e) {
    if (e)
      e.stopPropagation();

    this.props.dispatch(new SetPreviousProduct());
  }

  navigate(e) {
    e.stopPropagation();
    switch (e.keyCode) {
      case 39:        return this.dispatchSetNextProduct();
      case 37:        return this.dispatchSetPreviousProduct();
      default:
    }
  }
}
ProductGallery.propTypes = {
  product:      PropTypes.object,
  artistName:   PropTypes.string,
  pgid:         PropTypes.string,
  dispatch:     PropTypes.func.isRequired,
  location:     PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
          product:    state.productGroup.product,
          artistName: state.productGroup.productGroup ? state.productGroup.productGroup.artistName : ''
         };
}

export default connect(mapStateToProps)(ProductGallery);
