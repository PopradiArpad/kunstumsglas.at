/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose   from 'mongoose';
import {LocalizedString}   from '../schemaTypes/TranslatedString';

let Types = mongoose.Schema.Types;
const schemaOptions = { discriminatorKey: 'kind' };


//The base schema
//The deriving happens through the discriminator mechanism of Mongoose.
//There are some app specific path option which are not from Mongoose or Mongo.
// "title",
// "extension",
// "multiline",
//etc
//The path order of schema.eachPath is
// first the pathes of the derived schema in the order defined in that schema
// second the pathes of the base schema in the order defined in that schema
export const product = mongoose.Schema({
  weight                             : {type: String, required: true, default: '', title: 'Gewicht', titleLocalized: true, forCustomer: true},
  price                              : {type: String, required: true, default: '', title: 'Preis', titleLocalized: true, forCustomer: true},
  listed                             : {type: Boolean, default:true, title: 'Gelistet'},
  bigPic                             : {type: Buffer, required: true, default: '', title: 'bigPic'},
  smallPic                           : {type: Buffer},
  kind                               : String //The name of the derived model. Let it visible
}, schemaOptions);

//The derived schemas
export const gelasertes = mongoose.Schema({
  //The belonging files (corelfile and machinefile)
  //are stored via GridFs under the name 'id/filename'
  nameline1                   : {type: [LocalizedString], required: true, default: [], title: 'Produktbezeichnung', forCustomer: true},
  productionprocedure         : {type: String, default: '', title: 'Produktionsablauf', multiline: true, forCustomer: true},
  lasertime                   : {type: String, default: '', title: 'Laserzeit'},
  corelfile                   : {type: Types.FileUploadStatus, default: 'NOT_UPLOADED', title: 'Corel File', extension: 'cdr'},
  machinefile                 : {type: Types.FileUploadStatus, default: 'NOT_UPLOADED', title: 'Laser File', extension: 'ME3'}
}, schemaOptions);

export const glasfusing = mongoose.Schema({
  nameline1                          : {type: [LocalizedString], required: true, default: [], title: 'Erste Namenszeile', forCustomer: true},
  nameline2                          : {type: [LocalizedString], default: [], title: 'Zweite Namenszeile', forCustomer: true},
  width                              : {type: String, default: '', title: 'Breite', titleLocalized: true, forCustomer: true},
  height                             : {type: String, default: '', title: 'Höhe', titleLocalized: true, forCustomer: true},
  diameter                           : {type: String, default: '', title: 'Durchmesser', titleLocalized: true, forCustomer: true},
  //for Blumenstecker
  stainlesssteelstick                : {type: String, default: '', title: 'Edelstahlstab', titleLocalized: true, forCustomer: true},
  metalstick                         : {type: String, default: '', title: 'Metalstab', titleLocalized: true, forCustomer: true},
}, schemaOptions);

export const waldglasGraviertes = mongoose.Schema({
  nameline1                          : {type: [LocalizedString], required: true, default: [], title: 'Erste Namenszeile', forCustomer: true},
  nameline2                          : {type: [LocalizedString], default: [], title: 'Zweite Namenszeile', forCustomer: true},
  diameter                           : {type: String, default: '', title: 'Durchmesser', titleLocalized: true, forCustomer: true},
  height                             : {type: String, required: true, default: '', title: 'Höhe', titleLocalized: true, forCustomer: true},
  usagetipp                          : {type: [LocalizedString], default: [], title: 'Verwendungstipp', titleLocalized: true, forCustomer: true}
}, schemaOptions);
