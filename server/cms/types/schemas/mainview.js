/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose   from 'mongoose';
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

export default mainView;
