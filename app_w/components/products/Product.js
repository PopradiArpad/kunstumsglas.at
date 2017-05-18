/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, { Component,PropTypes } from 'react';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';
import {isDesktopDevice} from '../utils/deviceInfo';


class Product extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const arrows = isDesktopDevice() ? this.getArrows() : null;

    return (
      <div className="kug-product">
        <div className="kug-product-img">
          <img src={`/item/${this.props.product.id}/bigPic?dbModel=Product`}/>
        </div>
        <div className="kug-product-properties">
          <div className="kug-product-properties-container">
            {arrows}
            {this.getProperties()}
          </div>
        </div>
      </div>
    );
  }

  getArrows() {
    return (<div key='arrows' className="kug-product-arrows-container">
              <div className="kug-product-left-arrow"  onClick={this.props.onPrevious}/>
              <div className="kug-product-right-arrow" onClick={this.props.onNext}/>
            </div>);
  }

  getProperties() {
    let components = [];
    const properties = this.props.product.properties;

    for(let property in this.props.product.properties)
      components.push(this.getProperty(property,properties[property]));

    components.push(this.getContactTheArtist());

    return components;
  }

  getProperty(property,propertyDescription) {
    const value = propertyDescription.value;

    if (! value)
      return null;

    const className = classnames('kug-product-property',{[property]:true});
    let title = propertyDescription.title;
    title = title ? `${title}: ` : '';

    return (<div key={property} className={className}>
              <span className='kug-product-property-title'>
                {title}
              </span>
              <span className='kug-product-property-value'>
                {value}
              </span>
            </div>);
  }

  getContactTheArtist() {
    const artistName = this.props.artistName;

    //TODO company email address must be a parameter
    if (artistName==='')
      return (<a key='contact' className='kug-product-contact' href="mailto:kunstumsglas@gmx.at">{this.ContactKug()}</a>);

    return (
      <Link key='contact' className='kug-product-contact' to={`/artist/${this.props.artistName}`}>
        {this.ContactTheArtist()}
      </Link>
    );
  }

  ContactTheArtist() {
    return (<FormattedMessage id={ 'Link_zum_Künstler_kontaktieren' } defaultMessage={ 'a' }/>);
  }

  ContactKug() {
    return (<FormattedMessage id={ 'KUG_kontaktieren' } defaultMessage={ 'a' }/>);
  }
}
Product.propTypes = {
  product:      PropTypes.object.isRequired,
  artistName:   PropTypes.string.isRequired,
  onNext:       PropTypes.func.isRequired,
  onPrevious:   PropTypes.func.isRequired
}

export default Product;
