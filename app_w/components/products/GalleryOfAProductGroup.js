/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, { Component,PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GalleryOfAProductGroupItem from './GalleryOfAProductGroupItem';

class GalleryOfAProductGroup extends Component {
  constructor() {
    super(...arguments);

    const galleryIx = this.props.gallery.length > 0 ? 0 : null;
    this.state={galleryIx};
  }

  render() {
    if (this.state.galleryIx===null)
      return null;

    const galleryItem = this.getGalleryItem();

    return (
        <ReactCSSTransitionGroup  className="kug-galleryofaproductgroup"
          transitionName="carousel"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}>
          {galleryItem}
        </ReactCSSTransitionGroup>
    );
  }

  componentDidMount() {
    if (this.state.galleryIx!==null)
      this.interval = setTimeout(this.startCarousel,2000 + (this.props.ix*2000));
  }

  componentWillUnmount() {
    if (this.interval)
      clearInterval(this.interval);
  }

  startCarousel = () => {
    this.interval = setInterval(this.nextGalleryItem,5000);
  }

  nextGalleryItem = () => {
    let galleryIx = this.state.galleryIx+1;

    if (galleryIx > (this.props.gallery.length-1))
      galleryIx = 0;

    this.setState({galleryIx});
  }

  getGalleryItem() {
    const galleryIx   = this.state.galleryIx;
    const galleryItem = this.props.gallery[galleryIx];

    return (<GalleryOfAProductGroupItem
             key={galleryIx}
             galleryItem={galleryItem}
             link={this.props.link}
             productGroupName={this.props.productGroupName}
           />);
  }
}
GalleryOfAProductGroup.propTypes = {
  gallery: PropTypes.array.isRequired,
  ix: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
  productGroupName: PropTypes.string.isRequired,
}

export default GalleryOfAProductGroup;
