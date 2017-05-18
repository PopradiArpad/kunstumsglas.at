/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mkPropertyChanger   from './propertyChangers/mkPropertyChanger';
import getModel            from './getModel';

//Model is for entity that is (not yet) in the db
function EntityChanger(entity,data,db,model) {
  this.entity           = entity;
  this.data             = data;
  this.db               = db;
  this.model            = model;
  this.propertyChangers = [];
}

EntityChanger.prototype = Object.create(Object.prototype);

EntityChanger.prototype.changeEntity = function() {
  let model = this.model ? this.model : getModel(this.entity);

  this.propertyChangers = this.data.map(pv=>mkPropertyChanger(this.entity,
                                                              pv,
                                                              model,
                                                              this.db));
  return Promise.all(this.propertyChangers.map(pc=>pc.change()));
}

EntityChanger.prototype.rollback = function() {
  this.propertyChangers.map(pc=>pc.rollback());
}


export default EntityChanger;
