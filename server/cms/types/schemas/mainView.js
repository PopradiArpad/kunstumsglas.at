/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import mongoose   from 'mongoose';
import Translation from '../models/Translation';
import ProductGroup from '../models/ProductGroup';
import User from '../models/User';
let Types = mongoose.Schema.Types;

//The specific path options,that are not from Mongoose or Mongo:
// "title",
// "modelToCreate" contains the property name that contains the model name of the items to create in the id array
let mainView = mongoose.Schema({
  _id:            String,
  translations:   {type: [{type: Types.ObjectId, ref: 'Translation'}],  title: 'Übersetzungen'},
  productGroups:  {type: [{type: Types.ObjectId, ref: 'ProductGroup'}], title: 'Produktgruppen'},
  users:          {type: [{type: Types.ObjectId, ref: 'User'}],         title: 'Künstler'},
});

function link_to_mainview(cursor, mainview, mainview_field) {
  cursor.next().then(qr => {
    if (qr) {
      mainview.update({$push: {[mainview_field]: qr.id} })
      .then(()=>link_to_mainview(cursor, mainview, mainview_field));
    }
  });
}

mainView.methods.refresh = function() {
  return this.update({$set: {"translations": [], "productGroups": [], "users": []}} )
        .then(() => Translation.find({}, {"id":1}).cursor())
        .then(cursor => link_to_mainview(cursor, this, "translations"))
        .then(() => ProductGroup.find({}, {"id":1}).cursor())
        .then(cursor => link_to_mainview(cursor, this, "productGroups"))
        .then(() => User.find({}, {"id":1}).cursor())
        .then(cursor => link_to_mainview(cursor, this, "users"));
}


export default mainView;
