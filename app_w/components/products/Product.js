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


const Value = ({property, children, ...restProps}) => {
    if ((property === 'nameline1') || (property === 'nameline2')) {
      return (
          <h1 {...restProps}>
            {children}
          </h1>);
    } else  {
      return (
          <span {...restProps}>
            {children}
          </span>);
    }}

class Product extends Component {
  constructor() {
    super(...arguments);
  }

  render() {
    const arrows = isDesktopDevice() ? this.getArrows() : null;
    const name = this.getName();

    return (
      <div className="kug-product">
        <div className="kug-product-img">
          <img src={`/item/${this.props.product.id}/bigPic?dbModel=Product`} alt={name}/>
        </div>
        <div className="kug-product-properties">
          <div className="kug-product-properties-container">
            {arrows}
            {this.getProperties()}
          </div>
        </div>
        {this.getProductDescription(name)}
      </div>
    );
  }

  getProductDescription(name) {
    let jsonLd = `{
            "@context": "http://schema.org/",
            "@type": "Product",
            "name": "${name}",
            "description": "${name}",
            "image": ${this.getImages()},
            "brand": {
              "@type": "LocalBusiness",
              "legalName": "Kunst ums Glas"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "EUR",
              "price": "${this.getPrice()}",
              "itemCondition": "http://schema.org/NewCondition",
              "availability": "http://schema.org/InStock",
              "url": "${this.getUrl()}"
            }
          }`;

    return (
        <script type="application/ld+json">
          {jsonLd}
        </script>);
  }

  getImages() {
    let props = this.props;

    if (props && props.product && props.product.id) {
      let pre = `https://kunstumsglas.at/item/${this.props.product.id}`;
      return `["${pre}/bigPic?dbModel=Product","${pre}/smallPic?dbModel=Product"]`;
    }

    return "";
  }

  getUrl() {
    let props = this.props;

    if (props && props.pgid && props.product && props.product.id) {
      return `https://kunstumsglas.at/product/${this.props.pgid}/${this.props.product.id}`;
    }

    return "";
  }

  getName() {
    const properties = this.props.product.properties;
    let name = "";

    name = this.addIfExist(name,properties,'nameline1');
    name = this.addIfExist(name,properties,'nameline2');

    return name;
  }

  getPrice() {
    const properties = this.props.product.properties;
    const price = properties && properties.price && properties.price.value;

    if (! price) {
      return "";
    }

    if (price.slice(-1) === "€") {
      return price.slice(0,-1);
    }

    return price;
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
              <Value property={property} className='kug-product-property-value'>
                {value}
              </Value>
            </div>);
  }

  addIfExist(alt,properties,propertyName) {
    if (properties[propertyName] && properties[propertyName].value) {
      return alt + properties[propertyName].value + " ";
    }

    return alt;
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
  onPrevious:   PropTypes.func.isRequired,
  pgid:         PropTypes.string,
}

export default Product;
