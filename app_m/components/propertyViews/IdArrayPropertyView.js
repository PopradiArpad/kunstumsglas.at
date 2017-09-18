/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import React, {PropTypes}      from 'react';
import classnames              from 'classnames';
import PropertyView            from './PropertyView';
import getOverviewConstructor  from '../overviews/getOverviewConstructor';
import CollectionsView         from '../CollectionsView';

class IdArrayPropertyView extends PropertyView {
  constructor(){
    super(...arguments);
  }

  render() {
    let back  = (this.props.onBack)   ? this.getBack()   : null;
    let propertyDescription = this.props.propertyDescription;
    let className= classnames("kugm-idarraypropertyview","propertyview");

    return (<div className={className}>
              {back}
              <CollectionsView title={propertyDescription.title}
                               ids={propertyDescription.ids}
                               createItem={this.createOverview}
                               createItemMenu={this.createOverviewMenu}
                               createBackgroundMenu={this.createBackgroundMenu}
                               reordeingAllowed={propertyDescription.reordeingAllowed}
                               onChangeOrder={this.onChangeItemOrder}/>
            </div>);
  }

  createOverview = (id,storeRef,onClick) => {
    let propertyDescription = this.props.propertyDescription;
    let referredDbModel     = propertyDescription.referredDbModel;
    let Overview            = getOverviewConstructor(referredDbModel);
    let entityOverviews     = this.props.entityOverviews;

    //TODO: store lastsaveditem property on the entityOverview if its needed for forcePicReload
    return <Overview  key={id}
                      entityOverview={entityOverviews[id]}
                      id={id}
                      ref={(c)=>storeRef(id,c)}
                      onClick={(e)=>onClick(e,id)}/>;
  }

  createOverviewMenu = (id) => {
    return (
      <div className="kugm-collectionsview-menu">
        <a href="#" onClick={(e)=>this.showEntity(e,id)}>Zeigen</a>
      </div>
    );
  }

  createBackgroundMenu = () => {
    if (! this.props.propertyDescription.createNewItemAllowed)
      return null;
    
      return (
      <div className="kugm-collectionsview-menu">
        <a href="#" onClick={this.createNewElement}>Neues Element</a>
      </div>
      );
  }

  showEntity(e,id) {
    e.stopPropagation();
    this.props.onSelectEntity({id,dbModel:this.props.propertyDescription.referredDbModel})
  }

  createNewElement = (e) => {
    e.stopPropagation();
    this.props.onCreateNewEntity(this.props.propertyDescription.referredDbModel)
  }

  onChangeItemOrder = (ids) => {
    this.props.onMergePropertyChange({ids});
  }

}
IdArrayPropertyView.propTypes = {
   propertyDescription:   PropTypes.object.isRequired,
   entityOverviews:       PropTypes.object.isRequired,
   onBack:                PropTypes.func,
   onMergePropertyChange: PropTypes.func.isRequired,
   onSelectEntity:        PropTypes.func.isRequired,
   onCreateNewEntity:     PropTypes.func.isRequired
}

IdArrayPropertyView.getEntityPropertyValuesRequests = (propertyDescription,entityOverviews) => {
  let referredDbModel  = propertyDescription.referredDbModel;
  let Overview         = getOverviewConstructor(referredDbModel);
  let neededProperties = Overview.neededProperties;

  return propertyDescription.ids.reduce(
          (a,id)=>{
            let entityPropertyValuesRequest = getEntityPropertyValuesRequest(id,
                                                                             referredDbModel,
                                                                             neededProperties,
                                                                             entityOverviews);
            return entityPropertyValuesRequest ? a.concat(entityPropertyValuesRequest) : a;
          },[]);
}

const getEntityPropertyValuesRequest = (id,
                                        dbModel,
                                        neededProperties,
                                        entityOverviews)=> {
  if (! entityOverviews[id])
    return new EntityPropertyValuesRequest(id,dbModel,neededProperties);

   let entityOverview    = entityOverviews[id];
   let missingProperties = neededProperties.reduce((a,p)=>
      entityOverview[p] ? a : a.concat(p),[]);

   return missingProperties.length
          ? new EntityPropertyValuesRequest(id,dbModel,missingProperties)
          : null;
}

//TODO: expose this type in GraphQL api
function EntityPropertyValuesRequest(id,dbModel,properties) {
  this.identity   = {id,dbModel};
  this.properties = properties;
}


export default IdArrayPropertyView;
